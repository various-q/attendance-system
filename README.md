# نظام الحضور والانصراف

نظام متكامل لإدارة حضور وانصراف الموظفين مع دعم للغتين العربية والإنجليزية.

## المميزات

- ✨ واجهة مستخدم حديثة وسهلة الاستخدام
- 🌐 دعم اللغتين العربية والإنجليزية
- 📱 تصميم متجاوب مع جميع الأجهزة
- 🔒 نظام مصادقة آمن
- 📊 تقارير وإحصائيات متقدمة
- 🎯 دعم أجهزة البصمة والبطاقات

## المتطلبات

- Node.js 18.0.0 أو أحدث
- PostgreSQL 12.0 أو أحدث
- npm أو yarn

## التثبيت

1. قم بنسخ المستودع:
```bash
git clone https://github.com/your-username/attendance-system.git
cd attendance-system
```

2. قم بتثبيت التبعيات:
```bash
npm install
# أو
yarn install
```

3. قم بإنشاء ملف `.env.local` وأضف المتغيرات البيئية المطلوبة:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/attendance_db
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. قم بتشغيل قاعدة البيانات:
```bash
npm run db:generate
npm run db:push
```

5. قم بتشغيل التطبيق:
```bash
npm run dev
# أو
yarn dev
```

## الاستخدام

1. افتح المتصفح على العنوان: `http://localhost:3000`
2. قم بتسجيل الدخول باستخدام بيانات المستخدم
3. ابدأ باستخدام النظام

## المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. قم بعمل Fork للمشروع
2. قم بإنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. قم بعمل Commit للتغييرات (`git commit -m 'Add some amazing feature'`)
4. قم بعمل Push للفرع (`git push origin feature/amazing-feature`)
5. قم بفتح طلب Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم

إذا واجهتك أي مشكلة أو لديك أي استفسار، يرجى فتح issue جديد في المستودع. 