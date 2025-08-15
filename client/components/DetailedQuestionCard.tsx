import { SurveyQuestion } from "@shared/survey";
import { FileText, Users, TrendingUp } from "lucide-react";

interface DetailedCategory {
  name: string;
  percentage: number;
  votes: number;
  color: string;
  details: string[];
}

interface DetailedQuestionCardProps {
  question?: SurveyQuestion;
}

export function DetailedQuestionCard({ question }: DetailedQuestionCardProps) {
  if (!question || question.id !== 1) {
    return null;
  }

  // Detailed descriptions for Question 1
  const detailedCategories: DetailedCategory[] = [
    {
      name: "Эрүүл мэнд",
      percentage: 18,
      votes: Math.round(27105 * 0.18),
      color: "#0066FF",
      details: [
        "Эрүүл мэндийн үйлчилгээний хүртээмж, чанарыг сайжруулах",
        "Эмч, сувилагчдын цалин, нөхцөлийг нэмэгдүүлэх",
        "Эрүүл орчин, цэвэр ус, агаарын чанарыг сайжруулах",
        "Сэтгэцийн эрүүл мэндийн тусламжийг өргөжүүлэх"
      ]
    },
    {
      name: "Цалин, нийгмийн хамгаалал",
      percentage: 13,
      votes: Math.round(27105 * 0.13),
      color: "#E11D48",
      details: [
        "Төрийн албан хаагчдын цалинг нэмэгдүүлэх",
        "Нийгмийн халамж, тэтгэмжийн хүртээмжийг нэмэгдүүлэх",
        "Ээж, хүүхдийн дэмжлэгийг өргөжүүлэх",
        "Хөгжлийн бэрхшээлтэй иргэдийг дэмжих"
      ]
    },
    {
      name: "Боловсрол",
      percentage: 13,
      votes: Math.round(27105 * 0.13),
      color: "#22C55E",
      details: [
        "Ясли, цэцэрлэгийн тоог нэмэгдүүлэх",
        "Багш нарын цалин, ур чадварыг сайжруулах",
        "Хөдөө орон нутгийн сургалтын чанарыг дээшлүүлэх",
        "Хөтөлбөр, сургалтын орчныг шинэчлэх"
      ]
    },
    {
      name: "Аюулгүй байдал, хууль сахиулах",
      percentage: 11,
      votes: Math.round(27105 * 0.11),
      color: "#F97316",
      details: [
        "Цагдаагийн байгууллагын орон тоо, нөхцөлийг сайжруулах",
        "Замын хөдөлгөөний аюулгүй байдлыг хангах",
        "Гэмт хэрэг, хүчирхийлэлтэй тэмцэх",
        "Иргэдийн аюулгүй байдлыг нэмэгдүүлэх"
      ]
    },
    {
      name: "Хөдөө аж ахуй, байгаль орчин",
      percentage: 10,
      votes: Math.round(27105 * 0.10),
      color: "#A855F7",
      details: [
        "Ус, бэлчээрийн менежмент сайжруулах",
        "Хөдөө аж ахуйн үйлдвэрлэлийг нэмэгдүүлэх",
        "Байгаль хамгааллыг чангатгах",
        "Хог, бохирдлыг бууруулах"
      ]
    },
    {
      name: "Эдийн засаг, ажлын байр",
      percentage: 9,
      votes: Math.round(27105 * 0.09),
      color: "#EC4899",
      details: [
        "Ажлын байрыг нэмэгдүүлэх",
        "Татварын дарамтыг бууруулах",
        "Жижиг, дунд үйлдвэрлэлийг дэмжих",
        "Үр ашиггүй зардлыг танах"
      ]
    },
    {
      name: "Дэд бүтэц, зам",
      percentage: 8,
      votes: Math.round(27105 * 0.08),
      color: "#4D7C0F",
      details: [
        "Хот хоорондын болон доторх замын чанарыг сайжруулах",
        "Явган болон дугуйн зам нэмэх",
        "Гэрэлтүүлэг, нийтийн тээврийн хүртээмжийг сайжруулах",
        "Хот төлөвлөлтийг сайжруулах"
      ]
    },
    {
      name: "Эрчим хүч",
      percentage: 8,
      votes: Math.round(27105 * 0.08),
      color: "#0D9488",
      details: [
        "Шинэ цахилгаан станц барих",
        "Эрчим хүчний хараат байдлыг бууруулах",
        "Эрчим хүчний үнэ тогтвортой байлгах",
        "Эрчим хүчний дэд бүтцийг шинэ��лэх"
      ]
    },
    {
      name: "Соёл, спорт, аялал жуулчлал",
      percentage: 2,
      votes: Math.round(27105 * 0.02),
      color: "#0EA5E9",
      details: [
        "Спортын дэд бүтцийг сайжруулах",
        "Аялал жуулчлалыг хөгжүүлэх",
        "Үндэсний соёлыг хамгаалах",
        "Соёлын боловсролыг нэмэгдүүлэх"
      ]
    },
    {
      name: "Орон нутагт хөрөнгө оруулах",
      percentage: 1,
      votes: Math.round(27105 * 0.01),
      color: "#6366F1",
      details: [
        "Орон нутгийн дэд бүтцийг сайжруулах",
        "Нутгийн хөгжилд чиглэсэн төсөл хэрэгжүүлэх",
        "Хөдөө орон нутгийн ажил эрхлэлтийг нэмэгдүүлэх"
      ]
    }
  ];

  return (
    <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)]
                    transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,102,255,0.12)]
                    min-h-[300px] flex flex-col border border-gray-100/50">
      
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs sm:text-sm text-blue-600 font-medium tracking-wide uppercase">
              Асуулт 1
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
            <Users className="w-3 h-3" />
            <span>27,105</span>
          </div>
        </div>
        
        <h3 className="text-[16px] sm:text-[18px] lg:text-[19px] font-bold text-[#1E293B] 
                       tracking-[0.36px] transition-colors duration-200 leading-[1.3] mb-2">
          Хөрөнгө оруулалт нэмэгдүүлэх салбар
        </h3>
        
        <p className="text-[12px] sm:text-[13px] text-[#64748B] font-medium">
          Тайлбар бичсэн: 27,105 хүн
        </p>
      </div>

      {/* Categories with detailed descriptions */}
      <div className="space-y-4 flex-1">
        {detailedCategories.map((category, index) => (
          <div
            key={category.name}
            className="border border-gray-100/80 rounded-lg p-3 sm:p-4 hover:border-gray-200/80 transition-colors duration-200
                       bg-gradient-to-r from-gray-50/30 to-white"
          >
            {/* Category header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-[14px] sm:text-[15px] font-bold text-[#1E293B]">
                  {category.name}
                </span>
              </div>
              
              <div className="text-right">
                <div className="text-[13px] sm:text-[14px] font-bold text-[#1E293B]">
                  ≈{category.percentage}%
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#64748B]">
                  {category.votes.toLocaleString()} санал
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-1.5 bg-gray-200/60 rounded-full overflow-hidden mb-3">
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${category.percentage}%`,
                  backgroundColor: category.color,
                  boxShadow: `0 0 6px ${category.color}40`,
                }}
              />
            </div>

            {/* Detailed descriptions */}
            <div className="space-y-1.5">
              {category.details.map((detail, detailIndex) => (
                <div key={detailIndex} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                  <span className="text-[11px] sm:text-[12px] text-[#475569] leading-relaxed">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200/50">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Нийт тайлбар</span>
          <span className="font-semibold text-gray-700">
            27,105 санал
          </span>
        </div>
      </div>
    </div>
  );
}
