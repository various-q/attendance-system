# نظام الحضور والانصراف

نظام متكامل لإدارة حضور وانصراف الموظفين مع دعم أجهزة البصمة.

## المميزات

* إدارة بيانات الموظفين
* تسجيل الحضور والانصراف
* إدارة طلبات الإجازات
* التكامل مع أجهزة البصمة
* إنشاء تقارير متنوعة
* واجهة مستخدم سهلة الاستخدام
* دعم متعدد اللغات
* نظام صلاحيات متقدم

## المتطلبات

* Node.js 18.x أو أحدث
* PostgreSQL 14.x أو أحدث
* npm أو yarn أو pnpm

## التثبيت

1. قم بنسخ المشروع:
```bash
git clone https://github.com/various-q/attendance-system.git
cd attendance-system
```

2. قم بتثبيت الاعتماديات:
```bash
npm install
# أو
yarn install
# أو
pnpm install
```

3. قم بإعداد ملف البيئة:
```bash
cp .env.example .env
```

4. قم بتحديث متغيرات البيئة في ملف `.env` بالقيم المناسبة

5. قم بتشغيل قاعدة البيانات:
```bash
npm run db:push
```

6. قم بتشغيل المشروع:
```bash
npm run dev
```

## هيكل المشروع

```
attendance-system/
├── app/                 # صفحات التطبيق
├── components/          # مكونات React
├── hooks/              # React Hooks
├── lib/                # المكتبات والوظائف المساعدة
├── public/             # الملفات العامة
├── styles/             # ملفات CSS
└── ...
```

## النشر على Netlify

1. قم بربط مستودع GitHub الخاص بك بـ Netlify
2. اختر الفرع الرئيسي (master)
3. اضبط إعدادات البناء:
   * Build command: `npm run build`
   * Publish directory: `.next`
4. أضف متغيرات البيئة المطلوبة في إعدادات Netlify

## التطوير

### الأوامر المتاحة

```bash
npm run dev          # تشغيل بيئة التطوير
npm run build        # بناء المشروع
npm run start        # تشغيل النسخة المنتجة
npm run lint         # فحص الكود
npm run db:generate  # توليد مخطط قاعدة البيانات
npm run db:push      # تحديث قاعدة البيانات
npm run db:studio    # فتح واجهة إدارة قاعدة البيانات
```

### أفضل الممارسات

* استخدم TypeScript لكتابة الكود
* اتبع معايير ESLint
* اكتب تعليقات توضيحية للكود
* قم بإنشاء اختبارات للوظائف الجديدة

## المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. قم بعمل Fork للمشروع
2. قم بإنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. قم بعمل Commit للتغييرات (`git commit -m 'Add some amazing feature'`)
4. قم بعمل Push للفرع (`git push origin feature/amazing-feature`)
5. قم بفتح طلب Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف LICENSE للتفاصيل.

## الدعم

إذا واجهتك أي مشكلة أو لديك أي استفسار، يرجى:
1. فتح issue جديد في المستودع
2. وصف المشكلة بشكل مفصل
3. إضافة خطوات إعادة إنتاج المشكلة
4. إضافة لقطات شاشة إذا كان ذلك مفيداً

## المساهمون

- [اسمك](https://github.com/username) - المطور الرئيسي 