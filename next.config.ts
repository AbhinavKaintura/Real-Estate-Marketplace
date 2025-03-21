/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/predict',  // Match API requests under `/api/*`
        destination: 'http://127.0.0.1:8000/predict',  // Forward requests to the backend
      },
    ];
  },
  
  // Add image configuration for Firebase Storage
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'storage.googleapis.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '**',
      },
    ],
    unoptimized: true, // This helps with Firebase Storage images
  },
};

module.exports = nextConfig;