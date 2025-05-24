# نظام الحضور والانصراف

نظام متكامل لإدارة حضور وانصراف الموظفين مع دعم أجهزة البصمة.

## المميزات

- إدارة بيانات الموظفين
- تسجيل الحضور والانصراف
- إدارة طلبات الإجازات
- التكامل مع أجهزة البصمة
- إنشاء تقارير متنوعة

## المتطلبات

- Node.js 18.x أو أحدث
- PostgreSQL
- npm أو yarn

## التثبيت

1. قم بنسخ المشروع:
```bash
git clone https://github.com/your-username/attendance-system.git
cd attendance-system
```

2. قم بتثبيت الاعتماديات:
```bash
npm install
```

3. قم بإعداد ملف البيئة:
```bash
cp .env.example .env
```

4. قم بتحديث متغيرات البيئة في ملف `.env`

5. قم بتشغيل قاعدة البيانات:
```bash
npm run db:push
```

6. قم بتشغيل المشروع:
```bash
npm run dev
```

## النشر على Netlify

1. قم بربط مستودع GitHub الخاص بك بـ Netlify
2. اختر الفرع الرئيسي (master)
3. اضبط إعدادات البناء:
   - Build command: `npm run build`
   - Publish directory: `.next`

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