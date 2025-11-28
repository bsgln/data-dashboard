import { BudgetPriorityIndex } from "@shared/survey";

interface BudgetPriorityTableProps {
  data?: BudgetPriorityIndex[];
}

export function BudgetPriorityTable({ data }: BudgetPriorityTableProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="bg-white p-3 sm:p-4 lg:p-5 rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)]
                      transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,102,255,0.12)]
                      min-h-[280px] sm:min-h-[320px] lg:min-h-[380px] flex items-center justify-center"
      >
        <div className="text-center w-full">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  const getStatusText = (status: string) => {
    switch (status) {
      case "increase":
        return "Өндөр";
      case "decrease":
        return "Бага";
      case "neutral":
        return "=";
      default:
        return "=";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      case "neutral":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      className="bg-white p-3 sm:p-4 lg:p-5 rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)]
                    transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,102,255,0.12)]
                    animate-in slide-in-from-bottom-4 fade-in min-h-[280px] sm:min-h-[320px] lg:min-h-[380px] flex flex-col"
      style={{ animationDelay: "400ms", animationFillMode: "backwards" }}
    >
      <div className="mb-4 sm:mb-6">
        <h3
          className="text-[16px] sm:text-[18px] lg:text-[19px] font-semibold text-[#1E293B] tracking-[0.36px]
                       transition-colors duration-200 leading-[1.3]"
          lang="mn"
        >
          Ач холбогдлын зэрэг
        </h3>
      </div>

      <div className="space-y-0 overflow-hidden rounded-lg border border-gray-100 flex-1 flex flex-col">
        {/* Header */}
        <div
          className="bg-[#E8EDF5] p-2 sm:p-3 flex justify-between items-center animate-in slide-in-from-top-2 fade-in"
          style={{ animationDelay: "600ms", animationFillMode: "backwards" }}
        >
          <span className="text-[12px] sm:text-[14px] font-semibold text-[#1E293B] tracking-[0.28px] leading-[1.3]">
            Салбар
          </span>
          <div className="flex items-center gap-4 sm:gap-8">
            <span className="text-[12px] sm:text-[14px] text-[#1E293B] tracking-[0.28px] leading-[1.3] hidden sm:inline">
              Индекс (%)
            </span>
            <span className="text-[12px] sm:text-[14px] text-[#1E293B] tracking-[0.28px] w-[45px] sm:w-[57px] text-center leading-[1.3]">
              Төлөв
            </span>
          </div>
        </div>

        {/* Data rows */}
        {data.map((item, index) => (
          <div
            key={index}
            className="p-3 flex justify-between items-center border-b border-gray-50 last:border-b-0 
                       hover:bg-gray-50 transition-all duration-200 hover:translate-x-1 group
                       animate-in slide-in-from-left-2 fade-in"
            style={{
              animationDelay: `${700 + index * 50}ms`,
              animationFillMode: "backwards",
            }}
          >
            <span
              className="text-[12px] sm:text-[14px] text-[#1E293B] tracking-[0.28px] flex-1
                         transition-colors duration-200 group-hover:text-[#0066FF] leading-[1.3]
                         min-w-0 overflow-hidden text-ellipsis pr-2"
            >
              {item.category}
            </span>
            <div className="flex items-center gap-4 sm:gap-8 flex-shrink-0">
              <span
                className="text-[11px] sm:text-[12px] text-[#1E293B] tracking-[0.18px] w-[60px] sm:w-[72px]
                             text-center font-medium transition-all duration-200 group-hover:scale-105 leading-[1.3]"
              >
                {item.index}
              </span>
              <span
                className={`text-[11px] sm:text-[12px] tracking-[0.18px] w-[45px] sm:w-[57px] text-center
                             font-medium transition-all duration-200 ${getStatusColor(item.status)} group-hover:scale-105 leading-[1.3]`}
              >
                {getStatusText(item.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
