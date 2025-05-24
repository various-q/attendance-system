/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure images
  images: {
    unoptimized: true,
  },

  // Add environment variables
  env: {
    APP_VERSION: "1.0.0",
  },

  // Configure rewrites
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ]
  },

  // Configure webpack for media files
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3|wav|ogg)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            publicPath: "/_next/static/media/",
            outputPath: "static/media/",
            name: "[name].[hash].[ext]",
          },
        },
      ],
    })

    return config
  },

  // Configure ESLint and TypeScript
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
