import { supabase } from "./supabase";

interface DailyVoteRecord {
  id?: number;
  date: string;
  votes_at_start: number;
  votes_at_end: number;
  daily_added: number;
  created_at?: string;
  updated_at?: string;
}

class SupabaseDailyTracker {
  private getTodayDateString(): string {
    // Get Ulaanbaatar timezone date at midnight
    const now = new Date();
    const ulanbatarTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Ulaanbaatar" }),
    );
    return ulanbatarTime.toISOString().split("T")[0]; // YYYY-MM-DD format
  }

  private getYesterdayDateString(): string {
    const now = new Date();
    const ulanbatarTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Ulaanbaatar" }),
    );
    ulanbatarTime.setDate(ulanbatarTime.getDate() - 1);
    return ulanbatarTime.toISOString().split("T")[0];
  }

  // Get or create today's record
  private async getTodayRecord(): Promise<DailyVoteRecord | null> {
    if (!supabase) {
      console.warn("Supabase not initialized, using fallback daily tracking");
      return null;
    }

    const today = this.getTodayDateString();

    try {
      const { data, error } = await supabase
        .from("daily_vote_stats")
        .select("*")
        .eq("date", today)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching today record:", error);
      return null;
    }
  }

  // Get yesterday's record to establish baseline
  private async getYesterdayRecord(): Promise<DailyVoteRecord | null> {
    if (!supabase) return null;

    const yesterday = this.getYesterdayDateString();

    try {
      const { data, error } = await supabase
        .from("daily_vote_stats")
        .select("*")
        .eq("date", yesterday)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching yesterday record:", error);
      return null;
    }
  }

  // Update daily vote count based on current total votes
  public async updateDailyVoteCount(
    currentTotalVotes: number,
  ): Promise<number> {
    if (!supabase) {
      // Fallback to local tracking if Supabase not available
      return 0;
    }

    const today = this.getTodayDateString();

    try {
      // Get today's existing record
      const todayRecord = await this.getTodayRecord();

      if (todayRecord) {
        // Update existing record
        const dailyAdded = Math.max(
          0,
          currentTotalVotes - todayRecord.votes_at_start,
        );

        const { error } = await supabase
          .from("daily_vote_stats")
          .update({
            votes_at_end: currentTotalVotes,
            daily_added: dailyAdded,
            updated_at: new Date().toISOString(),
          })
          .eq("date", today);

        if (error) throw error;

        return dailyAdded;
      } else {
        // Create new record for today
        // Get yesterday's end votes as baseline
        const yesterdayRecord = await this.getYesterdayRecord();
        const votesAtStart = yesterdayRecord?.votes_at_end || currentTotalVotes;
        const dailyAdded = Math.max(0, currentTotalVotes - votesAtStart);

        const { error } = await supabase.from("daily_vote_stats").insert({
          date: today,
          votes_at_start: votesAtStart,
          votes_at_end: currentTotalVotes,
          daily_added: dailyAdded,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (error) throw error;

        return dailyAdded;
      }
    } catch (error) {
      console.error("Error updating daily vote count:", error);
      return 0; // Return 0 if database operation fails
    }
  }

  // Get today's daily votes added (from midnight to now)
  public async getDailyVotesAdded(): Promise<number> {
    if (!supabase) return 0;

    try {
      const todayRecord = await this.getTodayRecord();
      return todayRecord?.daily_added || 0;
    } catch (error) {
      console.error("Error getting daily votes added:", error);
      return 0;
    }
  }

  // Get vote statistics for a specific date
  public async getVoteStatsForDate(
    date: string,
  ): Promise<DailyVoteRecord | null> {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from("daily_vote_stats")
        .select("*")
        .eq("date", date)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Error getting vote stats for ${date}:`, error);
      return null;
    }
  }

  // Get last 7 days of vote statistics
  public async getWeeklyStats(): Promise<DailyVoteRecord[]> {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from("daily_vote_stats")
        .select("*")
        .order("date", { ascending: false })
        .limit(7);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Error getting weekly stats:", error);
      return [];
    }
  }
}

// Export singleton instance
export const supabaseDailyTracker = new SupabaseDailyTracker();
