import { useState } from "react";
import { X, FileText } from "lucide-react";
import { SurveyQuestion } from "@shared/survey";

interface QuestionDetailData {
  [key: number]: {
    title: string;
    description: string;
    totalResponses: number;
    categories: {
      name: string;
      percentage: number;
      details: string[];
    }[];
  };
}

interface QuestionDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  question: SurveyQuestion | null;
}

export function QuestionDetailPopup({ isOpen, onClose, question }: QuestionDetailPopupProps) {
  if (!isOpen || !question) return null;

  // Detailed data for each question (using Excel data)
  const questionDetails: QuestionDetailData = {
    1: {
      title: "Монгол улсын 2026 оны төсвийн ямар салбарт илүү их хөрөнгө оруулалт хийх ёстой вэ?",
      description: "Тайлбар бичсэн: 38,514",
      totalResponses: 38514,
      categories: [
        {
          name: "Эрүүл мэнд (≈18%)",
          percentage: 18,
          details: [
            "Эрүүл мэндийн үйлчилгээний хүртээмж, чанарыг сайжруулах",
            "Эмч, сувилагчдын цалин, нөхцөлийг нэмэгдүүлэх",
            "Эрүүл орчин, цэвэр ус, агаарын чанарыг сайжруулах",
            "Сэтгэцийн эрүүл мэндийн тусламжийг өргөжүүлэх"
          ]
        },
        {
          name: "Цалин, нийгмийн хамгаалал (≈13%)",
          percentage: 13,
          details: [
            "Төрийн албан хаагчдын цалинг нэмэгдүүлэх",
            "Нийгмийн халамж, тэтгэмжийн хүртээмжийг нэмэгдүүлэх",
            "Ээж, хүүхдийн дэмжлэгийг өргөжүүлэх",
            "Хөгжлийн бэрхшээлтэй иргэдийг дэмжих"
          ]
        },
        {
          name: "Боловсрол (≈13%)",
          percentage: 13,
          details: [
            "Ясли, цэцэрлэгийн ��оог нэмэгдүүлэх",
            "Багш нарын цалин, ур чадварыг сайжруулах",
            "Хөдөө орон нутгийн сургалтын чанарыг дээшлүүлэх",
            "Хөтөлбөр, сургалтын орчныг шинэчлэх"
          ]
        },
        {
          name: "Аюулгүй байдал, хууль сахиулах (≈11%)",
          percentage: 11,
          details: [
            "Цагдаагийн байгууллагын орон тоо, нөхцөлийг сайжруулах",
            "Замын хөдөлгөөний аюулгүй байдлыг хангах",
            "Гэмт хэрэг, хүчирхийлэлтэй тэмцэх",
            "Иргэдийн аюулгүй байдлыг нэмэгдүүлэх"
          ]
        },
        {
          name: "Хөдөө аж ахуй, байгаль орчин (≈10%)",
          percentage: 10,
          details: [
            "Ус, бэлчээрийн менежмент сайжруулах",
            "Хөдөө аж ахуйн үйлдвэрлэлийг нэмэгдүүлэх",
            "Байгаль хамгааллыг чангатгах",
            "Хог, бохирдлыг буу��уулах"
          ]
        },
        {
          name: "Эдийн засаг, ажлын байр (≈9%)",
          percentage: 9,
          details: [
            "Ажлын байрыг нэмэгдүүлэх",
            "Татварын дарамтыг бууруулах",
            "Жижиг, дунд үйлдвэрлэлийг дэмжих",
            "Үр ашиггүй зардлыг танах"
          ]
        },
        {
          name: "Дэд бүтэц, зам (≈8%)",
          percentage: 8,
          details: [
            "Хот хоорондын болон доторх замын чанарыг сайжруулах",
            "Явган болон дугуйн зам нэмэх",
            "Гэрэлтүүлэг, нийтийн тээврийн хүртээмжийг сайжруулах",
            "Хот төлөвлөлтийг сайжруулах"
          ]
        },
        {
          name: "Эрчим хүч (≈8%)",
          percentage: 8,
          details: [
            "Шинэ цахилгаан станц барих",
            "Эрчим хүчний хараат байдлыг бууруулах",
            "Эрчим хүчний үнэ тогтвортой байлгах",
            "Эрчим хүчний дэд бүтцийг шинэчлэх"
          ]
        },
        {
          name: "Соёл, спорт, аялал жуулчлал (≈2%)",
          percentage: 2,
          details: [
            "Спортын дэд бүтцийг сайжруулах",
            "Аялал жуулчлалыг хөгжүүлэх",
            "Үндэсний соёлыг хамгаалах",
            "Соёлын боловсролыг нэмэгдүүлэх"
          ]
        },
        {
          name: "Орон нутагт хөрөнгө оруулах (≈1%)",
          percentage: 1,
          details: [
            "Орон нутгийн дэд бүтцийг сайжруулах",
            "Нутгийн хөгжилд чиглэсэн төсөл хэрэгжүүлэх",
            "Хөдөө орон нутгийн ажил эрхлэлтийг нэмэгдүүлэх"
          ]
        }
      ]
    },
    2: {
      title: "Хөрөнгө оруулалт хасах салба",
      description: "Тайлбар бичсэн: 17,846",
      totalResponses: 17846,
      categories: [
        {
          name: "Эдийн засаг, үр ашиггүй зардал (≈19%)",
          percentage: 19,
          details: [
            "Үр ашиггүй хөрөнгө оруулалтыг зогсоох",
            "Төсвийн үр ашгийг нэмэгдүүлэх",
            "Зардлын ил тод байдлыг хангах"
          ]
        },
        {
          name: "Татвар, санхүүгийн бодлого (≈15%)",
          percentage: 15,
          details: [
            "Татварын орлогын зарцуулалтыг хянах",
            "Татварын системийг шударга болгох",
            "Татварын дарамтыг бууруулах"
          ]
        },
        {
          name: "Төрийн алба, зардлын хэмнэлт (≈14%)",
          percentage: 14,
          details: [
            "Төрийн албан хаагчдын тоог хязгаарлах",
            "Албан томилолт, тансаг хэрэглээг багасгах",
            "Захиргааны үйл ажиллагааны зардлыг танах"
          ]
        },
        {
          name: "Эрүүл мэнд (≈12%)",
          percentage: 12,
          details: [
            "Эрүүл мэндийн төсвийг оновчтой болгох",
            "Ашиггүй эмнэлгийн төслүүдийг хасах",
            "Үйлчилгээний чанарыг сайжруулах"
          ]
        },
        {
          name: "Хууль сахиулах, хяналт (≈10%)",
          percentage: 10,
          details: [
            "Авлига, хээл хахуулийн эсрэг арга хэмжээ",
            "Хууль хэрэгжилтийг чангатгах"
          ]
        }
      ]
    }
    // Add more questions here...
  };

  const currentDetail = questionDetails[question.id];
  if (!currentDetail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Асуулт {question.id}: {currentDetail.title}
              </h2>
              <p className="text-sm text-gray-600">
                {currentDetail.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {currentDetail.categories.map((category, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {category.name}
                </h3>
                <div className="space-y-2">
                  {category.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
