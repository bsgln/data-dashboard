import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface AgeParticipationData {
  ageRange: string;
  surveyed: number;
  population: number;
  participationRate: number;
  color: string;
}

interface AgeParticipationChartProps {
  totalVotes: number;
}

export function AgeParticipationChart({
  totalVotes,
}: AgeParticipationChartProps) {
  // Real survey response data and population data
  const participationData: AgeParticipationData[] = [
    {
      ageRange: "16-17 нас",
      surveyed: 119,
      population: 106318, // Estimated from 15-19 group (265,796 * 0.4)
      participationRate: 0.11,
      color: "#0066FF",
    },
    {
      ageRange: "18-24 нас",
      surveyed: 20958,
      population: 179264,
      participationRate: 11.69,
      color: "#E11D48",
    },
    {
      ageRange: "25-34 нас",
      surveyed: 51042,
      population: 244588,
      participationRate: 20.87,
      color: "#22C55E",
    },
    {
      ageRange: "35-44 нас",
      surveyed: 46795,
      population: 289587,
      participationRate: 16.16,
      color: "#F97316",
    },
    {
      ageRange: "45-54 нас",
      surveyed: 18410,
      population: 267022,
      participationRate: 6.89,
      color: "#A855F7",
    },
    {
      ageRange: "55+ нас",
      surveyed: 6231,
      population: 233287,
      participationRate: 2.67,
      color: "#EC4899",
    },
  ];

  // Custom tooltip to show detailed information
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none">
          <div className="text-center">
            <div className="font-semibold text-white">{data.ageRange}</div>
            <div className="text-white">
              Оролцсон: {data.surveyed.toLocaleString()}
            </div>
            <div className="text-white">
              Нийт хүн ам: {data.population.toLocaleString()}
            </div>
            <div className="text-white font-medium">
              Оролцооны хувь: {data.participationRate}%
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!totalVotes) {
    return (
      <div
        className="bg-white p-3 sm:p-4 lg:p-5 rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)]
                      transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,102,255,0.12)]
                      min-h-[280px] sm:min-h-[320px] lg:min-h-[380px] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-3"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white p-3 sm:p-4 lg:p-5 rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)]
                    transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,102,255,0.12)]
                    animate-in slide-in-from-left-4 fade-in min-h-[280px] sm:min-h-[320px] lg:min-h-[380px] flex flex-col"
      style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
    >
      <div className="mb-4 sm:mb-6">
        <h3
          className="text-[16px] sm:text-[18px] lg:text-[19px] font-semibold text-[#1E293B] mb-1 tracking-[0.36px]
                       transition-colors duration-200 leading-[1.3]"
        >
          Насны бүлгээр оролцооны хувь
        </h3>
        <p
          className="text-[12px] sm:text-[14px] lg:text-[15px] text-[#64748B] tracking-[0.28px]
                      transition-colors duration-200 leading-[1.4]"
        >
          Санал өгөгчдийн насны тархалт
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 sm:gap-8 flex-1">
        <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] lg:w-[166px] lg:h-[166px] group mx-auto">
          <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={participationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="participationRate"
                  className="transition-all duration-300"
                >
                  {participationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-full space-y-1 sm:space-y-2">
          {participationData.map((item, index) => (
            <div key={index} className="space-y-1 group">
              <div className="flex justify-between items-center transition-all duration-200 group-hover:translate-x-1">
                <span
                  className="text-[13px] sm:text-[14px] font-semibold text-[#1E293B] tracking-[0.28px]
                             transition-colors duration-200 leading-[1.3]"
                >
                  {item.ageRange}
                </span>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span
                    className="text-[11px] sm:text-[12px] text-[#64748B] tracking-[0.18px]
                               transition-colors duration-200 leading-[1.3]"
                  >
                    {item.surveyed.toLocaleString()}
                  </span>
                  <span
                    className="text-[11px] sm:text-[12px] text-[#64748B] tracking-[0.18px]
                               transition-colors duration-200 leading-[1.3]"
                  >
                    {item.participationRate}%
                  </span>
                </div>
              </div>
              <div className="relative h-1.5 bg-[#E8EDF5] rounded-lg overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-lg transition-all duration-1000 ease-out"
                  style={{
                    width: "0%",
                    backgroundColor: item.color,
                    animation: `expandBar${index} 1.2s ease-out ${0.8 + index * 0.1}s both`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          <p>Оролцооны хувь = (Санал өгсөн / Нийт хүн ам) × 100%</p>
          <p className="mt-1">
            *16-17 насны хүн амын тоо тооцоолсон (15-19 бүлгээс)
          </p>
        </div>
      </div>

      <style>{`
        ${participationData
          .map(
            (item, index) => `
          @keyframes expandBar${index} {
            from {
              width: 0%;
            }
            to {
              width: ${item.participationRate}%;
            }
          }
        `,
          )
          .join("")}
      `}</style>
    </div>
  );
}
