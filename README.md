# نظام إدارة مدرسة تحفيظ القرآن

تطبيق ويب كامل بـ **Node.js + Express + PostgreSQL** لإدارة مدرسة تحفيظ القرآن الكريم.

## المميزات

- ✅ قاعدة بيانات خادم حقيقية (PostgreSQL)
- ✅ Connection Pooling (20 اتصال متزامن)
- ✅ مصادقة JWT آمنة
- ✅ Rate Limiting (100 طلب/15 دقيقة)
- ✅ Helmet حماية
- ✅ 4 أنواع مستخدمين: إدارة، محفّظ، لجنة اختبارات، ولي أمر
- ✅ إدارة الطلاب (إضافة، تعديل، حذف)
- ✅ تسجيل الحضور والغياب
- ✅ تحويل الطلاب للجنة الاختبارات
- ✅ تسجيل نتائج الاختبارات
- ✅ دردشة عامة ورسائل خاصة
- ✅ تخصيص معلومات المدرسة والشعار
- ✅ رفع الصور (شعار المدرسة، صورة المستخدم)

## متطلبات التشغيل

- Node.js 16+
- PostgreSQL 12+ (أو خدمة سحابية)

## طريقة التشغيل المحلي

```bash
# 1. انتقل لمجلد المشروع
cd quran-school-app

# 2. ثبّت الحزم
npm install

# 3. أنشئ ملف .env
# انسخ .env.example وعدّله

# 4. شغّل الخادم
npm start

# 5. افتح المتصفح
# http://localhost:3000
```

## بيانات الدخول الافتراضية

| اسم المستخدم | كلمة المرور | الدور |
|-------------|------------|-------|
| admin | admin123 | إدارة |

## هيكل المشروع

```
quran-school-app/
├── .env                    # متغيرات البيئة (لا ترفعه!)
├── .env.example
├── .gitignore
├── package.json
├── server.js               # الخادم الرئيسي
├── README.md
├── config/
│   └── database.js         # إعدادات PostgreSQL + Pool
├── middleware/
│   └── auth.js             # JWT + Roles
├── models/
│   ├── index.js
│   ├── User.js
│   ├── Student.js
│   ├── Message.js
│   └── School.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── students.js
│   ├── messages.js
│   ├── school.js
│   ├── stats.js
│   └── upload.js
└── public/
    ├── index.html          # الواجهة الأمامية
    └── uploads/            # مجلد الصور
```

## API Endpoints

### المصادقة
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - بيانات المستخدم الحالي

### المدرسة
- `GET /api/school` - معلومات المدرسة
- `PUT /api/school` - تحديث معلومات المدرسة

### المستخدمون
- `GET /api/users` - قائمة المستخدمين
- `POST /api/users` - إضافة مستخدم
- `DELETE /api/users/:id` - حذف مستخدم
- `PUT /api/users/:id` - تعديل مستخدم

### الطلاب
- `GET /api/students` - قائمة الطلاب (حسب الدور)
- `POST /api/students` - إضافة طالب
- `PUT /api/students/:id` - تعديل طالب
- `DELETE /api/students/:id` - حذف طالب

### الرسائل
- `GET /api/messages?channel=group` - رسائل الدردشة العامة
- `GET /api/messages?with=USER_ID` - رسائل خاصة
- `POST /api/messages` - إرسال رسالة

### الإحصائيات
- `GET /api/stats` - إحصائيات لوحة التحكم

### الرفع
- `POST /api/upload` - رفع صورة

## النشر على Railway (أسهل)

1. أنشئ حساباً على [railway.app](https://railway.app)
2. اختر **New Project** → **Provision PostgreSQL**
3. اربط مستودع GitHub بالمشروع
4. أضف متغير البيئة `DATABASE_URL` (Railway يعطيك الرابط تلقائياً)
5. أضف `JWT_SECRET` (أي نص عشوائي قوي)
6. اضغط Deploy

## النشر على Render + Supabase

1. أنشئ قاعدة بيانات على [Supabase](https://supabase.com)
2. انسخ `Connection String` من إعدادات Supabase
3. انشر الكود على [Render](https://render.com)
4. ألصق الرابط في متغير `DATABASE_URL`
5. أضف `JWT_SECRET`

## النشر على Neon

1. [neon.tech](https://neon.tech) - PostgreSQL Serverless مجاني
2. أنشئ مشروع جديد وانسخ رابط الاتصال
3. الصقه في `DATABASE_URL`

## ملاحظات أمان

- غيّر `JWT_SECRET` في ملف `.env` قبل النشر
- استخدم HTTPS في الإنتاج
- قم بتغيير كلمة مرور المدير الافتراضية فوراً
- لا ترفع ملف `.env` أبداً

## لماذا PostgreSQL؟

| الميزة | SQLite | PostgreSQL |
|--------|--------|------------|
| نوع الاتصال | ملف محلي | خادم شبكي |
| المستخدمون المتزامنون | 1 فقط | مئات/آلاف |
| Connection Pool | لا يوجد | 20 اتصال |
| الأداء مع البيانات الكبيرة | بطيء | سريع |
| النسخ الاحتياطي | يدوي | تلقائي |
| التوسع | محدود | غير محدود |

## الترخيص

MIT - حر الاستخدام
