import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode: false,
  // 显式允许哪些域名在开发环境访问 _next/* 资源
  allowedDevOrigins: ["https://wangeden.top"], // 允许访问的域名列表
  
};

export default nextConfig;
