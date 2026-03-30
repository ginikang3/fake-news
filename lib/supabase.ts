import { createClient } from '@supabase/supabase-js';

// 환경 변수 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 타입 정의 (나중에 자동완성 편하게 하려고 넣음)
export type NewsPost = {
  id: string;
  created_at: string;
  title: string;
  image_url: string;
};

// 만약 주소가 없으면 콘솔에 경고를 띄움
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase 환경 변수가 비어있습니다! .env.local 파일을 확인하고 서버를 재시작하세요.");
}

// 클라이언트 생성
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);