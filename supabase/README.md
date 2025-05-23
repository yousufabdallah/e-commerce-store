# إعداد قاعدة البيانات في Supabase

هذا الدليل يشرح كيفية إعداد قاعدة البيانات في Supabase لمشروع المتجر الإلكتروني.

## الخطوات

1. قم بإنشاء حساب على [Supabase](https://supabase.com/) إذا لم يكن لديك حساب بالفعل.
2. قم بإنشاء مشروع جديد في Supabase.
3. بعد إنشاء المشروع، انتقل إلى صفحة SQL Editor.
4. قم بنسخ محتوى ملف `schema.sql` ولصقه في محرر SQL ثم اضغط على زر "Run".
5. بعد إنشاء الجداول، قم بنسخ محتوى ملف `seed.sql` ولصقه في محرر SQL ثم اضغط على زر "Run" لإضافة بيانات أولية.
6. انتقل إلى صفحة Authentication > Settings وقم بتمكين "Email Auth" للسماح للمستخدمين بالتسجيل باستخدام البريد الإلكتروني.
7. انتقل إلى صفحة Project Settings > API وانسخ URL و anon key.
8. قم بتحديث ملف `.env.local` في مشروعك بالقيم التي نسختها:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## هيكل قاعدة البيانات

### الجداول

1. **categories**: يخزن فئات المنتجات.
2. **products**: يخزن معلومات المنتجات.
3. **inventory**: يخزن معلومات المخزون لكل منتج.
4. **users**: يخزن معلومات المستخدمين (يمتد من جدول auth.users).
5. **orders**: يخزن معلومات الطلبات.
6. **order_items**: يخزن العناصر المضمنة في كل طلب.
7. **carts**: يخزن سلات التسوق للمستخدمين.
8. **cart_items**: يخزن العناصر المضمنة في كل سلة تسوق.

### العلاقات

- كل منتج ينتمي إلى فئة واحدة.
- كل منتج له سجل مخزون واحد.
- كل طلب ينتمي إلى مستخدم واحد.
- كل عنصر طلب ينتمي إلى طلب واحد ومنتج واحد.
- كل سلة تسوق تنتمي إلى مستخدم واحد.
- كل عنصر سلة ينتمي إلى سلة واحدة ومنتج واحد.

### الوظائف والمشغلات

- تم إنشاء وظيفة `update_updated_at_column()` ومشغلات لتحديث حقل `updated_at` تلقائيًا عند تحديث السجلات.
- تم إنشاء وظيفة `update_inventory_on_order()` ومشغل لتحديث المخزون تلقائيًا عند إنشاء عنصر طلب جديد.

### سياسات أمان الصفوف (RLS)

تم تمكين سياسات أمان الصفوف على جميع الجداول لضمان أن:
- يمكن للمستخدمين العاديين عرض المنتجات والفئات فقط.
- يمكن للمستخدمين العاديين إدارة سلة التسوق الخاصة بهم وإنشاء طلبات.
- يمكن للمستخدمين العاديين عرض طلباتهم الخاصة فقط.
- يمكن للمسؤولين إدارة جميع البيانات.

## إنشاء مستخدم مسؤول

لإنشاء مستخدم مسؤول:

1. انتقل إلى صفحة Authentication > Users في Supabase.
2. انقر على "Invite user" وأدخل عنوان البريد الإلكتروني.
3. بعد إنشاء المستخدم، انتقل إلى صفحة SQL Editor وقم بتنفيذ الاستعلام التالي:

```sql
UPDATE users
SET role = 'admin'
WHERE id = 'user-id-here';
```

استبدل 'user-id-here' بمعرف المستخدم الذي تم إنشاؤه.

## ملاحظات إضافية

- يمكنك تعديل سياسات أمان الصفوف حسب احتياجاتك.
- يمكنك إضافة المزيد من الحقول إلى الجداول حسب احتياجاتك.
- تأكد من إنشاء مجلد `public/images` في مشروعك ورفع صور المنتجات إليه.
