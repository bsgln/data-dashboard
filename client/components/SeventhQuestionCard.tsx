import { SurveyQuestion } from "@shared/survey";
import { TrendingUp, Calendar, Users, MessageSquare } from "lucide-react";

interface DetailedResponse {
  category: string;
  percentage: number;
  votes: number;
  color: string;
  details: string[];
}

interface SeventhQuestionCardProps {
  question?: SurveyQuestion;
}

export function SeventhQuestionCard({ question }: SeventhQuestionCardProps) {
  // Static data for citizen suggestions with detailed descriptions
  const citizenSuggestions: DetailedResponse[] = [
    {
      category: "Цалин нэмэгдүүлэх",
      percentage: 19,
      votes: Math.round(38514 * 0.19),
      color: "#0066FF",
      details: [
        "Багш, эмч, цагдаагийн цалинг нэмэгдүүлэх",
        "Төрийн албан хаагчдын цалинг амьжиргааны түвшинд нийцүүлэх",
      ],
    },
    {
      category: "Төсвийн үр ашиг",
      percentage: 15,
      votes: Math.round(38514 * 0.15),
      color: "#E11D48",
      details: [
        "Зардлыг бууруулах, үр ашиггүй зардлыг танах",
        "Давхардсан төсвийн зарцуулалтыг зогсоох",
      ],
    },
    {
      category: "Эрүүл мэндийн үйлчилгээ",
      percentage: 14,
      votes: Math.round(38514 * 0.14),
      color: "#22C55E",
      details: [
        "Эрүүл мэндийн хүртээмж, чанарыг сайжруулах",
        "Эрүүл мэндийн салбарын төсвийг нэмэгдүүлэх",
      ],
    },
    {
      category: "Боловсролын салбар",
      percentage: 12,
      votes: Math.round(38514 * 0.12),
      color: "#F97316",
      details: [
        "Сургууль, цэцэрлэгийн тоог нэмэгдүүлэх",
        "Хөдөө орон нутагт боловсролын чанарыг дээшлүүлэх",
      ],
    },
    {
      category: "Хууль, цагдаагийн байгууллага",
      percentage: 11,
      votes: Math.round(38514 * 0.11),
      color: "#A855F7",
      details: [
        "Цагдаагийн байгууллагын нөхцөлийг сайжруулах",
        "Хууль хэрэгжилтийг чангатгах",
      ],
    },
    {
      category: "Нийгмийн хамгаалал",
      percentage: 8,
      votes: Math.round(38514 * 0.08),
      color: "#EC4899",
      details: [
        "Эх, хүүхдийн халамж, тэтгэмжийг нэмэгдүүлэх",
        "Амьжиргааны түвшин доогуур иргэдэд дэмжлэг үзүүлэх",
      ],
    },
    {
      category: "Дэд бүтэц, зам засвар",
      percentage: 7,
      votes: Math.round(38514 * 0.07),
      color: "#4D7C0F",
      details: [
        "Хот, орон нутгийн замыг засварлах",
        "Гэрэлтүүлэг, явган хүний замыг сайжруулах",
      ],
    },
    {
      category: "Хөдөө аж ахуй",
      percentage: 6,
      votes: Math.round(38514 * 0.06),
      color: "#0D9488",
      details: [
        "Малын эрүүл мэнд, бэлчээрийн менежмент сайжруулах",
        "Хөдөө аж ахуйн салбарт дэмжлэг үзүүлэх",
      ],
    },
    {
      category: "Байгаль орчны хамгаалал",
      percentage: 5,
      votes: Math.round(38514 * 0.05),
      color: "#0EA5E9",
      details: [
        "Байгаль хамгаалах төсвийг нэмэгдүүлэх",
        "Хог, бохирдлын менежментийг сайжруулах",
      ],
    },
    {
      category: "Хувийн хэвшлийн дэмжлэг",
      percentage: 4,
      votes: Math.round(38514 * 0.04),
      color: "#6366F1",
      details: [
        "Жижиг, дунд бизнесийн нөхцөлийг сайжруулах",
        "Татварын хөнгөлөлт олгох",
      ],
    },
  ];

  const totalVotes = 38514;
  const allSuggestions = citizenSuggestions; // Show all 10

  return (
    <div
      className="relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50
                    p-4 sm:p-5 lg:p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,102,255,0.12)]
                    border border-blue-100/50 backdrop-blur-sm
                    min-h-[380px] sm:min-h-[420px] flex flex-col
                    overflow-hidden"
    >
      {/* Header with icon */}
      <div className="relative z-10 mb-4 sm:mb-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs sm:text-sm text-green-600 font-medium tracking-wide uppercase">
              Иргэдийн санал
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-full">
            <Users className="w-3 h-3" />
            <span>{totalVotes.toLocaleString()}</span>
          </div>
        </div>

        <h3
          className="text-[16px] sm:text-[18px] lg:text-[19px] font-bold text-[#1E293B]
                       tracking-[0.36px] transition-colors duration-200 leading-[1.3]
                       bg-gradient-to-r from-gray-900 via-green-900 to-emerald-900 bg-clip-text text-transparent"
        >
          Иргэдээс ирсэн саналууд
        </h3>
      </div>

      {/* All Citizen Suggestions */}
      <div className="relative z-10 flex-1 space-y-3 sm:space-y-4">
        {allSuggestions.map((suggestion, index) => (
          <div
            key={suggestion.category}
            className={`relative p-3 sm:p-4 rounded-xl border backdrop-blur-sm
                      ${
                        index === 0
                          ? "bg-gradient-to-r from-white/90 to-green-50/80 border-green-200/60 shadow-[0_4px_20px_rgba(34,197,94,0.15)]"
                          : index === 1
                            ? "bg-gradient-to-r from-white/80 to-emerald-50/70 border-emerald-200/50 shadow-[0_3px_16px_rgba(34,197,94,0.1)]"
                            : index === 2
                              ? "bg-gradient-to-r from-white/75 to-blue-50/65 border-blue-200/45 shadow-[0_2px_12px_rgba(34,197,94,0.08)]"
                              : "bg-gradient-to-r from-white/70 to-gray-50/60 border-gray-200/40 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                      }`}
          >
            {/* Rank indicator */}
            <div
              className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg
                           ${
                             index === 0
                               ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                               : index === 1
                                 ? "bg-gradient-to-br from-gray-400 to-gray-600"
                                 : index === 2
                                   ? "bg-gradient-to-br from-amber-600 to-yellow-700"
                                   : "bg-gradient-to-br from-blue-500 to-indigo-600"
                           }`}
            >
              {index + 1}
            </div>

            <div className="space-y-3">
              {/* Header with category and percentage */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: suggestion.color }}
                  />
                  <span className="text-[14px] sm:text-[15px] font-bold text-[#1E293B] leading-tight">
                    {suggestion.category}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-[14px] sm:text-[16px] font-bold text-[#1E293B]">
                    ≈{suggestion.percentage}%
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#64748B]">
                    {suggestion.votes.toLocaleString()} санал
                  </div>
                </div>
              </div>

              {/* Detailed suggestions */}
              <div className="space-y-1">
                {suggestion.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                    <span className="text-[12px] sm:text-[13px] text-[#475569] leading-relaxed">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="relative h-2 bg-gray-200/60 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${suggestion.percentage}%`,
                    backgroundColor: suggestion.color,
                    boxShadow: `0 0 8px ${suggestion.color}40`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer stats */}
      <div className="relative z-10 mt-4 pt-3 border-t border-gray-200/50">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Санал бичсэн</span>
          <span className="font-semibold text-gray-700">
            {totalVotes.toLocaleString()} хүн
          </span>
        </div>
      </div>
    </div>
  );
}
