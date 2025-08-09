# Supabase датабааз тохируулах заавар

## 1. Supabase Project үүсгэх

1. [supabase.com](https://supabase.com) хуудас руу орж бүртгүүлнэ үү
2. "New Project" дарж шинэ төсөл үүсгэнэ үү
3. Database password оруулна уу
4. Project бэлтгэгдэх хүртэл хүлээнэ үү

## 2. Датабааз Schema импорт хийх

1. Supabase Dashboard-д орж `SQL Editor` табыг сонгоно уу
2. `database/schema.sql` файлын агуулгыг хуулаад `SQL Editor`-т буулгана уу
3. "Run" товчийг дарж schema-г үүсгэнэ үү

## 3. API Keys олж авах

Supabase Dashboard-ийн `Settings > API` хэсгээс:

- `Project URL` хуулна уу
- `anon public` key хуулна уу

## 4. Environment Variables тохируулах

### Netlify дээр:

1. Netlify Dashboard → Site Settings → Environment Variables
2. Дараах variables-уудыг нэмнэ үү:

```
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
```

### Local development:

1. Төслийн root дэвсгэр `.env` файл үүсгэнэ үү:

```
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
```

## 5. API Route солих

`netlify/functions/api.ts` файлд:

```typescript
import {
  handleSupabaseSurveyData,
  handleVoteSubmission,
} from "../../server/routes/surveySupabase";

// Хуучин survey route-ийн оронд:
app.get("/api/survey/dashboard", handleSupabaseSurveyData);
app.post("/api/survey/vote", handleVoteSubmission);
```

## 6. Deploy хийх

```bash
npm run build
netlify deploy --prod
```

## 7. Real-time санал тоолол

Суpabase нь real-time updates дэмждэг тул санал шинээр орох болгонд дараах өөрчлөлтүүд автоматаар харагдана:

- Нийт санал тоо өсөх
- Өнөөдрийн санал нэмэгдэх
- Хувийн тоо шинэчлэгдэх
- Дэс дараалал өөрчлөгдөх

## 8. Админ панел (бонус)

Supabase Dashboard дээр Table Editor ашиглан:

- Санал тоог гараар нэмэх/хасах
- Шинэ асуулт нэмэх
- Хариултуудыг засварлах

## Troubleshooting

**Алдаа:** "Invalid API key"

- Environment variables зөв тохируулагдсан эсэхийг шалгана уу

**Алдаа:** "Database connection failed"

- Supabase project асаалттай эсэхийг шалгана уу
- RLS policies зөв тохируулагдсан эсэхийг шалгана уу

**Санал орохгүй байвал:**

- Суpabase Logs хэсгээс алдааг шалгана уу
- Network табаас API request-үүд ирж байгаа эсэхийг шалгана уу
