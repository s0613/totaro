/**
 * Supabase Client (Browser)
 *
 * 브라우저 환경에서 사용하는 Supabase 클라이언트
 * anon public 키를 사용하여 Row Level Security(RLS)를 통한 안전한 접근
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
