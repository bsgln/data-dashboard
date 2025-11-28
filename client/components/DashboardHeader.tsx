import { Clock } from "lucide-react";

interface DashboardHeaderProps {
  lastUpdated: string;
  isLive: boolean;
}

export function DashboardHeader({ lastUpdated, isLive }: DashboardHeaderProps) {
  return (
    <div
      className="flex flex-col lg:flex-row justify-between items-start lg:items-center
                    gap-3 sm:gap-4 lg:gap-0 mb-4 sm:mb-6 lg:mb-8 px-1 sm:px-0 animate-in slide-in-from-top-4 fade-in"
      style={{ animationDuration: "600ms" }}
    >
      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 lg:gap-4 w-full lg:w-auto">
        <div
          className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 animate-in slide-in-from-left-2 fade-in flex-shrink-0"
          style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
        >
          <img
            src="https://i.ibb.co/6jTscHZ/logo.png"
            alt="Government Logo"
            className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] lg:w-[52px] lg:h-[52px] rounded-lg object-cover transition-transform duration-300 hover:scale-110"
          />
          <img
            src="https://i.ibb.co/JRGKLCy4/Logo2.png"
            alt="Secondary Logo"
            className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] lg:w-[52px] lg:h-[52px] rounded-lg object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
        <div
          className="flex flex-col gap-0.5 sm:gap-1 lg:gap-2 animate-in slide-in-from-left-4 fade-in min-w-0 flex-1"
          style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
        >
          <h1
            className="text-[18px] sm:text-[22px] lg:text-[24px] font-bold text-[#1E293B] leading-[1.15] sm:leading-[1.2]
                         tracking-[0.36px] sm:tracking-[0.44px] lg:tracking-[0.48px] transition-colors duration-200 break-words"
            lang="mn"
          >
            Санал асуулгын үр дүн
          </h1>
          <p
            className="text-[12px] sm:text-[14px] lg:text-[16px] text-[#1E293B] tracking-[0.18px] sm:tracking-[0.21px] lg:tracking-[0.24px]
                        transition-colors duration-200 leading-[1.3] sm:leading-[1.35] lg:leading-[1.4] break-words opacity-90"
            lang="mn"
          >
            2026 оны төсвийн чиглэлийн талаарх иргэдийн санал
          </p>
        </div>
      </div>

      <div
        className="flex items-center justify-start lg:justify-end gap-3 sm:gap-4 animate-in slide-in-from-right-2 fade-in w-full lg:w-auto mt-2 sm:mt-3 lg:mt-0"
        style={{ animationDelay: "400ms", animationFillMode: "backwards" }}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 group">
          <Clock
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-[#64748B] transition-all duration-200
                           group-hover:text-[#0066FF] group-hover:scale-110 flex-shrink-0"
          />
          <span
            className="text-[11px] sm:text-[12px] lg:text-[14px] text-[#64748B] tracking-[0.22px] sm:tracking-[0.24px] lg:tracking-[0.28px]
                           transition-colors duration-200 group-hover:text-[#0066FF] leading-[1.25] sm:leading-[1.3] font-medium"
          >
            Сүүлд шинэчлэгдсэн: {lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
}
