// Энгийн daily tracking тест
// Ажиллуулах: node test-simple-daily.js

async function testSimpleDailyTracking() {
  const baseUrl = "http://localhost:5173"; // Deployment URL болгон өөрчилнө үү

  console.log("🧪 Энгийн Daily Vote Tracking тест\n");

  try {
    // 1. Анхны daily stats шалгах
    console.log("1. Өнөөдрийн статистик шалгаж байна...");
    const dailyResponse = await fetch(`${baseUrl}/api/daily-stats`);
    const dailyData = await dailyResponse.json();
    console.log("📊 Өнөөдрийн статистик:", JSON.stringify(dailyData, null, 2));
    console.log();

    // 2. Main survey API дуудаж, санал тоо шинэчлэх
    console.log("2. Survey API дуудаж санал тоо шинэчилж байна...");
    const surveyResponse = await fetch(`${baseUrl}/api/survey`);
    const surveyData = await surveyResponse.json();
    console.log("📈 Survey өгөгдөл:");
    console.log(
      `   Нийт санал: ${surveyData.metrics.totalVotes.toLocaleString()}`,
    );
    console.log(
      `   Өнөөдрийн нэмэгдэл: +${surveyData.metrics.dailyVotesAdded.toLocaleString()}`,
    );
    console.log();

    // 3. Дахин daily stats шалгах
    console.log("3. Шинэчлэгдсэн статистик шалгаж байна...");
    const updatedDailyResponse = await fetch(`${baseUrl}/api/daily-stats`);
    const updatedDailyData = await updatedDailyResponse.json();
    console.log(
      "📊 Шинэчлэгдсэн статистик:",
      JSON.stringify(updatedDailyData, null, 2),
    );
    console.log();

    // 4. Debug мэдээлэл шалгах
    console.log("4. Debug мэдээлэл авч байна...");
    const debugResponse = await fetch(`${baseUrl}/api/daily-stats/debug`);
    const debugData = await debugResponse.json();
    console.log("🔍 Debug хариу:", JSON.stringify(debugData, null, 2));
    console.log();

    console.log("🎉 Бүх тест амжилттай дууссан!");
    console.log("\n📋 Системийн тойм:");
    console.log("- Өгөгдлийн эх сурвалж: e-mongolia.mn API");
    console.log(
      "- Daily tracking: In-memory (server restart дээр reset болно)",
    );
    console.log("- Цагийн бүс: Asia/Ulaanbaatar");
    console.log("- Өдрийн reset: 12:00 AM - 12:00 AM");
    console.log("- Автомат шинэчлэл: 3 секунд тутам");

    console.log("\n🔧 Test команд:");
    console.log("- Daily stats: GET /api/daily-stats");
    console.log("- Debug info: GET /api/daily-stats/debug");
    console.log("- Reset daily: POST /api/daily-stats/reset");
  } catch (error) {
    console.error("❌ Тест алдаатай:", error.message);
    console.log("\n🔧 Алдаа засах:");
    console.log("1. Development server асаалттай эсэхийг шалгана уу");
    console.log("2. Network холболт шалгана уу");
    console.log("3. API endpoint зөв байгаа эсэхийг шалгана уу");
  }
}

// Хэрэв шууд дуудсан бол ажиллуулах
if (require.main === module) {
  testSimpleDailyTracking();
}

module.exports = { testSimpleDailyTracking };
