/** @type {import('next').NextConfig} */
const nextConfig = {
  // تكوين Next.js للتصدير الثابت
  output: process.env.NEXT_PUBLIC_EXPORT === "true" ? "export" : undefined,

  // تعطيل تحسين الصور عند التصدير الثابت
  images: {
    unoptimized: true,
  },

  // إضافة متغيرات البيئة الإضافية
  env: {
    APP_VERSION: "1.0.0",
  },

  // تكوين إعادة الكتابة
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ]
  },

  // تكوين الوسائط
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

  // إضافة تكوين ESLint و TypeScript
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
