import { GenderDistribution } from "@shared/survey";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface GenderChartProps {
  data?: GenderDistribution;
}

export function GenderChart({ data }: GenderChartProps) {
  if (!data) {
    return (
      <div
        className="bg-white p-4 sm:p-5 rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)]
                      transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,102,255,0.12)]
                      min-h-[320px] sm:min-h-[380px] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-3"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  const genderData = [
    {
      name: "Эрэгтэй",
      value: data.male.percentage,
      count: data.male.count,
      color: "#4791FF"
    },
    {
      name: "Эмэгтэй", 
      value: data.female.percentage,
      count: data.female.count,
      color: "#FB7185"
    }
  ];

  // Custom tooltip to show detailed information
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none">
          <div className="text-center">
            <div className="font-semibold text-white">{data.name}</div>
            <div className="text-white">
              {data.count.toLocaleString()} хүн ({data.value}%)
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="bg-white p-4 sm:p-5 rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)]
                    transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,102,255,0.12)]
                    animate-in slide-in-from-left-4 fade-in min-h-[320px] sm:min-h-[380px] flex flex-col"
      style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
    >
      <div className="mb-4 sm:mb-6">
        <h3
          className="text-[16px] sm:text-[18px] font-semibold text-[#1E293B] mb-1 tracking-[0.36px]
                       transition-colors duration-200 leading-[1.3]"
        >
          Хүйсийн тархалт
        </h3>
        <p
          className="text-[12px] sm:text-[14px] text-[#64748B] tracking-[0.28px]
                      transition-colors duration-200 leading-[1.4]"
        >
          Санал өгөгчдийн хүйсний харьцаа
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 sm:gap-8 flex-1">
        <div className="relative w-[140px] h-[140px] sm:w-[166px] sm:h-[166px] group">
          <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  className="transition-all duration-300"
                >
                  {genderData.map((entry, index) => (
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

        <div className="w-full space-y-2">
          {genderData.map((item, index) => (
            <div key={index} className="space-y-1 group">
              <div className="flex justify-between items-center transition-all duration-200 group-hover:translate-x-1">
                <span
                  className="text-[13px] sm:text-[14px] font-semibold text-[#1E293B] tracking-[0.28px]
                             transition-colors duration-200 leading-[1.3]"
                >
                  {item.name}
                </span>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span
                    className="text-[11px] sm:text-[12px] text-[#64748B] tracking-[0.18px]
                               transition-colors duration-200 leading-[1.3]"
                  >
                    {item.count.toLocaleString()} хүн
                  </span>
                  <span
                    className="text-[11px] sm:text-[12px] text-[#64748B] tracking-[0.18px]
                               transition-colors duration-200 leading-[1.3]"
                  >
                    {item.value}%
                  </span>
                </div>
              </div>
              <div className="relative h-1.5 bg-[#E8EDF5] rounded-lg overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-lg transition-all duration-1000 ease-out"
                  style={{
                    width: "0%",
                    backgroundColor: item.color,
                    animation: `expandBar${index} 1.2s ease-out ${0.8 + index * 0.2}s both`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        ${genderData.map((item, index) => `
          @keyframes expandBar${index} {
            from {
              width: 0%;
            }
            to {
              width: ${item.value}%;
            }
          }
        `).join('')}
      `}</style>
    </div>
  );
}
