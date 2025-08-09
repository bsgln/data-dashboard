interface DailyVoteData {
  date: string; // YYYY-MM-DD format in Ulaanbaatar timezone
  startOfDayVotes: number; // Санал тоо өдрийн эхэнд
  currentVotes: number; // Одоогийн санал тоо
  dailyAdded: number; // Өнөөдөр нэмэгдсэн санал
  lastUpdated: string; // Сүүлд шинэчилсэн цаг
}

class SimpleDailyTracker {
  private currentData: DailyVoteData | null = null;

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

  // API-аас авсан нийт санал тоогоор өнөөдрийн нэмэгдэл тооцоолох
  public updateVoteCount(currentTotalVotes: number): number {
    const today = this.getTodayDateString();
    const currentTime = this.getCurrentTimeString();

    // Хэрэв өдөр өөрчлөгдсөн эсвэл анх удаа бол шинэ өдөр эхлүүлэх
    if (!this.currentData || this.currentData.date !== today) {
      // Өмнөх өдрийн сүүлийн санал тоог авч, өнөөдрийн эхний цэг болгох
      const startOfDayVotes =
        this.currentData?.currentVotes || currentTotalVotes;

      this.currentData = {
        date: today,
        startOfDayVotes: startOfDayVotes,
        currentVotes: currentTotalVotes,
        dailyAdded: Math.max(0, currentTotalVotes - startOfDayVotes),
        lastUpdated: currentTime,
      };

      console.log(`📅 Шинэ өдөр эхэллээ: ${today}`);
      console.log(`🌅 Өдрийн эхний санал тоо: ${startOfDayVotes}`);
      console.log(`📊 Одоогийн санал тоо: ${currentTotalVotes}`);
      console.log(`➕ Өнөөдрийн нэмэгдэл: ${this.currentData.dailyAdded}`);

      return this.currentData.dailyAdded;
    }

    // Ижил өдөр - өнөөдрийн нэмэгдлийг шинэчлэх
    const dailyAdded = Math.max(
      0,
      currentTotalVotes - this.currentData.startOfDayVotes,
    );

    this.currentData = {
      ...this.currentData,
      currentVotes: currentTotalVotes,
      dailyAdded: dailyAdded,
      lastUpdated: currentTime,
    };

    // Log хийх (debug зориулалт)
    if (dailyAdded !== this.currentData.dailyAdded) {
      console.log(
        `📈 Санал тоо шинэчлэгдлээ: +${dailyAdded - this.currentData.dailyAdded}`,
      );
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
