/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 빌드 시 타입 에러가 있어도 무시하고 진행합니다. (any 써도 통과!)
    ignoreBuildErrors: true,
  },
  eslint: {
    // 빌드 시 ESLint(문법 체크) 에러가 있어도 무시하고 진행합니다.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;