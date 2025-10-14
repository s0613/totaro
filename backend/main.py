#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import uuid
import threading
import traceback
from pathlib import Path
from typing import Dict, Optional

# 상위 디렉토리를 Python 경로에 추가
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from sora_extend_korean import SoraExtendKorean


class GenerateRequest(BaseModel):
    base_prompt: str = Field(..., description="기본 프롬프트")
    seconds: int = Field(8, description="세그먼트 길이(4/8/12)")
    segments: int = Field(4, description="세그먼트 개수(4 이상 권장)")
    resolution: Optional[str] = Field("720p")
    aspect: Optional[str] = Field("16:9")
    planner_model: Optional[str] = None
    fal_model: Optional[str] = None


class GenerateResponse(BaseModel):
    job_id: str


class StatusResponse(BaseModel):
    job_id: str
    status: str
    message: str = ""
    progress: float = 0.0


class ResultResponse(BaseModel):
    job_id: str
    final_path: Optional[str] = None
    download_url: Optional[str] = None


class JobState:
    def __init__(self) -> None:
        self.status = "queued"
        self.message = ""
        self.progress = 0.0
        self.final_path: Optional[Path] = None


JOBS: Dict[str, JobState] = {}


def _update_progress(job: JobState, val: float, message: str = ""):
    job.progress = max(0.0, min(1.0, val))
    if message:
        job.message = message


def _run_generation(job_id: str, req: GenerateRequest):
    job = JOBS[job_id]
    job.status = "running"
    job.message = "계획 생성 중"
    try:
        openai_key = os.getenv("OPENAI_API_KEY")
        fal_key = os.getenv("FAL_KEY")
        if not openai_key or not fal_key:
            raise RuntimeError("환경변수 OPENAI_API_KEY / FAL_KEY 설정 필요")

        sora = SoraExtendKorean(
            openai_api_key=openai_key,
            fal_api_key=fal_key,
        )
        if req.planner_model:
            sora.planner_model = req.planner_model
        if req.fal_model:
            sora.fal_model = req.fal_model
        if req.resolution:
            sora.resolution = req.resolution
        if req.aspect:
            sora.aspect_ratio = req.aspect

        # 진행률: 계획(0.1), 세그먼트(0.8), 병합(0.1)
        _update_progress(job, 0.05, "플랜 생성")
        segments = sora.plan_prompts(req.base_prompt, req.seconds, req.segments)
        _update_progress(job, 0.1, f"세그먼트 {len(segments)}개 생성 시작")

        # 실제 생성은 내부에서 진행 로그를 출력하므로 단계 기반으로만 업데이트
        final_path = sora.generate_extended_video(
            base_prompt=req.base_prompt,
            seconds_per_segment=req.seconds,
            num_segments=req.segments,
        )

        job.final_path = final_path
        job.status = "success"
        _update_progress(job, 1.0, "완료")

    except Exception as e:
        job.status = "error"
        job.message = f"오류: {e}"
        traceback.print_exc()


app = FastAPI(title="Sora Extend Korean API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
def healthz():
    return {"ok": True}


@app.post("/api/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest):
    job_id = uuid.uuid4().hex
    JOBS[job_id] = JobState()
    thread = threading.Thread(target=_run_generation, args=(job_id, req), daemon=True)
    thread.start()
    return GenerateResponse(job_id=job_id)


@app.get("/api/status/{job_id}", response_model=StatusResponse)
def status(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        return StatusResponse(job_id=job_id, status="not_found", message="존재하지 않는 작업", progress=0.0)
    return StatusResponse(job_id=job_id, status=job.status, message=job.message, progress=job.progress)


@app.get("/api/result/{job_id}", response_model=ResultResponse)
def result(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        return ResultResponse(job_id=job_id)
    final_path = str(job.final_path) if job.final_path else None
    # 간단히 경로만 반환(프런트에서 파일 경로를 안내)
    return ResultResponse(job_id=job_id, final_path=final_path, download_url=None)


# 정적 파일은 마지막에 마운트 (API 엔드포인트가 우선)
FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
