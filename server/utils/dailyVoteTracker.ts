interface DailyVoteData {
  date: string;
  totalVotes: number;
  dailyVotesAdded: number;
}

class DailyVoteTracker {
  private currentData: DailyVoteData | null = null;
  private readonly STORAGE_KEY = "daily_vote_data";

  private getTodayDateString(): string {
    // Get Ulaanbaatar timezone date
    const now = new Date();
    const ulanbatarTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Ulaanbaatar" }),
    );
    return ulanbatarTime.toISOString().split("T")[0]; // YYYY-MM-DD format
  }

  private loadData(): DailyVoteData | null {
    // In a real application, this would load from a database or file
    // For now, we'll store it in memory (resets on server restart)
    return this.currentData;
  }

  private saveData(data: DailyVoteData): void {
    // In a real application, this would save to a database or file
    this.currentData = data;
  }

  public updateVoteCount(newTotalVotes: number): number {
    const today = this.getTodayDateString();
    const existingData = this.loadData();

    if (!existingData || existingData.date !== today) {
      // New day or first time - reset daily count
      const dailyVotesAdded = existingData
        ? Math.max(0, newTotalVotes - existingData.totalVotes)
        : 0;

      const newData: DailyVoteData = {
        date: today,
        totalVotes: newTotalVotes,
        dailyVotesAdded: dailyVotesAdded,
      };

      this.saveData(newData);
      return dailyVotesAdded;
    } else {
      // Same day - calculate votes added since start of day
      const baseVotesForToday =
        existingData.totalVotes - existingData.dailyVotesAdded;
      const dailyVotesAdded = Math.max(0, newTotalVotes - baseVotesForToday);

      const updatedData: DailyVoteData = {
        date: today,
        totalVotes: newTotalVotes,
        dailyVotesAdded: dailyVotesAdded,
      };

      this.saveData(updatedData);
      return dailyVotesAdded;
    }
  }

  public getDailyVotesAdded(): number {
    const data = this.loadData();
    const today = this.getTodayDateString();

    if (data && data.date === today) {
      return data.dailyVotesAdded;
    }

    return 0;
  }
}

// Export singleton instance
export const dailyVoteTracker = new DailyVoteTracker();
