const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/predict',  // Match API requests under `/api/*`
        destination: 'http://127.0.0.1:8000/predict',  // Forward requests to the backend
      },
    ];
  },
};

module.exports = nextConfig;
  