#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Supabase 데이터베이스 스키마 자동 설정 스크립트
"""

import os
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

# .env 파일 로드
load_dotenv()

def setup_database():
    """Supabase 데이터베이스에 스키마 생성"""

    # 데이터베이스 연결 정보
    database_url = os.getenv("DATABASE_URL")
    database_password = os.getenv("DATABASE_PASSWORD")

    if not database_url:
        print("[ERROR] DATABASE_URL 환경변수가 설정되지 않았습니다.")
        return False

    # [PASSWORD] 플레이스홀더를 실제 비밀번호로 치환
    if "[PASSWORD]" in database_url and database_password:
        database_url = database_url.replace("[PASSWORD]", database_password)

    print("[*] Supabase 데이터베이스 설정 시작...")
    print(f"[*] 연결 URL: {database_url.split('@')[1] if '@' in database_url else 'hidden'}")

    try:
        # 데이터베이스 연결
        print("[*] 데이터베이스 연결 중...")
        conn = psycopg2.connect(database_url)
        conn.autocommit = True
        cursor = conn.cursor()

        print("[OK] 데이터베이스 연결 성공!")

        # SQL 파일 읽기
        sql_file = Path(__file__).parent / "schema.sql"

        if not sql_file.exists():
            print(f"[ERROR] 오류: {sql_file} 파일을 찾을 수 없습니다.")
            return False

        print(f"[*] SQL 파일 읽기: {sql_file.name}")

        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()

        # SQL 실행
        print("[*] 스키마 생성 중...")
        cursor.execute(sql_content)

        print("[OK] 스키마 생성 완료!")

        # 테이블 확인
        print("\n[*] 생성된 테이블 확인:")
        cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        """)

        tables = cursor.fetchall()
        for table in tables:
            print(f"   - {table[0]}")

        # ENUM 타입 확인
        print("\n[*] 생성된 ENUM 타입:")
        cursor.execute("""
            SELECT typname
            FROM pg_type
            WHERE typtype = 'e'
            ORDER BY typname;
        """)

        enums = cursor.fetchall()
        for enum in enums:
            print(f"   - {enum[0]}")

        # 연결 종료
        cursor.close()
        conn.close()

        print("\n[SUCCESS] 데이터베이스 설정 완료!")
        print("=" * 50)

        return True

    except psycopg2.Error as e:
        print(f"\n[ERROR] 데이터베이스 오류 발생:")
        print(f"   {e}")
        return False

    except Exception as e:
        print(f"\n[ERROR] 예상치 못한 오류 발생:")
        print(f"   {e}")
        return False


if __name__ == "__main__":
    success = setup_database()
    exit(0 if success else 1)
