# Supabase MCP 연동 설정 가이드

## 현재 상태

✅ **완료된 작업:**
1. `.mcp.json` - MCP Postgres 서버 설정 완료
2. `database/schema.sql` - 완전한 데이터베이스 스키마 준비
3. `database/setup_db.py` - 스키마 자동 설정 스크립트 준비
4. `backend/services/supabase_client.py` - Supabase 서비스 클라이언트 구현 완료
5. `test_supabase.py` - 연결 테스트 스크립트 준비

❌ **현재 문제:**
- DNS 조회 실패: `cvjwtmvtzqkxolvqyipi.supabase.co` 도메인에 접근할 수 없음
- 네트워크 환경에서 `*.supabase.co` 도메인이 차단되었거나 DNS 필터링 중일 가능성

## 네트워크 문제 해결 후 설정 방법

### 1. Supabase 대시보드에서 정확한 연결 정보 확인

https://supabase.com/dashboard/project/cvjwtmvtzqkxolvqyipi

**Settings → Database → Connection string:**
- **Transaction pooler** 또는 **Session pooler** 선택
- URI 전체 복사

형식 예시:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

### 2. .env 파일 업데이트

```bash
SUPABASE_URL=https://cvjwtmvtzqkxolvqyipi.supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_KEY=[your-service-role-key]
DATABASE_URL=[복사한-connection-string]
DATABASE_PASSWORD=qhfktor22!
```

### 3. 데이터베이스 스키마 설정

```bash
cd database
python setup_db.py
```

### 4. MCP 서버 테스트

Claude Code를 재시작하면 `.mcp.json` 설정이 자동으로 로드됩니다.

MCP 서버가 성공적으로 연결되면 다음 도구들을 사용할 수 있습니다:
- `query` - SQL 쿼리 실행
- `list_tables` - 테이블 목록 조회
- `describe_table` - 테이블 구조 조회

### 5. 백엔드에서 Supabase 사용

```python
from backend.services.supabase_client import get_supabase_service

# Supabase 서비스 가져오기
supabase = get_supabase_service()

# 작업 생성
job = supabase.create_job(
    user_id="user-uuid",
    prompt="영상 생성 프롬프트",
    config={"seconds_per_segment": 8, "num_segments": 4}
)

# 작업 상태 업데이트
supabase.update_job(
    job_id=job["id"],
    status="generating",
    progress=0.5
)

# 작업 로그 추가
supabase.add_job_log(
    job_id=job["id"],
    message="세그먼트 1 생성 시작",
    level="INFO"
)
```

## 데이터베이스 스키마 구조

### 테이블:
1. **users** - 사용자 정보 (Supabase Auth 연동)
2. **jobs** - 영상 생성 작업
3. **job_logs** - 작업 로그

### ENUM 타입:
- **job_status**: queued, planning, generating, merging, completed, failed

### RLS (Row Level Security):
- 모든 테이블에 RLS 활성화
- 사용자는 자신의 데이터만 접근 가능

## 네트워크 문제 해결 방법

### 1. VPN 사용
일부 네트워크에서 Supabase 차단 시 VPN으로 우회

### 2. DNS 서버 변경
- Google DNS: 8.8.8.8, 8.8.4.4
- Cloudflare DNS: 1.1.1.1, 1.0.0.1

Windows에서 DNS 변경:
```
제어판 → 네트워크 및 인터넷 → 네트워크 연결
→ 어댑터 속성 → IPv4 속성 → DNS 서버 변경
```

### 3. Hosts 파일 직접 설정 (임시)
IP 주소를 알고 있다면:
```
C:\Windows\System32\drivers\etc\hosts
```
파일에 추가:
```
[IP] cvjwtmvtzqkxolvqyipi.supabase.co
```

### 4. 다른 네트워크 시도
- 모바일 핫스팟
- 다른 Wi-Fi
- 유선 인터넷

## 문의사항

네트워크 문제 해결 후에도 연결이 안 되면:
1. Supabase 대시보드에서 프로젝트가 **ACTIVE_HEALTHY** 상태인지 확인
2. Database 비밀번호가 정확한지 확인
3. API Keys가 만료되지 않았는지 확인
