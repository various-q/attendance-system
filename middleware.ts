import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // المسارات التي لا تتطلب مصادقة
  const publicPaths = ["/", "/api/auth"]

  // التحقق مما إذا كان المسار عامًا
  const isPublicPath = publicPaths.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`))

  // الحصول على جلسة المستخدم
  const session = request.cookies.get("session")?.value

  // إذا كان المسار عامًا ولا توجد جلسة، السماح بالوصول
  if (isPublicPath && !session) {
    return NextResponse.next()
  }

  // إذا كان المسار عامًا وتوجد جلسة، إعادة التوجيه إلى لوحة التحكم
  if (isPublicPath && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // إذا كان المسار غير عام ولا توجد جلسة، إعادة التوجيه إلى صفحة تسجيل الدخول
  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // في جميع الحالات الأخرى، السماح بالوصول
  return NextResponse.next()
}

// تكوين المسارات التي يجب تطبيق middleware عليها
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
