import { AgeGroup } from "@shared/survey";

interface AgeGroupChartProps {
  data?: AgeGroup[];
}

export function AgeGroupChart({ data }: AgeGroupChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="bg-white p-4 sm:p-5 rounded-lg shadow-[0_2px_8px_rgba(0,102,255,0.06)]
                      min-h-[280px] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-gray-500 text-sm font-medium">Мэдээлэл алга</div>
          <div className="text-gray-400 text-xs mt-1">Насны бүлгийн статистик</div>
        </div>
      </div>
    );
  }

  const maxPercentage = Math.max(...data.map((group) => group.percentage));

  return (
    <div
      className="bg-white p-4 sm:p-5 rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)]
                    transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,102,255,0.12)]
                    animate-in slide-in-from-right-4 fade-in min-h-[320px] sm:min-h-[380px] flex flex-col"
      style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
    >
      <div className="mb-4 sm:mb-6">
        <h3
          className="text-[16px] sm:text-[18px] font-semibold text-[#1E293B] mb-1 tracking-[0.36px]
                       transition-colors duration-200 leading-[1.3]"
        >
          Насны ангилал
        </h3>
        <p
          className="text-[12px] sm:text-[14px] text-[#64748B] tracking-[0.28px]
                      transition-colors duration-200 leading-[1.4]"
        >
          Санал өгөгчдийн насны бүлэг
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4 flex-1">
        {data.map((group, index) => (
          <div
            key={index}
            className="space-y-2 group animate-in slide-in-from-left-2 fade-in"
            style={{
              animationDelay: `${600 + index * 100}ms`,
              animationFillMode: "backwards",
            }}
          >
            <div className="flex justify-between items-center transition-all duration-200 group-hover:translate-x-1">
              <span
                className="text-[13px] sm:text-[14px] font-semibold text-[#1E293B] tracking-[0.28px]
                             transition-colors duration-200 leading-[1.3]"
              >
                {group.range}
              </span>
              <div className="flex items-center gap-3 sm:gap-4">
                <span
                  className="text-[11px] sm:text-[12px] text-[#64748B] tracking-[0.18px]
                               transition-all duration-200 group-hover:text-[#0066FF] leading-[1.3]"
                >
                  {group.count.toLocaleString()} хүн
                </span>
                <span
                  className="text-[11px] sm:text-[12px] text-[#64748B] tracking-[0.18px]
                               transition-all duration-200 group-hover:text-[#0066FF] leading-[1.3]"
                >
                  {group.percentage}%
                </span>
              </div>
            </div>
            <div className="relative h-1.5 bg-[#E8EDF5] rounded-lg overflow-hidden group-hover:h-2 transition-all duration-200">
              <div
                className="absolute left-0 top-0 h-full bg-[#0066FF] rounded-lg transition-all duration-700 ease-out group-hover:bg-[#0052CC]"
                style={{
                  width: "0%",
                  animation: `expandBar${index} 0.8s ease-out ${800 + index * 100}ms both`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        ${data
          .map(
            (group, index) => `
        @keyframes expandBar${index} {
          from {
            width: 0%;
            opacity: 0.7;
          }
          to {
            width: ${group.percentage}%;
            opacity: 1;
          }
        }
        `,
          )
          .join("")}
      `}</style>
    </div>
  );
}
