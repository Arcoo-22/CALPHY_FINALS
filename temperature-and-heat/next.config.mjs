/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    '192.168.18.12',
    // ngrok tunnels (the subdomain changes each session on the free plan)
    '*.ngrok-free.dev',
    '*.ngrok-free.app',
  ],
  reactCompiler: true,
  reactStrictMode: true,
};

export default nextConfig;
