# Netlify + Supabase Deploy заавар

## 📊 Hybrid Database Approach

Энэ система **хибрид датабааз** ашигладаг:

- **Main API**: Бүх санал асуулгын өгөгдөл (e-mongolia.mn API)
- **Supabase Database**: Зөвхөн өдрийн шинэ санал тоолол (12:00 AM - 12:00 AM)

## 🚀 1. Supabase Project үүсгэх

### Алхам 1: Supabase бүртгэл

1. [supabase.com](https://supabase.com) руу орж бүртгүүлнэ үү
2. "New Project" товчийг дарна уу
3. Project нэр: `survey-dashboard`
4. Database password үүсгэнэ үү (хадгалж авна уу!)
5. Region: "Northeast Asia (Seoul)" сонгоно уу
6. Pricing plan: "Free tier" хангалттай

### Алхам 2: Датабааз Schema импорт

1. Supabase Dashboard дээр `SQL Editor` табыг сонгоно уу
2. `database/schema.sql` файлын агуулгыг хуулаад буулгана уу
3. "Run" товчийг дарж schema үүсгэнэ үү
4. "Success" гэж гарвал амжилттай

### Алхам 3: API Keys авах

Supabase Dashboard �� `Settings` → `API` хэсгээс:

- **Project URL**: `https://xxx.supabase.co` хуулна уу
- **anon public key**: `eyJhbGciOiJIUzI1NiIs...` хуулна уу

## 🌐 2. Netlify дээр Environment Variables тохируулах

### Алхам 1: Netlify Dashboard руу орох

1. [netlify.com](https://netlify.com) дээр GitHub account-оороо нэвтэрнэ үү
2. Өөрийн site-г сонгоно уу

### Алхам 2: Environment Variables нэмэх

`Site settings` → `Environment variables` → `Add variable`:

```
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Чухал**: Жинхэнэ values-уудыг Supabase Dashboard-ээс хуулж оруулна уу!

## 📱 3. Frontend код өөрчлөх (хэрэв хүсвэл)

Хэрэв Supabase датабааз default болгомоор байвал:

```typescript
// client/pages/Index.tsx дээр
const [useDatabase, setUseDatabase] = useState(true); // false → true болгох
```

Эсвэл toggle товчийг буцааж нэмэх:

```typescript
// 58-р мөрийн дараа нэмэх
<Button
  variant={useDatabase ? "default" : "outline"}
  size="sm"
  onClick={() => setUseDatabase(!useDatabase)}
>
  {useDatabase ? "Жинхэнэ датабааз" : "API датабааз"}
</Button>
```

## 🚀 4. Deploy хийх

### Git Push хийх:

```bash
git add .
git commit -m "Add Supabase database integration"
git push origin main
```

### Auto-deploy:

- Netlify автоматаар шинэ код-г илрүүлж deploy хийнэ
- Deploy status-г Netlify Dashboard дээр шалгана уу

## ✅ 5. Тест хийх

Deploy дууссаны дараа:

1. **Main API тест**: `https://your-site.netlify.app/api/survey`
2. **Daily stats API**: `https://your-site.netlify.app/api/daily-stats`
3. **Weekly stats API**: `https://your-site.netlify.app/api/weekly-stats`
4. **Specific date API**: `https://your-site.netlify.app/api/daily-stats/2024-01-15`
5. **Frontend**: Өнөөдрийн санал тоо автомат шинэчлэгдэж байгаа эсэх

## 🔧 6. Troubleshooting

### Environment Variables алдаа:

```
Error: Supabase client not initialized
```

**Шийдэл**: Netlify Environment Variables зөв тохируулагдсан эсэхийг шалгана уу

### CORS алдаа:

```
Access-Control-Allow-Origin error
```

**Шийдэл**: Supabase Dashboard → Authentication → Site URL дээр netlify domain нэмн�� үү

### Database connection алдаа:

```
Database connection failed
```

**Шийдэл**:

1. Supabase project асаалттай эсэхийг шалгана уу
2. RLS policies идэвхжүүлэгдсэн эсэхийг шалгана уу
3. API keys expire болоогүй эсэхийг шалгана уу

## 📊 7. Monitoring

### Supabase Dashboard:

- Database → Tables: Өгөгдөл орж байгаа эсэх
- Logs: Алдаа байгаа эсэх
- API usage: Хэрэглээний статистик

### Netlify Functions:

- Functions tab: API endpoint ажиллаж байгаа эсэх
- Logs: Server алдаанууд

## 🎯 Төгсгөл

Амжилттай болсон тохиолдолд:

- ✅ Real-time санал тоолол ажиллана
- ✅ Датабаазтай санал өгөх боломжтой болно
- ✅ Daily vote tracking автомат ажиллана
- ✅ Connection error handling хадгалагдана

Асуудал гарвал `SUPABASE_SETUP.md` файлыг үзнэ үү эсвэл дэлгэрэнгүй error message илгээнэ үү.
