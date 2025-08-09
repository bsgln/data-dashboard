# 📊 Энгийн Daily Vote Tracking

## 🎯 Зорилго

Зөвхөн **нэг API endpoint** (`/api/survey`) ашиглаж:

- Цаг тутамд API шалгах
- Өдрийн турш шинээр хэдэн санал нэмэгдсэн байгааг тооцоолох
- Бүх хүнд ижил өнөөдрийн нэмэгдэл харуулах

## ⚙️ Хэрэг��э ажиллаж байна

### 1. API Polling

- Frontend 3 секунд тутам `/api/survey` дуудна
- Backend API дуудах болгонд `simpleDailyTracker.updateVoteCount()` дуудна

### 2. Daily Tracking Logic

```
📅 Өдөр шинээр эхлэхэд:
   🌅 Өмнөх өдрийн сүүлийн санал тоо → Өнөөдрийн эхний цэг

📊 API дуудах б��лгонд:
   ➕ Өнөөдрийн нэмэгдэл = Одоогийн санал - Өдрийн эхний санал
```

### 3. Data Storage

- **In-memory**: Server restart хийхэд reset болно
- **No Database**: Зөвхөн JavaScript object-д хадгална
- **Timezone**: Asia/Ulaanbaatar (UTC+8)

## 🔌 API Endpoints

### Main Survey Data

```
GET /api/survey
```

Response:

```json
{
  "metrics": {
    "totalVotes": 295199,
    "dailyVotesAdded": 1247, // ← Өнөөдрийн нэмэгдэл
    "lastUpdated": "14:23:45"
  }
}
```

### Daily Statistics

```
GET /api/daily-stats
```

Response:

```json
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "startOfDayVotes": 295000,
    "currentVotes": 296247,
    "dailyVotesAdded": 1247,
    "lastUpdated": "14:23:45",
    "timezone": "Asia/Ulaanbaatar"
  }
}
```

### Debug & Testing

```
GET /api/daily-stats/debug     # Console дээр debug мэдээлэл
POST /api/daily-stats/reset    # Daily tracker reset
```

## 🕐 Timeline Example

```
12:00 AM - Өдөр эхэллээ
├─ startOfDayVotes: 295000
├─ dailyAdded: 0

09:30 AM - API дуудлага #1
├─ currentVotes: 295150
├─ dailyAdded: 150

14:23 PM - API дуудлага #2
├─ currentVotes: 296247
├─ dailyAdded: 1247

11:59 PM - Өдрийн төгсгөл
├─ currentVotes: 297500
├─ dailyAdded: 2500

12:00 AM - Шинэ өдөр
├─ startOfDayVotes: 297500 (өмнөх өдрийн сүүлийн тоо)
├─ dailyAdded: 0 (reset)
```

## 🚀 Deployment

### 1. Build & Deploy

```bash
npm run build
git add .
git commit -m "Add simple daily vote tracking"
git push origin main
```

### 2. Тест хийх

```bash
# Local тест
node test-simple-daily.js

# Production тест
curl https://your-site.netlify.app/api/daily-stats
```

## 📱 Frontend Display

Metrics card дээр:

```
📊 Нийт санал: 296,247
   +1,247 санал /өнөөдөр/
```

## 🔧 Debug Commands

```bash
# Daily stats шалгах
curl /api/daily-stats

# Debug мэдээлэл (console дээр харагдана)
curl /api/daily-stats/debug

# Reset хийх (тест зориулалт)
curl -X POST /api/daily-stats/reset
```

## ✅ Давуу тал

1. **Энгийн**: Database шаардлагагүй
2. **Найдвартай**: Зөвхөн нэг API endpoint ашиглана
3. **Хялбар**: Supabase эсвэл database тохиргоо шаардлагагүй
4. **Хурдан**: In-memory, шуурх��й ажиллана
5. **Цэвэр**: Hybrid database болон нарийн төвөгтэй логик байхгүй

## ⚠️ Анхааруулга

- **Server restart**: Daily count reset болно
- **Production**: Load balancer ашиглавал тоо алдагдаж болно
- **Persistence**: Database ашиглахгүй тул permanent storage байхгүй

## 🎯 Үр дүн

Хэрэглэгчид dashboard дээр харах зүйл:

- Жинхэнэ нийт санал тоо (API-аас)
- Өнөөдрийн шинэ санал тоо (auto calculated)
- Real-time updates (3 секунд тутам)
- Бүх хүнд ижил тоо харагдана

Энэ нь таны хүссэн шийдэл: **зөвхөн нэг API, энгийн daily tracking!** 🎉
