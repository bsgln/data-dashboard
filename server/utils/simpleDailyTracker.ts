import * as fs from "fs";
import * as path from "path";

interface DailyVoteData {
  date: string; // YYYY-MM-DD format in Ulaanbaatar timezone
  startOfDayVotes: number; // Санал тоо өдрийн эхэнд
  currentVotes: number; // Одоогийн санал тоо
  dailyAdded: number; // Өнөөдөр нэмэгдсэн санал
  lastUpdated: string; // Сүүлд шинэчилсэн цаг
}

class SimpleDailyTracker {
  private currentData: DailyVoteData | null = null;
  private readonly dataFilePath: string;

  constructor() {
    // Store data file in a temp directory or data directory
    this.dataFilePath = path.join(process.cwd(), "daily-vote-data.json");
    this.loadPersistedData();
  }

  private getTodayDateString(): string {
    // Улаанбаатар цагийн бүсээр өдрийн огноо авах
    const now = new Date();
    const ulanbatarTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Ulaanbaatar" }),
    );
    return ulanbatarTime.toISOString().split("T")[0]; // YYYY-MM-DD format
  }

  private getCurrentTimeString(): string {
    const now = new Date();
    return now.toLocaleTimeString("mn-MN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Ulaanbaatar",
    });
  }

  // Load persisted data from file
  private loadPersistedData(): void {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const fileContent = fs.readFileSync(this.dataFilePath, "utf8");
        const persistedData = JSON.parse(fileContent) as DailyVoteData;

        // Only load if it's today's data
        const today = this.getTodayDateString();
        if (persistedData.date === today) {
          this.currentData = persistedData;
          console.log(
            `📂 Өнөөдрийн өгөгдөл ачааллагдлаа: ${persistedData.dailyAdded} санал нэмэгдсэн`,
          );
        } else {
          console.log(
            `📅 Өмнөх өдрийн өгөгдөл олдлоо (${persistedData.date}), шинэ өдөр эхлүүлж байна`,
          );
          // Keep the old data for baseline calculation but don't set as current
          this.currentData = null;
        }
      }
    } catch (error) {
      console.error("❌ Хадгалагдсан өгөгдөл ачаалахад алдаа:", error);
      this.currentData = null;
    }
  }

  // Save current data to file
  private saveDataToFile(): void {
    if (!this.currentData) return;

    try {
      fs.writeFileSync(
        this.dataFilePath,
        JSON.stringify(this.currentData, null, 2),
      );
    } catch (error) {
      console.error("❌ Өгөгдөл файлд хадгалахад алдаа:", error);
    }
  }

  // Get previous day's data for baseline calculation
  private getPreviousDayData(): DailyVoteData | null {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const fileContent = fs.readFileSync(this.dataFilePath, "utf8");
        const persistedData = JSON.parse(fileContent) as DailyVoteData;

        // Only return if it's from yesterday or earlier
        const today = this.getTodayDateString();
        if (persistedData.date !== today) {
          return persistedData;
        }
      }
    } catch (error) {
      console.error("❌ Өмнөх өдрийн өгөгдөл уншихад алдаа:", error);
    }
    return null;
  }

  // API-аас авсан нийт санал тоогоор өнөөдрийн нэмэгдэл тооцоолох
  public updateVoteCount(currentTotalVotes: number): number {
    const today = this.getTodayDateString();
    const currentTime = this.getCurrentTimeString();

    // Хэрэв өдөр өөрчлөгдсөн эсвэл анх удаа бол шинэ өдөр эхлүүлэх
    if (!this.currentData || this.currentData.date !== today) {
      // Өмнөх өдрийн сүүлийн санал тоог авч, өнөөдрийн эхний цэг болгох
      const previousDayData = this.getPreviousDayData();
      const startOfDayVotes =
        previousDayData?.currentVotes || currentTotalVotes;

      // Хэрэв өмнөх өдрийн өгөгдөл байгаа бол тэрийг ашиглаж baseline тооцоолох
      // Үгүй бол одоогийн санал тоог baseline болгох (анхны удаа ажиллуулах үед)
      const dailyAdded = previousDayData
        ? Math.max(0, currentTotalVotes - startOfDayVotes)
        : 0; // First time running - no baseline available

      this.currentData = {
        date: today,
        startOfDayVotes: startOfDayVotes,
        currentVotes: currentTotalVotes,
        dailyAdded: dailyAdded,
        lastUpdated: currentTime,
      };

      // Save to file immediately
      this.saveDataToFile();

      console.log(`��� Шинэ өдөр эхэллээ: ${today}`);
      console.log(`🌅 Өдрийн эхний санал тоо: ${startOfDayVotes}`);
      console.log(`📊 Одоогийн санал тоо: ${currentTotalVotes}`);
      console.log(`➕ Өнөөдрийн нэмэгдэл: ${this.currentData.dailyAdded}`);
      if (previousDayData) {
        console.log(
          `📋 Өмнөх өдрийн өгөгдөл ашигласан: ${previousDayData.date} (${previousDayData.currentVotes} санал)`,
        );
      } else {
        console.log(`⚠️  Өмнөх өдрийн өгөгдөл алга - анхны удаа ажиллаж байна`);
      }

      return this.currentData.dailyAdded;
    }

    // Ижил өдөр - өнөөдрийн нэмэгдлийг шинэчлэх
    const dailyAdded = Math.max(
      0,
      currentTotalVotes - this.currentData.startOfDayVotes,
    );

    const oldDailyAdded = this.currentData.dailyAdded;

    this.currentData = {
      ...this.currentData,
      currentVotes: currentTotalVotes,
      dailyAdded: dailyAdded,
      lastUpdated: currentTime,
    };

    // Save to file after each update
    this.saveDataToFile();

    // Log хийх (debug зориулалт)
    if (dailyAdded !== oldDailyAdded) {
      console.log(`📈 Санал ��оо шинэчлэгдлээ: +${dailyAdded - oldDailyAdded}`);
    }

    return dailyAdded;
  }

  // Өнөөдрийн нэмэгдсэн санал тоог авах
  public getDailyVotesAdded(): number {
    const today = this.getTodayDateString();

    if (this.currentData && this.currentData.date === today) {
      return this.currentData.dailyAdded;
    }

    return 0;
  }

  // Өнөөдрийн ��татистик авах
  public getTodayStats(): DailyVoteData | null {
    const today = this.getTodayDateString();

    if (this.currentData && this.currentData.date === today) {
      return { ...this.currentData };
    }

    return null;
  }

  // Manual reset хийх (тестийн зориулалт)
  public resetDay(): void {
    console.log("🔄 Daily tracker reset хийгдлээ");
    this.currentData = null;

    // Remove the persisted file
    try {
      if (fs.existsSync(this.dataFilePath)) {
        fs.unlinkSync(this.dataFilePath);
        console.log("🗑️  Хадгалагдсан файл устгагдлаа");
      }
    } catch (error) {
      console.error("❌ Файл устгахад алдаа:", error);
    }
  }

  // Debug мэдээлэл хэвлэх
  public debugInfo(): void {
    console.log("🔍 Daily Tracker Debug Info:");
    if (this.currentData) {
      console.log(`📅 Огноо: ${this.currentData.date}`);
      console.log(`🌅 Өдрийн эхний санал: ${this.currentData.startOfDayVotes}`);
      console.log(`📊 Одоогийн санал: ${this.currentData.currentVotes}`);
      console.log(`➕ Өнөөдрийн нэмэгдэл: ${this.currentData.dailyAdded}`);
      console.log(`⏰ Сүүлд шинэчилсэн: ${this.currentData.lastUpdated}`);
    } else {
      console.log("❌ Өгөгдөл алга");
    }
  }
}

// Singleton instance үүсгэх
export const simpleDailyTracker = new SimpleDailyTracker();
