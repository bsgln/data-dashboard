import { GenderDistribution } from "@shared/survey";
import { useState } from "react";

interface GenderChartProps {
  data?: GenderDistribution;
}

export function GenderChart({ data }: GenderChartProps) {
  if (!data) {
    return (
      <div
        className="bg-white p-4 sm:p-5 rounded-lg shadow-[0_2px_8px_rgba(0,102,255,0.06)]
                      min-h-[280px] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-3"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }
  const [hoveredSegment, setHoveredSegment] = useState<
    "male" | "female" | null
  >(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const malePercentage = data.male.percentage;
  const femalePercentage = data.female.percentage;

  // Calculate angles for pie chart
  const maleAngle = (malePercentage / 100) * 360;
  const femaleAngle = (femalePercentage / 100) * 360;

  // Create pie chart paths
  const radius = 75;
  const centerX = 83;
  const centerY = 83;

  const createPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      centerX,
      centerY,
      "L",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const malePath = createPath(0, maleAngle);
  const femalePath = createPath(maleAngle, 360);

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
          <svg
            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
            viewBox="0 0 166 166"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              });
            }}
          >
            {/* Male segment */}
            <path
              d={malePath}
              fill="#4791FF"
              className="transition-all duration-300 cursor-pointer"
              style={{
                animation: "drawPath 1.5s ease-out 0.5s both",
                opacity:
                  hoveredSegment === "female"
                    ? 0.4
                    : hoveredSegment === "male"
                      ? 1
                      : 0.9,
              }}
              onMouseEnter={() => setHoveredSegment("male")}
              onMouseLeave={() => setHoveredSegment(null)}
            />

            {/* Female segment */}
            <path
              d={femalePath}
              fill="#FB7185"
              className="transition-all duration-300 cursor-pointer"
              style={{
                animation: "drawPath 1.5s ease-out 0.7s both",
                opacity:
                  hoveredSegment === "male"
                    ? 0.4
                    : hoveredSegment === "female"
                      ? 1
                      : 0.9,
              }}
              onMouseEnter={() => setHoveredSegment("female")}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          </svg>

          {/* Tooltip */}
          {hoveredSegment && (
            <div
              className="absolute z-10 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none
                         transform -translate-x-1/2 -translate-y-full transition-all duration-200"
              style={{
                left: mousePosition.x,
                top: mousePosition.y - 10,
              }}
            >
              <div className="text-center">
                <div className="font-semibold">
                  {hoveredSegment === "male" ? "Эрэгтэй" : "Эмэгтэй"}
                </div>
                <div>
                  {hoveredSegment === "male"
                    ? `${data.male.count.toLocaleString()} хүн (${data.male.percentage}%)`
                    : `${data.female.count.toLocaleString()} хүн (${data.female.percentage}%)`}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full space-y-3 sm:space-y-4">
          <div className="space-y-2 group">
            <div className="flex justify-between items-center transition-all duration-200 group-hover:translate-x-1">
              <span
                className="text-[13px] sm:text-[14px] font-semibold text-[#1E293B] tracking-[0.28px]
                             transition-colors duration-200 leading-[1.3]"
              >
                Эрэгтэй
              </span>
              <div className="flex items-center gap-3 sm:gap-4">
                <span
                  className="text-[11px] sm:text-[12px] text-[#64748B] tracking-[0.18px]
                               transition-colors duration-200 leading-[1.3]"
                >
                  {data.male.count.toLocaleString()} хүн
                </span>
                <span
                  className="text-[11px] sm:text-[12px] text-[#64748B] tracking-[0.18px]
                               transition-colors duration-200 leading-[1.3]"
                >
                  {data.male.percentage}%
                </span>
              </div>
            </div>
            <div className="relative h-1.5 bg-[#E8EDF5] rounded-lg overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-[#4791FF] rounded-lg transition-all duration-1000 ease-out"
                style={{
                  width: "0%",
                  animation: `expandBarMale 1.2s ease-out 0.8s both`,
                }}
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <div className="flex justify-between items-center transition-all duration-200 group-hover:translate-x-1">
              <span
                className="text-[13px] sm:text-[14px] font-semibold text-[#1E293B] tracking-[0.28px]
                             transition-colors duration-200 leading-[1.3]"
              >
                Эмэгтэй
              </span>
              <div className="flex items-center gap-3 sm:gap-4">
                <span
                  className="text-[11px] sm:text-[12px] text-[#64748B] tracking-[0.18px]
                               transition-colors duration-200 leading-[1.3]"
                >
                  {data.female.count.toLocaleString()} хүн
                </span>
                <span
                  className="text-[11px] sm:text-[12px] text-[#64748B] tracking-[0.18px]
                               transition-colors duration-200 leading-[1.3]"
                >
                  {data.female.percentage}%
                </span>
              </div>
            </div>
            <div className="relative h-1.5 bg-[#E8EDF5] rounded-lg overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-[#FB7185] rounded-lg transition-all duration-1000 ease-out"
                style={{
                  width: "0%",
                  animation: `expandBarFemale 1.2s ease-out 1.0s both`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes drawPath {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes expandBarMale {
          from {
            width: 0%;
          }
          to {
            width: ${data.male.percentage}%;
          }
        }

        @keyframes expandBarFemale {
          from {
            width: 0%;
          }
          to {
            width: ${data.female.percentage}%;
          }
        }
      `}</style>
    </div>
  );
}
