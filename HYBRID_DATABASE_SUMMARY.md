# 🔄 Hybrid Database Implementation Summary

## 📊 Overview

The survey dashboard now uses a **hybrid database approach**:

- **Main Survey Data**: e-mongolia.mn API (existing)
- **Daily Vote Counting**: Supabase database (new)

## ⏰ Daily Vote Tracking

### Time Window

- **Start**: 12:00 AM Ulaanbaatar time
- **End**: 12:00 AM next day Ulaanbaatar time
- **Timezone**: Asia/Ulaanbaatar (UTC+8)

### How it Works

1. Every API request to `/api/survey` updates daily vote count in Supabase
2. Database tracks:
   - `votes_at_start`: Vote count at beginning of day
   - `votes_at_end`: Current vote count
   - `daily_added`: Votes added during current day
3. At midnight, a new record is created for the next day

## 🔌 API Endpoints

### Main Survey Data

- `GET /api/survey` - Full survey data with daily vote counts

### Daily Statistics (Supabase-powered)

- `GET /api/daily-stats` - Today's daily vote count
- `GET /api/weekly-stats` - Last 7 days statistics
- `GET /api/daily-stats/YYYY-MM-DD` - Specific date statistics

### Response Examples

**Daily Stats:**

```json
{
  "success": true,
  "data": {
    "dailyVotesAdded": 1247,
    "date": "2024-01-15",
    "timezone": "Asia/Ulaanbaatar",
    "note": "Daily votes counted from 12:00 AM to 12:00 AM Ulaanbaatar time"
  }
}
```

**Weekly Stats:**

```json
{
  "success": true,
  "data": {
    "stats": [
      {
        "date": "2024-01-15",
        "votes_at_start": 295000,
        "votes_at_end": 296247,
        "daily_added": 1247
      }
    ],
    "count": 7,
    "timezone": "Asia/Ulaanbaatar"
  }
}
```

## 🗄️ Database Schema

```sql
CREATE TABLE daily_vote_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    votes_at_start INTEGER DEFAULT 0,
    votes_at_end INTEGER DEFAULT 0,
    daily_added INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date)
);
```

## 🚀 Deployment Setup

### 1. Supabase Environment Variables

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 2. Database Schema Import

Run `database/schema.sql` in Supabase SQL Editor

### 3. Deploy to Netlify

```bash
git add .
git commit -m "Add hybrid database with daily vote tracking"
git push origin main
```

## 🔧 Fallback System

If Supabase fails:

- Falls back to local in-memory tracking
- Main survey data continues working
- No user-facing errors

## 🧪 Testing

Use the included test script:

```bash
node test-daily-tracking.js
```

## 📈 Benefits

1. **Reliability**: Main data from proven e-mongolia.mn API
2. **Precision**: Accurate daily vote counting with database persistence
3. **Timezone Accuracy**: Proper midnight-to-midnight tracking in Ulaanbaatar time
4. **Scalability**: Supabase handles real-time updates and persistence
5. **Fallback Safety**: System continues working if database fails

## 🔄 Data Flow

```
API Request → e-mongolia.mn API → Main Survey Data
     ↓
Update Daily Count → Supabase Database → Daily Vote Stats
     ↓
Response → Combined Data → Frontend Display
```

This hybrid approach provides the best of both worlds: reliable main data and accurate daily tracking!
