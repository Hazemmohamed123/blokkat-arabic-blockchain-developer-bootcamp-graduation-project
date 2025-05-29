# مشروع StudentVote

مشروع منصة تصويت للطلاب لاختيار رئيس اتحاد الطلاب في الكلية باستخدام Solidity و Foundry و React مع Wagmi.

## كيفية التشغيل

1. إعداد العقد ونشره على شبكة Sepolia Scroll:
- استعمل Foundry: `forge script scripts/deploy.js --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast`
- حفظ عنوان العقد الذكي.

2. إعداد الواجهة الأمامية:
- الدخول إلى مجلد frontend
- تشغيل `npm install` لتثبيت الحزم
- إنشاء ملف `.env` يحتوي على المفاتيح
- تشغيل `npm run dev` لتشغيل الواجهة

3. في `frontend/src/components/Voting.jsx` قم بتعديل `contractAddress` ليكون عنوان العقد المنشور.

## تفاصيل المشروع

- عقد ذكي بسيط للتصويت
- يضمن تصويت مرة واحدة لكل محفظة
- يعرض المرشحين والأصوات بشكل مباشر

## المؤلف

Hazem Mohamed
