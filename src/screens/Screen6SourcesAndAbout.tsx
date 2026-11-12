import React from 'react';
import {
  BookOpen,
  ExternalLink,
  ShieldCheck,
  User,
  GraduationCap,
  Building,
  Scale,
  FileCheck2,
  AlertCircle,
  Award
} from 'lucide-react';

export const Screen6SourcesAndAbout: React.FC = () => {
  // 8 Official Sources strictly as demanded
  const officialSources = [
    {
      id: 1,
      title: "Luật Di sản văn hoá số 45/2024/QH15",
      detail: "Chương IV về Di sản tư liệu (Điều 53-63); Chương V về Bảo tàng (Điều 64-77); Điều 85, 86, 88 về quản lý dữ liệu số hoá di sản văn hoá.",
      type: "Chính thống nhà nước",
      url: "https://vanban.chinhphu.vn"
    },
    {
      id: 2,
      title: "Thông tư số 05/2025/TT-BVHTTDL ngày 13/5/2025",
      detail: "Quy định của Bộ Văn hoá, Thể thao và Du lịch về kiểm kê, phiếu hiện vật, bảo quản và trưng bày bảo tàng (đặc biệt Điều 14 về trường thông tin phiếu kiểm kê số).",
      type: "Chính thống ngành",
      url: "https://bvhttdl.gov.vn"
    },
    {
      id: 3,
      title: "Nghị định số 308/2025/NĐ-CP & Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15",
      detail: "Quy định chi tiết thi hành Luật Bảo vệ dữ liệu cá nhân trong môi trường cơ sở dữ liệu số hoá và bảo mật thông tin cán bộ kiểm kê bảo tàng.",
      type: "Chính thống an toàn dữ liệu",
      url: "https://congbao.chinhphu.vn"
    },
    {
      id: 4,
      title: "Các Quyết định của Thủ tướng Chính phủ về công nhận Bảo vật quốc gia",
      detail: "Quyết định số 1426/QĐ-TTg (2012), 2599/QĐ-TTg (2013), 1821/QĐ-TTg (2015), 2283/QĐ-TTg (2016) đến Quyết định 236/QĐ-TTg đợt 14 năm 2026.",
      type: "Chính thống xếp hạng",
      url: "http://dsvh.gov.vn"
    },
    {
      id: 5,
      title: "Bảo tàng Lịch sử Quốc gia Việt Nam (VNMH)",
      detail: "Cơ sở dữ liệu Bảo vật quốc gia và Hiện vật tiêu biểu đã công bố chính thức; hồ sơ hiện vật số đăng ký LSb.",
      type: "Chính thống - Nơi lưu giữ",
      url: "https://baotanglichsu.vn"
    },
    {
      id: 6,
      title: "Dublin Core Metadata Element Set, Version 1.1 - ISO 15836",
      detail: "Chuẩn mô tả siêu dữ liệu thư mục và di sản quốc tế gồm 15 trường thông tin lõi (Title, Creator, Subject, Description, Publisher...).",
      type: "Chính thống quốc tế",
      url: "https://www.dublincore.org"
    },
    {
      id: 7,
      title: "Chương trình Ký ức Thế giới của UNESCO (Memory of the World)",
      detail: "Khung nguyên tắc và tiêu chí bảo tồn, số hoá di sản tư liệu của nhân loại trong môi trường số.",
      type: "Chính thống quốc tế",
      url: "https://www.unesco.org/en/memory-world"
    },
    {
      id: 8,
      title: "Sách chuyên khảo: Bảo vật Quốc gia lưu giữ tại Bảo tàng Lịch sử Quốc gia",
      detail: "Bảo tàng Lịch sử Quốc gia (2018), Bảo vật Quốc gia lưu giữ tại Bảo tàng Lịch sử Quốc gia, Nhà xuất bản Văn hoá Dân tộc, Hà Nội.",
      type: "Chính thống - Sách chuyên khảo",
      url: "https://baotanglichsu.vn"
    }
  ];

  const stepsChosen = [
    {
      step: 1,
      title: "Khảo sát và chuẩn hoá danh mục 15 Bảo vật quốc gia",
      desc: "Rà soát toàn bộ số đăng ký kiểm kê (LSb), quyết định công nhận của Thủ tướng Chính phủ, đối chiếu niên đại khảo cổ và xác thực tên gọi bảo tàng học."
    },
    {
      step: 2,
      title: "Thiết kế cấu trúc siêu dữ liệu 23 trường tích hợp",
      desc: "Ánh xạ 15 trường lõi chuẩn quốc tế Dublin Core (ISO 15836) kết hợp 8 trường bổ sung bắt buộc theo Điều 14 Thông tư 05/2025/TT-BVHTTDL."
    },
    {
      step: 3,
      title: "Xây dựng sơ đồ kỹ thuật vector & cơ chế bảo vệ quyền",
      desc: "Vẽ sơ đồ trắc diện kỹ thuật CAD/vector kích thước hiện vật (không dùng AI sinh ảnh giả), tự động khoá hình ảnh khi thiếu thẩm quyền công bố và xuất file mở JSON/CSV."
    },
    {
      step: 4,
      title: "Trợ lý kiểm kê AI & quy trình gán nhãn kiểm chứng Hán Nôm",
      desc: "Tích hợp Gemini API với prompt nghiêm ngặt bắt buộc căn cứ tulieu.json, tự động gán nhãn vàng cảnh báo cho các bản nháp phiên âm văn khắc Hán Nôm."
    }
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-serif">
          Nguồn Tư Liệu, Ghi Nhận Quyền & Giới Thiệu Đề Tài
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Đề tài F01 - Hệ thống Phiếu hiện vật số theo Thông tư 05/2025 • Bảo tàng Lịch sử Quốc gia
        </p>
      </div>

      {/* SECTION 1: 8 OFFICIAL SOURCES */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-800" />
          <h2 className="text-lg font-bold text-slate-900 font-serif">
            1. Danh Mục 8 Nguồn Tư Liệu Chính Thống (Kèm liên kết ngoài)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officialSources.map((source) => (
            <div
              key={source.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-600 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Nguồn {source.id}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {source.type}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 font-serif leading-snug">
                  {source.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {source.detail}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-950 transition-colors"
                >
                  <span>Mở tài liệu gốc ({new URL(source.url).hostname})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: GHI NHẬN QUYỀN SỞ HỮU & PHẠM VI CÔNG BỐ */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-950">
          <ShieldCheck className="w-6 h-6 text-amber-700" />
          <h2 className="text-lg font-bold font-serif">
            2. Ghi Nhận Quyền Sở Hữu & Phạm Vi Công Bố Học Thuật
          </h2>
        </div>

        <div className="text-xs text-amber-900/90 leading-relaxed space-y-2.5">
          <p>
            • <strong>Cơ sở pháp lý công bố:</strong> Toàn bộ 15 Bảo vật quốc gia thuộc sở hữu toàn dân do Nhà nước Cộng hoà Xã hội Chủ nghĩa Việt Nam đại diện quản lý, trực tiếp lưu giữ và bảo tồn tại <strong>Bảo tàng Lịch sử Quốc gia</strong> (phường Cửa Nam, thành phố Hà Nội).
          </p>
          <p>
            • <strong>Phạm vi sử dụng phi lợi nhuận:</strong> Căn cứ <strong>Điều 88 Luật Di sản văn hoá số 45/2024/QH15</strong>, dữ liệu số hoá hồ sơ kiểm kê được công bố nhằm phục vụ mục đích học tập, nghiên cứu khoa học, giáo dục truyền thống lịch sử văn hoá phi thương mại.
          </p>
          <p>
            • <strong>Bảo vệ dữ liệu cá nhân & an ninh kho:</strong> Tuân thủ nghiêm túc <strong>Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15</strong> và <strong>Nghị định số 308/2025/NĐ-CP</strong>, các thông tin bảo mật đặc biệt (như toạ độ két an ninh kho lưu trữ đặc biệt, công thức hoá chất dung môi bảo quản chuyên sâu) được mã hoá và ẩn danh, không công khai trên giao diện người dùng.
          </p>
        </div>
      </div>

      {/* SECTION 3: THÔNG TIN THỰC TẬP SINH & PHẠM VI ĐÃ CHỌN */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-teal-950">
          <GraduationCap className="w-6 h-6 text-teal-800" />
          <h2 className="text-lg font-bold font-serif">
            3. Thông Tin Thực Tập Sinh & Báo Cáo Thực Hiện Đề Tài
          </h2>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <p className="text-slate-500 font-semibold uppercase text-[11px]">Họ và tên thực tập sinh:</p>
            <p className="text-base font-extrabold text-slate-900 font-serif">VƯƠNG BÁ NGUYÊN</p>
            <p className="text-slate-600">
              Mã sinh viên: <strong className="text-teal-900 font-mono">PH59253</strong> • Nhóm: <strong>Nhóm 1</strong>
            </p>
          </div>

          <div className="space-y-1 md:text-right border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
            <p className="text-slate-500 font-semibold uppercase text-[11px]">Chương trình thực tập:</p>
            <p className="font-bold text-slate-800">Chương trình Thực tập sinh Đợt 15</p>
            <p className="text-slate-600 font-medium">FPT Polytechnic & IMTA TECH (Dự án xã hội phi lợi nhuận)</p>
          </div>
        </div>

        {/* 4 Chosen Steps */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Phạm vi 4 bước đã lựa chọn thực hiện trong đề tài:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stepsChosen.map((item) => (
              <div key={item.step} className="bg-teal-50/50 p-4 rounded-xl border border-teal-200/80 space-y-1 text-xs">
                <div className="flex items-center gap-2 font-bold text-teal-950">
                  <span className="w-5 h-5 rounded-full bg-teal-800 text-white flex items-center justify-center text-[11px] font-mono">
                    {item.step}
                  </span>
                  <span>{item.title}</span>
                </div>
                <p className="text-slate-600 pl-7 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Những nội dung chưa làm được - Phải nêu rõ lý do bảo vệ bảo vật */}
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center gap-2 text-rose-900 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-700" />
            <span>Nội dung chưa làm được và nguyên nhân khách quan:</span>
          </div>
          <p className="text-rose-950/90 leading-relaxed font-serif text-[13px] bg-white/70 p-4 rounded-lg border border-rose-200 italic">
            "Do quy định bảo vệ nghiêm ngặt đối với Bảo vật quốc gia trong kho lưu trữ đặc biệt của Bảo tàng Lịch sử Quốc gia, thực tập sinh không được phép trực tiếp cầm, lật hiện vật gốc hay tự mang thiết bị vào chụp mới trong kho bảo quản, nên sử dụng hồ sơ kiểm kê và bản sao số đã công bố chính thức của Bảo tàng Lịch sử Quốc gia và Cục Di sản văn hoá."
          </p>
        </div>
      </div>
    </div>
  );
};
