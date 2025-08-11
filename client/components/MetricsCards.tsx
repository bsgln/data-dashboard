import { SurveyMetrics } from "@shared/survey";
import { Users, TrendingUp, UserCheck, Trophy, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { AnimatedNumber } from "./AnimatedNumber";
import { useEffect, useState } from "react";

interface MetricsCardsProps {
  metrics?: SurveyMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const [userVoteCount, setUserVoteCount] = useState(0);

  // localStorage key for tracking user interactions
  const VOTE_COUNT_KEY = 'userVoteCount';

  useEffect(() => {
    // Load user vote count from localStorage
    const savedCount = localStorage.getItem(VOTE_COUNT_KEY);
    if (savedCount) {
      setUserVoteCount(parseInt(savedCount, 10));
    }
  }, []);

  // Function to increment user vote count
  const incrementUserVote = () => {
    const newCount = userVoteCount + 1;
    setUserVoteCount(newCount);
    localStorage.setItem(VOTE_COUNT_KEY, newCount.toString());
  };

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white p-3 sm:p-4 lg:p-5 rounded-lg shadow-[0_2px_8px_rgba(0,102,255,0.06)]
                       min-h-[100px] sm:min-h-[110px] lg:min-h-[120px] flex flex-col justify-between"
          >
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div>
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Нийт санал",
      value: metrics.totalVotes || 0,
      subtitle: "Нийт санал өгсөн хүмүүсийн тоо",
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      tooltip:
        "Санал асуулгад оролцсон нийт хүмүүсийн тоо. Бодит цагийн мэдээлэл.",
      isNumeric: true,
    },
    {
      title: "Минутанд өгсөн дундаж санал",
      value: metrics.averageVotesPerMinute || 0,
      subtitle: "санал/минут",
      icon: TrendingUp,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      tooltip:
        "Санал асуулгын хугацааны турш минут бүрт дунджаар хэдэн санал өгсөн тооцоолол. Тооцоолол: Нийт санал ÷ (Эхлэх - Дуусах хугацаа минутаар)",
      isNumeric: true,
      formatter: (v: number) => v.toFixed(1),
    },
    {
      title: "Монгол улсын насанд хүрсэн иргэд",
      value: `${metrics.completionPercentage || 0} %`,
      subtitle: "16+ насны иргэдээс авсан саналын хувь",
      icon: UserCheck,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      tooltip:
        "Санал асуулгыг дуусгасан хувь. Тооцоолол: (Нийт санал ÷ Монгол улсын 16+ насны иргэдийн тоо) × 100%",
      isNumeric: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-3 sm:p-4 rounded-lg shadow-[0_2px_8px_rgba(0,102,255,0.06)]
                     transform transition-all duration-300 ease-out hover:scale-[1.02] 
                     hover:shadow-[0_4px_16px_rgba(0,102,255,0.12)] animate-in slide-in-from-bottom-4 fade-in
                     min-h-[100px] sm:min-h-[110px] flex flex-col justify-between
                     border border-gray-50 hover:border-blue-100"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: "backwards",
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <h3
              className="text-[13px] sm:text-[14px] text-[#1E293B] tracking-[0.2px] transition-colors duration-200
                leading-[1.3] font-medium flex-1 pr-2"
            >
              {card.title}
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`p-1.5 ${card.iconBg} rounded-lg cursor-help transition-all duration-200
                             hover:scale-110 flex-shrink-0`}
                >
                  <card.icon
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${card.iconColor}`}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{card.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-col gap-1">
            {card.isNumeric && index !== 0 ? (
              <AnimatedNumber
                value={card.value}
                className="text-[20px] sm:text-[24px] font-semibold text-[#0066FF]
                          tracking-[0.4px] leading-[1.1]"
                formatter={card.formatter}
              />
            ) : (
              <div
                className="text-[20px] sm:text-[24px] font-semibold text-[#0066FF]
                           tracking-[0.4px] transition-colors duration-200 leading-[1.1]"
              >
                {card.isNumeric && card.formatter
                  ? card.formatter(card.value as number)
                  : card.isNumeric
                    ? (card.value as number).toLocaleString()
                    : card.value}
              </div>
            )}
            <div
              className="text-[11px] sm:text-[12px] text-[#64748B] tracking-[0.2px]
                         transition-colors duration-200 leading-[1.2]"
            >
              {card.subtitle}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
