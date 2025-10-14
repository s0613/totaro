# Sora Extend Korean - 한국어 버전 소라 영상 확장기 (fal.ai)

**fal.ai**의 Sora 2 API를 사용하여 12초 제한을 넘어 긴 영상을 생성하는 한국어 버전 도구입니다.

## 🎯 주요 기능

- **프롬프트 분해**: AI가 긴 프롬프트를 여러 세그먼트로 나누어 계획
- **연속성 보장**: 각 세그먼트의 마지막 프레임을 다음 세그먼트의 시작점으로 사용
- **자동 연결**: 생성된 세그먼트들을 하나의 긴 영상으로 자동 연결
- **한국어 지원**: 모든 메시지와 프롬프트가 한국어로 제공

## 🚀 설치 방법

1. **필요한 패키지 설치**:
```bash
pip install -r requirements.txt
```

2. **API 키 설정**:

**OpenAI API 키** (GPT-4 프롬프트 계획용):
- https://platform.openai.com/api-keys 에서 생성

**fal.ai API 키** (Sora 비디오 생성용):
- https://fal.ai/dashboard/keys 에서 생성

```bash
# Windows (CMD)
set OPENAI_API_KEY=your-openai-key-here
set FAL_KEY=your-fal-key-here

# Windows (PowerShell)
$env:OPENAI_API_KEY="your-openai-key-here"
$env:FAL_KEY="your-fal-key-here"

# Linux/Mac
export OPENAI_API_KEY="your-openai-key-here"
export FAL_KEY="your-fal-key-here"
```

## 💻 사용 방법

### 기본 사용법
```bash
python sora_extend_korean.py
```

### 프로그래밍 방식 사용
```python
from sora_extend_korean import SoraExtendKorean

# Sora Extend 초기화 (두 개의 API 키 필요)
sora_extend = SoraExtendKorean(
    openai_api_key="your-openai-key",  # GPT-4용
    fal_api_key="your-fal-key"         # fal.ai Sora용
)

# 확장된 비디오 생성
final_video = sora_extend.generate_extended_video(
    base_prompt="미래 도시를 배경으로 한 자동차 드라이빙 영상",
    seconds_per_segment=8,  # 세그먼트당 8초 (4, 8, 12 중 선택)
    num_segments=3          # 총 3개 세그먼트 (24초 영상)
)
```

## ⚙️ 설정 옵션

- **base_prompt**: 기본 프롬프트 (영상의 전체적인 내용)
- **seconds_per_segment**: 각 세그먼트의 길이 (4, 8, 12초 권장)
- **num_segments**: 총 세그먼트 수 (총 영상 길이 = seconds_per_segment × num_segments)

## 📁 출력 파일

생성되는 파일들은 `sora_extended_videos/` 디렉토리에 저장됩니다:

- `segment_01.mp4`, `segment_02.mp4`, ... : 각 세그먼트 비디오
- `segment_01_last.jpg`, `segment_02_last.jpg`, ... : 각 세그먼트의 마지막 프레임
- `extended_video.mp4` : 최종 연결된 비디오

## 🔧 작동 원리

1. **프롬프트 계획**: GPT-4가 기본 프롬프트를 여러 세그먼트로 분해
2. **순차 생성**: 각 세그먼트를 Sora 2로 생성하며 이전 세그먼트의 마지막 프레임을 참조
3. **연속성 보장**: 마지막 프레임을 다음 세그먼트의 시작점으로 사용하여 자연스러운 연결
4. **자동 연결**: MoviePy를 사용하여 모든 세그먼트를 하나의 비디오로 연결

## 📋 요구사항

- Python 3.8+
- **OpenAI API 키** (GPT-4 프롬프트 계획용)
- **fal.ai API 키** (Sora 2 비디오 생성용)
- 충분한 디스크 공간 (세그먼트별로 비디오 파일 저장)
- 안정적인 인터넷 연결

## 💰 비용 안내

### OpenAI API (프롬프트 계획)
- GPT-4 사용량에 따라 소량의 비용 발생 (세그먼트당 ~$0.01)

### fal.ai API (비디오 생성)
- Sora 2 image-to-video Pro 모델 사용
- 비용은 fal.ai 요금제에 따라 다름
- 자세한 내용: https://fal.ai/pricing

## ⚠️ 주의사항

- fal.ai 계정 및 크레딧이 필요합니다
- 긴 영상 생성 시 상당한 시간이 소요될 수 있습니다 (세그먼트당 1-3분)
- API 사용량에 따라 비용이 발생합니다
- 첫 번째 세그먼트는 프롬프트만 사용, 이후 세그먼트는 이전 프레임을 참조합니다

## 🐛 문제 해결

### 일반적인 오류

1. **API 키 오류**:
   - `OPENAI_API_KEY`와 `FAL_KEY` 환경변수가 올바르게 설정되었는지 확인
   - fal.ai 대시보드에서 크레딧이 충분한지 확인

2. **fal.ai 크레딧 부족**:
   - https://fal.ai/dashboard 에서 크레딧 충전

3. **메모리 부족**:
   - 큰 비디오 파일 처리 시 충분한 RAM이 필요 (최소 4GB 권장)

4. **FFmpeg 오류**:
   - MoviePy 사용을 위해 FFmpeg가 설치되어 있어야 함

5. **이미지 업로드 실패**:
   - 네트워크 연결 확인
   - fal.ai 서비스 상태 확인

### FFmpeg 설치

**Windows**:
```bash
# Chocolatey 사용
choco install ffmpeg

# 또는 직접 다운로드
# https://ffmpeg.org/download.html
```

**macOS**:
```bash
brew install ffmpeg
```

**Linux**:
```bash
sudo apt update
sudo apt install ffmpeg
```

## 📞 지원

문제가 발생하거나 개선 사항이 있으면 이슈를 생성해 주세요.

## 🔗 유용한 링크

- **fal.ai 대시보드**: https://fal.ai/dashboard
- **fal.ai API 키 생성**: https://fal.ai/dashboard/keys
- **fal.ai 요금제**: https://fal.ai/pricing
- **Sora 2 API 문서**: https://fal.ai/models/fal-ai/sora-2/image-to-video/pro/api
- **OpenAI API 키**: https://platform.openai.com/api-keys

## 📄 라이선스

이 프로젝트는 Matt Shumer의 원본 Sora Extend를 기반으로 하며, fal.ai API를 사용하도록 수정된 한국어 버전입니다.

---

**즐거운 영상 생성 되세요! 🎬✨**

