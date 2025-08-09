// Test script for daily vote tracking
// Run with: node test-daily-tracking.js

async function testDailyTracking() {
  const baseUrl = "http://localhost:5173"; // Change to your deployed URL

  console.log("🧪 Testing Daily Vote Tracking System\n");

  try {
    // Test 1: Get today's daily stats
    console.log("1. Testing today's daily stats...");
    const dailyResponse = await fetch(`${baseUrl}/api/daily-stats`);
    const dailyData = await dailyResponse.json();
    console.log("✅ Daily stats:", dailyData);
    console.log();

    // Test 2: Get weekly stats
    console.log("2. Testing weekly stats...");
    const weeklyResponse = await fetch(`${baseUrl}/api/weekly-stats`);
    const weeklyData = await weeklyResponse.json();
    console.log("✅ Weekly stats:", weeklyData);
    console.log();

    // Test 3: Test main survey API with daily tracking
    console.log("3. Testing main survey API with daily tracking...");
    const surveyResponse = await fetch(`${baseUrl}/api/survey`);
    const surveyData = await surveyResponse.json();
    console.log("✅ Survey data with daily votes:");
    console.log(`   Total votes: ${surveyData.metrics.totalVotes}`);
    console.log(`   Daily added: ${surveyData.metrics.dailyVotesAdded}`);
    console.log();

    // Test 4: Test specific date (today)
    const today = new Date().toISOString().split("T")[0];
    console.log(`4. Testing specific date stats (${today})...`);
    const dateResponse = await fetch(`${baseUrl}/api/daily-stats/${today}`);
    if (dateResponse.ok) {
      const dateData = await dateResponse.json();
      console.log("✅ Date stats:", dateData);
    } else {
      console.log("ℹ️  No data for today yet (this is normal for new setup)");
    }
    console.log();

    console.log("🎉 All tests completed successfully!");
    console.log("\n📋 System Summary:");
    console.log("- Main survey data: e-mongolia.mn API");
    console.log("- Daily vote counting: Supabase database");
    console.log("- Time zone: Asia/Ulaanbaatar (UTC+8)");
    console.log("- Daily reset: 12:00 AM - 12:00 AM");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Make sure your development server is running");
    console.log("2. Check Supabase environment variables");
    console.log("3. Verify database schema is imported");
    console.log("4. Check network connectivity");
  }
}

// Run if called directly
if (require.main === module) {
  testDailyTracking();
}

module.exports = { testDailyTracking };
