/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置子路径，用于反向代理场景
  // 如果不需要子路径部署，可以删除或注释掉这行
  basePath: "/english-agent",
  
  // 如果你的静态资源也需要通过子路径访问，取消下面的注释
  // assetPrefix: "/english-agent",
};

export default nextConfig;

