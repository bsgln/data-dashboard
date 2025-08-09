# 🚀 Хурдан Датабааз Тохиргоо

## Суpabase датабаазыг default болгох

Хэрэв Supabase датабаазыг үндсэн датабааз болгомоор байвал:

### 1. Index.tsx файл өөрчлөх:

```bash
# Файл: client/pages/Index.tsx
# 24-р мөрийг өөрчлөх:
const [useDatabase, setUseDatabase] = useState(true); // false → true
```

### 2. Toggle товч нэмэх (optional):

```typescript
// 64-р мөрийн дараа нэмэх:
<Button
  variant={useDatabase ? "default" : "outline"}
  size="sm"
  onClick={() => setUseDatabase(!useDatabase)}
  className="mr-2"
>
  <Settings className="w-4 h-4 mr-1" />
  {useDatabase ? "Жинхэнэ датабааз" : "API датабааз"}
</Button>
```

### 3. Өөрчлөлтийг хийх команд:

```bash
# 1. Суpabase default болгох
sed -i 's/useState(false)/useState(true)/' client/pages/Index.tsx

# 2. Git commit
git add .
git commit -m "Enable Supabase database by default"
git push

# 3. Netlify автомат deploy хийнэ
```

## Environment Variables дахин сануулга:

Netlify Dashboard дээр доорх environment variables-уудыг нэмэхээ мартна уу:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

Deploy дууссаны дараа `/api/survey/database` endpoint ажиллах болно!
