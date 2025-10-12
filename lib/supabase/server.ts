/**
 * Supabase Server Client
 *
 * Next.js 서버 컴포넌트 및 API 라우트에서 사용하는 Supabase 클라이언트
 * cookies를 통한 세션 관리
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Server Component에서 set이 실패할 수 있음 (읽기 전용)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Server Component에서 remove가 실패할 수 있음 (읽기 전용)
          }
        },
      },
    }
  );
}

/**
 * Admin Client (서버 사이드 전용)
 *
 * service_role 키를 사용하여 RLS를 우회하는 관리자 클라이언트
 * ⚠️ 주의: 절대 클라이언트 코드에서 사용하지 말 것!
 */
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() {
          return undefined;
        },
        set() {},
        remove() {},
      },
    }
  );
}
