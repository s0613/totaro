#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Supabase 클라이언트 서비스
"""

import os
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()


class SupabaseService:
    """Supabase 데이터베이스 작업을 위한 서비스 클래스"""

    def __init__(self):
        """Supabase 클라이언트 초기화"""
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_ANON_KEY")

        if not self.url or not self.key:
            raise ValueError("SUPABASE_URL과 SUPABASE_SERVICE_KEY 환경변수가 필요합니다.")

        self.client: Client = create_client(self.url, self.key)

    # ============================================
    # Jobs 테이블 관련 메서드
    # ============================================

    def create_job(
        self,
        user_id: str,
        prompt: str,
        config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """새 작업 생성

        Args:
            user_id: 사용자 ID
            prompt: 비디오 생성 프롬프트
            config: 작업 설정 (seconds_per_segment, num_segments, resolution 등)

        Returns:
            생성된 작업 정보
        """
        data = {
            "user_id": user_id,
            "prompt": prompt,
            "config": config,
            "status": "queued",
            "progress": 0.0
        }

        result = self.client.table("jobs").insert(data).execute()
        return result.data[0] if result.data else None

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        """작업 정보 조회

        Args:
            job_id: 작업 ID

        Returns:
            작업 정보 또는 None
        """
        result = self.client.table("jobs").select("*").eq("id", job_id).execute()
        return result.data[0] if result.data else None

    def update_job(
        self,
        job_id: str,
        status: Optional[str] = None,
        progress: Optional[float] = None,
        result_path: Optional[str] = None,
        error_message: Optional[str] = None
    ) -> Dict[str, Any]:
        """작업 상태 업데이트

        Args:
            job_id: 작업 ID
            status: 작업 상태 (queued, planning, generating, merging, completed, failed)
            progress: 진행률 (0.0 ~ 1.0)
            result_path: 결과 파일 경로
            error_message: 에러 메시지

        Returns:
            업데이트된 작업 정보
        """
        data = {}
        if status is not None:
            data["status"] = status
        if progress is not None:
            data["progress"] = progress
        if result_path is not None:
            data["result_path"] = result_path
        if error_message is not None:
            data["error_message"] = error_message

        if status == "completed":
            data["completed_at"] = "now()"

        result = self.client.table("jobs").update(data).eq("id", job_id).execute()
        return result.data[0] if result.data else None

    def get_user_jobs(
        self,
        user_id: str,
        limit: int = 20,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """사용자의 작업 목록 조회

        Args:
            user_id: 사용자 ID
            limit: 최대 개수
            offset: 오프셋

        Returns:
            작업 목록
        """
        result = (
            self.client.table("jobs")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .range(offset, offset + limit - 1)
            .execute()
        )
        return result.data if result.data else []

    # ============================================
    # Job Logs 테이블 관련 메서드
    # ============================================

    def add_job_log(
        self,
        job_id: str,
        message: str,
        level: str = "INFO"
    ) -> Dict[str, Any]:
        """작업 로그 추가

        Args:
            job_id: 작업 ID
            message: 로그 메시지
            level: 로그 레벨 (DEBUG, INFO, WARNING, ERROR)

        Returns:
            생성된 로그 정보
        """
        data = {
            "job_id": job_id,
            "message": message,
            "level": level
        }

        result = self.client.table("job_logs").insert(data).execute()
        return result.data[0] if result.data else None

    def get_job_logs(
        self,
        job_id: str,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """작업 로그 조회

        Args:
            job_id: 작업 ID
            limit: 최대 개수

        Returns:
            로그 목록
        """
        result = (
            self.client.table("job_logs")
            .select("*")
            .eq("job_id", job_id)
            .order("timestamp", desc=True)
            .limit(limit)
            .execute()
        )
        return result.data if result.data else []

    # ============================================
    # Users 테이블 관련 메서드
    # ============================================

    def get_or_create_user(self, user_id: str, email: str) -> Dict[str, Any]:
        """사용자 정보 조회 또는 생성

        Args:
            user_id: 사용자 ID
            email: 이메일

        Returns:
            사용자 정보
        """
        # 먼저 조회
        result = self.client.table("users").select("*").eq("id", user_id).execute()

        if result.data:
            return result.data[0]

        # 없으면 생성
        data = {"id": user_id, "email": email}
        result = self.client.table("users").insert(data).execute()
        return result.data[0] if result.data else None

    def update_user_last_login(self, user_id: str) -> Dict[str, Any]:
        """사용자 마지막 로그인 시간 업데이트

        Args:
            user_id: 사용자 ID

        Returns:
            업데이트된 사용자 정보
        """
        data = {"last_login": "now()"}
        result = self.client.table("users").update(data).eq("id", user_id).execute()
        return result.data[0] if result.data else None


# 싱글톤 인스턴스 (선택적)
_supabase_service: Optional[SupabaseService] = None


def get_supabase_service() -> SupabaseService:
    """Supabase 서비스 싱글톤 인스턴스 반환"""
    global _supabase_service
    if _supabase_service is None:
        _supabase_service = SupabaseService()
    return _supabase_service
