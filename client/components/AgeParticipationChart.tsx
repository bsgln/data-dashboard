import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

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

export function AgeParticipationChart({ totalVotes }: AgeParticipationChartProps) {
  // Real survey response data and population data
  const participationData: AgeParticipationData[] = [
    {
      ageRange: "16-17 ��ас",
      surveyed: 119,
      population: 106318, // Estimated from 15-19 group (265,796 * 0.4)
      participationRate: 0.11,
      color: "#0066FF"
    },
    {
      ageRange: "18-24 нас", 
      surveyed: 20958,
      population: 179264,
      participationRate: 11.69,
      color: "#E11D48"
    },
    {
      ageRange: "25-34 нас",
      surveyed: 51042,
      population: 244588,
      participationRate: 20.87,
      color: "#22C55E"
    },
    {
      ageRange: "35-44 нас", 
      surveyed: 46795,
      population: 289587,
      participationRate: 16.16,
      color: "#F97316"
    },
    {
      ageRange: "45-54 нас",
      surveyed: 18410,
      population: 267022,
      participationRate: 6.89,
      color: "#A855F7"
    },
    {
      ageRange: "55+ нас",
      surveyed: 6231,
      population: 233287,
      participationRate: 2.67,
      color: "#EC4899"
    }
  ];

  // Custom tooltip to show detailed information
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.ageRange}</p>
          <p className="text-sm text-gray-600">
            Оролцсон: <span className="font-medium">{data.surveyed.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-600">
            Нийт хүн ам: <span className="font-medium">{data.population.toLocaleString()}</span>
          </p>
          <p className="text-sm text-blue-600 font-medium">
            Оролцооны хувь: {data.participationRate}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend to show participation rates
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1 text-xs">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">
              {entry.payload.ageRange}: {entry.payload.participationRate}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (!totalVotes) {
    return (
      <div
        className="bg-white p-4 sm:p-5 rounded-lg shadow-[0_2px_8px_rgba(0,102,255,0.06)]
                      min-h-[350px] flex items-center justify-center"
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
      className="bg-white p-4 sm:p-5 rounded-lg shadow-[0_2px_8px_rgba(0,102,255,0.06)]
                 animate-in slide-in-from-left-2 fade-in"
      style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#1E293B] tracking-[0.3px]">
          Насны бүлгээр оролцооны хувь
        </h3>
        <div className="text-xs text-gray-500">
          Нийт: {totalVotes.toLocaleString()} санал
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={participationData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="participationRate"
            >
              {participationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          <p>Оролцооны хувь = (Санал өгсөн / Нийт хүн ам) × 100%</p>
          <p className="mt-1">*16-17 насны хүн амын тоо тооцоолсон (15-19 бүлгээс)</p>
        </div>
      </div>
    </div>
  );
}
