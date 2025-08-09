import { Skeleton } from "@/components/ui/skeleton";

export function MetricsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)]"
        >
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GenderChartSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)]">
      <div className="mb-6">
        <Skeleton className="h-5 w-32 mb-1" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="flex flex-col items-center gap-8">
        <Skeleton className="w-[166px] h-[166px] rounded-full" />

        <div className="w-full space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-16" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
            <Skeleton className="h-1.5 w-full rounded-lg" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-16" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
            <Skeleton className="h-1.5 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgeGroupChartSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)]">
      <div className="mb-6">
        <Skeleton className="h-5 w-32 mb-1" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
            <Skeleton className="h-1.5 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BudgetPriorityTableSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)]">
      <div className="mb-6">
        <Skeleton className="h-5 w-40 mb-1" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SurveyQuestionSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)]">
      <div className="mb-5">
        <div className="flex items-center gap-4 mb-3">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-3/4" />
      </div>

      <div className="space-y-3 mb-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-start gap-2.5 flex-1">
                <Skeleton className="w-2 h-2 rounded-full mt-1.5" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-6 w-12 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-2 w-full rounded-lg" />
          </div>
        ))}
      </div>

      <div className="border-t border-[#E6EBF3] pt-4">
        <div className="flex justify-center">
          <Skeleton className="h-10 w-64 rounded-full" />
        </div>
      </div>
    </div>
  );
}
