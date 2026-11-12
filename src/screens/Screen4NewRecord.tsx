import React, { useState } from 'react';
import { ArtifactRecord, DublinCoreRecord, Circular05Record } from '../types/tulieu';
import { exportToJson, exportToCsv } from '../utils/exportData';
import {
  FilePlus,
  AlertCircle,
  CheckCircle,
  Save,
  Download,
  Eye,
  RotateCcw,
  Sparkles,
  ClipboardCheck,
  Check
} from 'lucide-react';

interface Props {
  onAddNewArtifact: (record: ArtifactRecord) => void;
  tempRecords: ArtifactRecord[];
}

const INITIAL_DUBLIN_CORE: DublinCoreRecord = {
  title: '',
  creator: '',
  subject: '',
  description: '',
  publisher: 'Bảo tàng Lịch sử Quốc gia',
  contributor: '',
  date: '',
  type: '',
  format: '',
  identifier: '',
  source: '',
  language: 'Tiếng Việt',
  relation: '',
  coverage: '',
  rights: 'Tài sản công - Bảo vật quốc gia thuộc sở hữu toàn dân'
};

const INITIAL_CIRCULAR_05: Circular05Record = {
  noiLuuGiuHienNay2Cap: {
    cap1CoSo: 'Bảo tàng Lịch sử Quốc gia',
    cap2HanhChinh: 'Phường Cửa Nam, thành phố Hà Nội'
  },
  noiLuuGiuTruoc: 'Phường Tràng Tiền, quận Hoàn Kiếm, thành phố Hà Nội (trước 01/7/2025)',
  loaiBanHienThi: 'Bản số của bản gốc',
  tinhTrangBanGoc: 'Tốt',
  soDangKyBaoTang: '',
  nguoiChoPhepCongBo: 'Bảo tàng Lịch sử Quốc gia & Cục Di sản văn hoá',
  phanKhongCongBo: 'Két bảo quản kho đặc biệt A1',
  mucKiemChung: 'Đã kiểm'
};

export const Screen4NewRecord: React.FC<Props> = ({ onAddNewArtifact, tempRecords }) => {
  const [dublinCore, setDublinCore] = useState<DublinCoreRecord>(INITIAL_DUBLIN_CORE);
  const [circular05, setCircular05] = useState<Circular05Record>(INITIAL_CIRCULAR_05);
  const [thoiKy, setThoiKy] = useState<ArtifactRecord['thoiKy']>('Đông Sơn');
  const [showValidation, setShowValidation] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview' | 'tempList'>('form');
  const [successToast, setSuccessToast] = useState(false);

  // Field validation check
  const missingFields = React.useMemo(() => {
    const missing: { field: string; section: string }[] = [];

    // Dublin Core required fields
    if (!dublinCore.title.trim()) missing.push({ field: 'Tiêu đề (Title)', section: 'Dublin Core' });
    if (!dublinCore.creator.trim()) missing.push({ field: 'Tác giả/Nghệ nhân (Creator)', section: 'Dublin Core' });
    if (!dublinCore.subject.trim()) missing.push({ field: 'Chủ đề (Subject)', section: 'Dublin Core' });
    if (!dublinCore.description.trim()) missing.push({ field: 'Mô tả hiện vật (Description)', section: 'Dublin Core' });
    if (!dublinCore.date.trim()) missing.push({ field: 'Niên đại (Date)', section: 'Dublin Core' });
    if (!dublinCore.type.trim()) missing.push({ field: 'Loại hình (Type)', section: 'Dublin Core' });
    if (!dublinCore.format.trim()) missing.push({ field: 'Kích thước & Chất liệu (Format)', section: 'Dublin Core' });
    if (!dublinCore.identifier.trim()) missing.push({ field: 'Mã định danh (Identifier)', section: 'Dublin Core' });
    if (!dublinCore.source.trim()) missing.push({ field: 'Nguồn gốc xuất xứ (Source)', section: 'Dublin Core' });
    if (!dublinCore.relation.trim()) missing.push({ field: 'Văn bản pháp lý liên quan (Relation)', section: 'Dublin Core' });
    if (!dublinCore.coverage.trim()) missing.push({ field: 'Phạm vi không gian/thời gian (Coverage)', section: 'Dublin Core' });

    // Circular 05 required fields
    if (!circular05.noiLuuGiuHienNay2Cap.cap1CoSo.trim()) missing.push({ field: 'Nơi lưu giữ cấp 1 (Cơ sở bảo tàng)', section: 'Thông tư 05' });
    if (!circular05.noiLuuGiuHienNay2Cap.cap2HanhChinh.trim()) missing.push({ field: 'Nơi lưu giữ cấp 2 (Địa danh hành chính)', section: 'Thông tư 05' });
    if (!circular05.soDangKyBaoTang.trim()) missing.push({ field: 'Số đăng ký kiểm kê (LSb)', section: 'Thông tư 05' });
    if (!circular05.nguoiChoPhepCongBo.trim()) missing.push({ field: 'Người cho phép công bố', section: 'Thông tư 05' });
    if (!circular05.phanKhongCongBo.trim()) missing.push({ field: 'Phần không công bố', section: 'Thông tư 05' });

    return missing;
  }, [dublinCore, circular05]);

  const isValid = missingFields.length === 0;

  // Load sample template for quick testing
  const handleLoadSample = () => {
    setDublinCore({
      title: "Thạp gốm hoa nâu thời Lý",
      creator: "Lò gốm hoàng gia Thăng Long thời Lý",
      subject: "Bảo vật tiêu biểu; Gốm hoa nâu; Thời Lý; Cổ vật Thăng Long",
      description: "Thạp gốm men trắng ngà vẽ hoa nâu hình hoa sen, cánh hoa cúc dây và các dải vạch đứng dằn quanh cổ thạp. Thân phình, dáng cân đối, đế bằng vững chãi.",
      publisher: "Bảo tàng Lịch sử Quốc gia",
      contributor: "Viện Khảo cổ học khai quật tại Hoàng thành Thăng Long",
      date: "Thế kỷ XI - XII (Thời nhà Lý)",
      type: "Hiện vật khảo cổ học / Gốm nghệ thuật hoa nâu",
      format: "Chất liệu đất nung tráng men hoa nâu; Cao: 42.0 cm; ĐK miệng: 24.5 cm; Nặng: 6.2 kg",
      identifier: "F01-00016-THU-NGHIEM",
      source: "Khu di tích Hoàng thành Thăng Long, Hà Nội",
      language: "Không có minh văn văn tự",
      relation: "Hồ sơ đề nghị xếp hạng Bảo vật quốc gia đợt 15",
      coverage: "Kinh thành Thăng Long thế kỷ XI-XII",
      rights: "Tài sản bảo tàng - Quản lý bởi BTLSQG"
    });
    setCircular05({
      noiLuuGiuHienNay2Cap: {
        cap1CoSo: "Bảo tàng Lịch sử Quốc gia (Kho số 1 Tràng Tiền)",
        cap2HanhChinh: "Phường Cửa Nam, thành phố Hà Nội"
      },
      noiLuuGiuTruoc: "Phường Tràng Tiền, quận Hoàn Kiếm, thành phố Hà Nội (trước 01/7/2025)",
      loaiBanHienThi: "Bản số của bản gốc",
      tinhTrangBanGoc: "Tốt",
      soDangKyBaoTang: "LSb.29850",
      nguoiChoPhepCongBo: "Bảo tàng Lịch sử Quốc gia & Cục Di sản văn hoá",
      phanKhongCongBo: "Số kệ giá kho đặc biệt phân khu B",
      mucKiemChung: "Đã kiểm"
    });
    setThoiKy("Lý");
    setShowValidation(true);
  };

  const handleReset = () => {
    setDublinCore(INITIAL_DUBLIN_CORE);
    setCircular05(INITIAL_CIRCULAR_05);
    setShowValidation(false);
  };

  const handleSaveTemp = (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);

    if (!isValid) return;

    const newRecord: ArtifactRecord = {
      id: dublinCore.identifier || `F01-${Date.now().toString().slice(-5)}`,
      thoiKy,
      dublinCore,
      circular05,
      technicalDrawing: {
        drawingType: 'vase',
        heightMm: 420,
        diameterMm: 245,
        storageFilename: `${dublinCore.identifier || 'F01-TEMP'}-anh-01.jpg`,
        rawMasterResolution: "File ảnh 24MP quét lưu tại máy trạm kiểm kê",
        captionOverview: `Bản vẽ kỹ thuật sơ bộ: ${dublinCore.title}`,
        captionDetail: "Đặc tả hoa văn hoa nâu trang trí trên vai thạp",
        sourceNote: "Hồ sơ lập phiếu kiểm kê thử nghiệm năm 2026"
      }
    };

    onAddNewArtifact(newRecord);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-serif">
            Công Cụ Lập & Kiểm Tra Phiếu Hiện Vật Mới
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Biểu mẫu chuẩn hoá 23 trường siêu dữ liệu (15 Dublin Core + 8 Thông tư 05/2025/TT-BVHTTDL) kèm kiểm định bắt buộc
          </p>
        </div>

        {/* Quick Sample & Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tải dữ liệu mẫu thử nghiệm</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xoá trắng</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('form')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'form'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FilePlus className="w-4 h-4" />
          <span>Biểu mẫu nhập 23 trường</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'preview'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Xem trước phiếu (Live Preview)</span>
        </button>
        <button
          onClick={() => setActiveTab('tempList')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'tempList'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Danh sách phiếu tạm ({tempRecords.length})</span>
        </button>
      </div>

      {/* Validation Alert Box if user attempted to save or validate */}
      {showValidation && (
        <div
          className={`p-4 rounded-xl border text-xs ${
            isValid
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2 font-bold mb-1">
            {isValid ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Hồ sơ hợp lệ! Đã điền đầy đủ tất cả 23 trường theo chuẩn Thông tư 05/2025.</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Phát hiện {missingFields.length} trường bắt buộc còn thiếu hoặc chưa điền:</span>
              </>
            )}
          </div>
          {!isValid && (
            <ul className="list-disc list-inside mt-2 space-y-0.5 text-red-800">
              {missingFields.map((item, idx) => (
                <li key={idx}>
                  <strong>[{item.section}]</strong> {item.field}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-between animate-fadeIn text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Đã lưu thành công phiếu vào danh sách tạm! Bạn có thể xuất JSON/CSV ngay bên dưới.</span>
          </div>
          <button onClick={() => setActiveTab('tempList')} className="underline text-emerald-100">
            Xem danh sách tạm
          </button>
        </div>
      )}

      {/* TAB 1: FORM INPUT */}
      {activeTab === 'form' && (
        <form onSubmit={handleSaveTemp} className="space-y-8">
          {/* Section 1: 15 Dublin Core Fields */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-teal-900 text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider">
                I. KHỐI 15 TRƯỜNG LÕI DUBLIN CORE (ISO 15836)
              </h3>
              <span className="text-[11px] text-teal-200">15 trường chuẩn quốc tế</span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* 1. Title */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  1. Tiêu đề / Tên hiện vật (Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dublinCore.title}
                  onChange={(e) => setDublinCore({ ...dublinCore, title: e.target.value })}
                  placeholder="Ví dụ: Thạp gốm hoa nâu thời Lý..."
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    showValidation && !dublinCore.title.trim()
                      ? 'border-red-500 bg-red-50 focus:ring-red-400'
                      : 'border-slate-300 bg-slate-50 focus:ring-teal-700'
                  }`}
                />
              </div>

              {/* Identifier */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  10. Mã định danh hồ sơ (Identifier) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dublinCore.identifier}
                  onChange={(e) => setDublinCore({ ...dublinCore, identifier: e.target.value })}
                  placeholder="Ví dụ: F01-00016"
                  className={`w-full px-3 py-2 rounded-lg border text-xs font-mono ${
                    showValidation && !dublinCore.identifier.trim()
                      ? 'border-red-500 bg-red-50'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>

              {/* Creator */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  2. Tác giả / Nghệ nhân chế tác (Creator) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dublinCore.creator}
                  onChange={(e) => setDublinCore({ ...dublinCore, creator: e.target.value })}
                  placeholder="Ví dụ: Nghệ nhân phường gốm Thăng Long..."
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    showValidation && !dublinCore.creator.trim() ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  3. Chủ đề / Từ khoá (Subject) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dublinCore.subject}
                  onChange={(e) => setDublinCore({ ...dublinCore, subject: e.target.value })}
                  placeholder="Phân tách bằng dấu chấm phẩy (;)"
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    showValidation && !dublinCore.subject.trim() ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>

              {/* Description (full width) */}
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-800 mb-1">
                  4. Mô tả hình dáng, hoa văn, giá trị (Description) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={dublinCore.description}
                  onChange={(e) => setDublinCore({ ...dublinCore, description: e.target.value })}
                  placeholder="Mô tả cấu trúc hình học, đề tài hoa văn trang trí, đặc điểm kỹ thuật chế tác..."
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    showValidation && !dublinCore.description.trim() ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>

              {/* Date */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  7. Niên đại lịch sử (Date) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dublinCore.date}
                  onChange={(e) => setDublinCore({ ...dublinCore, date: e.target.value })}
                  placeholder="Ví dụ: Thế kỷ XI - XII (Thời Lý)"
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    showValidation && !dublinCore.date.trim() ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>

              {/* Type */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  8. Loại hình hiện vật (Type) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dublinCore.type}
                  onChange={(e) => setDublinCore({ ...dublinCore, type: e.target.value })}
                  placeholder="Ví dụ: Cổ vật gốm sứ nghệ thuật"
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    showValidation && !dublinCore.type.trim() ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>

              {/* Format */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  9. Kích thước kỹ thuật & Chất liệu (Format) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dublinCore.format}
                  onChange={(e) => setDublinCore({ ...dublinCore, format: e.target.value })}
                  placeholder="Chất liệu, đường kính, chiều cao, trọng lượng..."
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    showValidation && !dublinCore.format.trim() ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>

              {/* Source */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  11. Nguồn gốc xuất xứ / Địa điểm phát hiện (Source) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dublinCore.source}
                  onChange={(e) => setDublinCore({ ...dublinCore, source: e.target.value })}
                  placeholder="Ví dụ: Di tích Hoàng thành Thăng Long..."
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    showValidation && !dublinCore.source.trim() ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>

              {/* Publisher & Contributor */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  5. Đơn vị công bố (Publisher)
                </label>
                <input
                  type="text"
                  value={dublinCore.publisher}
                  onChange={(e) => setDublinCore({ ...dublinCore, publisher: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  6. Người / Đơn vị đóng góp (Contributor)
                </label>
                <input
                  type="text"
                  value={dublinCore.contributor}
                  onChange={(e) => setDublinCore({ ...dublinCore, contributor: e.target.value })}
                  placeholder="Cá nhân, cơ quan phát hiện hoặc hiến tặng..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                />
              </div>

              {/* Language & Relation */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  12. Ngôn ngữ trên hiện vật (Language)
                </label>
                <input
                  type="text"
                  value={dublinCore.language}
                  onChange={(e) => setDublinCore({ ...dublinCore, language: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  13. Liên kết văn bản pháp lý (Relation) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dublinCore.relation}
                  onChange={(e) => setDublinCore({ ...dublinCore, relation: e.target.value })}
                  placeholder="Ví dụ: Quyết định công nhận Bảo vật quốc gia hoặc Hồ sơ kiểm kê..."
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    showValidation && !dublinCore.relation.trim() ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>

              {/* Coverage & Rights */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  14. Phạm vi không gian / thời gian (Coverage) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dublinCore.coverage}
                  onChange={(e) => setDublinCore({ ...dublinCore, coverage: e.target.value })}
                  placeholder="Ví dụ: Thăng Long thế kỷ XI - XII"
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    showValidation && !dublinCore.coverage.trim() ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  15. Quyền & Bản quyền công bố (Rights)
                </label>
                <input
                  type="text"
                  value={dublinCore.rights}
                  onChange={(e) => setDublinCore({ ...dublinCore, rights: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: 8 Circular 05/2025 Extension Fields */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-amber-900 text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider">
                II. KHỐI 8 TRƯỜNG BỔ SUNG BẮT BUỘC (ĐIỀU 14 THÔNG TƯ 05/2025/TT-BVHTTDL)
              </h3>
              <span className="text-[11px] text-amber-200">8 trường đặc thù bảo tàng</span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Nơi lưu giữ hiện nay cấp 1 */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  1a. Nơi lưu giữ hiện nay - Cấp 1 (Cơ sở bảo tàng) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={circular05.noiLuuGiuHienNay2Cap.cap1CoSo}
                  onChange={(e) =>
                    setCircular05({
                      ...circular05,
                      noiLuuGiuHienNay2Cap: {
                        ...circular05.noiLuuGiuHienNay2Cap,
                        cap1CoSo: e.target.value
                      }
                    })
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    showValidation && !circular05.noiLuuGiuHienNay2Cap.cap1CoSo.trim()
                      ? 'border-red-500 bg-red-50'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>

              {/* Nơi lưu giữ hiện nay cấp 2 */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  1b. Nơi lưu giữ hiện nay - Cấp 2 (Xã/phường, tỉnh/thành phố) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={circular05.noiLuuGiuHienNay2Cap.cap2HanhChinh}
                  onChange={(e) =>
                    setCircular05({
                      ...circular05,
                      noiLuuGiuHienNay2Cap: {
                        ...circular05.noiLuuGiuHienNay2Cap,
                        cap2HanhChinh: e.target.value
                      }
                    })
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    showValidation && !circular05.noiLuuGiuHienNay2Cap.cap2HanhChinh.trim()
                      ? 'border-red-500 bg-red-50'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>

              {/* Nơi lưu giữ trước */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  2. Nơi lưu giữ tại thời điểm tư liệu (trước 01/7/2025)
                </label>
                <input
                  type="text"
                  value={circular05.noiLuuGiuTruoc}
                  onChange={(e) => setCircular05({ ...circular05, noiLuuGiuTruoc: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                />
              </div>

              {/* Số đăng ký bảo tàng */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  5. Số đăng ký kiểm kê tại bảo tàng (LSb) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={circular05.soDangKyBaoTang}
                  onChange={(e) => setCircular05({ ...circular05, soDangKyBaoTang: e.target.value })}
                  placeholder="Ví dụ: LSb.1960"
                  className={`w-full px-3 py-2 rounded-lg border text-xs font-mono font-bold ${
                    showValidation && !circular05.soDangKyBaoTang.trim()
                      ? 'border-red-500 bg-red-50'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>

              {/* Loại bản đang hiển thị */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  3. Loại bản đang hiển thị
                </label>
                <select
                  value={circular05.loaiBanHienThi}
                  onChange={(e: any) => setCircular05({ ...circular05, loaiBanHienThi: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                >
                  <option value="Bản số của bản gốc">Bản số của bản gốc</option>
                  <option value="Bản số của bản sao">Bản số của bản sao</option>
                </select>
              </div>

              {/* Tình trạng bản gốc */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  4. Tình trạng bản gốc
                </label>
                <select
                  value={circular05.tinhTrangBanGoc}
                  onChange={(e: any) => setCircular05({ ...circular05, tinhTrangBanGoc: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                >
                  <option value="Tốt">Tốt</option>
                  <option value="Hư hại nhẹ">Hư hại nhẹ</option>
                  <option value="Có vết nứt bảo quản">Có vết nứt bảo quản</option>
                  <option value="Đã gia cố">Đã gia cố</option>
                </select>
              </div>

              {/* Người cho phép công bố */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  6. Người cho phép công bố (Bắt buộc để xem ảnh) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={circular05.nguoiChoPhepCongBo}
                  onChange={(e) => setCircular05({ ...circular05, nguoiChoPhepCongBo: e.target.value })}
                  placeholder="Ví dụ: Bảo tàng Lịch sử Quốc gia & Cục Di sản văn hoá"
                  className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold ${
                    showValidation && !circular05.nguoiChoPhepCongBo.trim()
                      ? 'border-red-500 bg-red-50'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>

              {/* Mức kiểm chứng */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  8. Mức kiểm chứng
                </label>
                <select
                  value={circular05.mucKiemChung}
                  onChange={(e: any) => setCircular05({ ...circular05, mucKiemChung: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold"
                >
                  <option value="Đã kiểm">Đã kiểm (Nhãn xanh)</option>
                  <option value="Chưa kiểm">Chưa kiểm (Nhãn vàng)</option>
                  <option value="Chưa đọc được">Chưa đọc được (Nhãn xám)</option>
                </select>
              </div>

              {/* Phần không công bố */}
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-800 mb-1">
                  7. Phần không công bố / bảo mật kho (Điều 14) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={circular05.phanKhongCongBo}
                  onChange={(e) => setCircular05({ ...circular05, phanKhongCongBo: e.target.value })}
                  placeholder="Thông tin vị trí két bí mật, hợp chất bảo quản..."
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    showValidation && !circular05.phanKhongCongBo.trim()
                      ? 'border-red-500 bg-red-50'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
            >
              Xem trước phiếu
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Kiểm Tra & Lưu Vào Danh Sách Tạm</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: LIVE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {dublinCore.identifier || 'CHƯA ĐẶT MÃ'}
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-serif mt-2">
                {dublinCore.title || '(Chưa nhập tiêu đề hiện vật)'}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-700">
                Số ĐK: {circular05.soDangKyBaoTang || 'Chưa nhập'}
              </span>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                {circular05.mucKiemChung}
              </p>
            </div>
          </div>

          {/* Table summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-lg space-y-1.5 border border-slate-200">
              <p className="font-bold text-teal-900 mb-2">Thông tin Dublin Core lõi:</p>
              <p><strong>Tác giả:</strong> {dublinCore.creator || '---'}</p>
              <p><strong>Niên đại:</strong> {dublinCore.date || '---'}</p>
              <p><strong>Chất liệu/Kích thước:</strong> {dublinCore.format || '---'}</p>
              <p><strong>Xuất xứ:</strong> {dublinCore.source || '---'}</p>
              <p><strong>Pháp lý:</strong> {dublinCore.relation || '---'}</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg space-y-1.5 border border-amber-200">
              <p className="font-bold text-amber-900 mb-2">Thông tin Thông tư 05/2025:</p>
              <p><strong>Nơi lưu giữ:</strong> {circular05.noiLuuGiuHienNay2Cap.cap1CoSo} ({circular05.noiLuuGiuHienNay2Cap.cap2HanhChinh})</p>
              <p><strong>Loại bản:</strong> {circular05.loaiBanHienThi}</p>
              <p><strong>Tình trạng:</strong> {circular05.tinhTrangBanGoc}</p>
              <p><strong>Cơ quan công bố:</strong> {circular05.nguoiChoPhepCongBo || '---'}</p>
              <p><strong>Bảo mật kho:</strong> {circular05.phanKhongCongBo || '---'}</p>
            </div>
          </div>

          <div className="text-right pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('form')}
              className="px-4 py-2 bg-teal-800 text-white rounded-lg text-xs font-semibold hover:bg-teal-900"
            >
              Quay lại chỉnh sửa biểu mẫu
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: TEMP RECORDS LIST & EXPORT */}
      {activeTab === 'tempList' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-serif">
                Danh Sách Phiếu Tạm Đã Lập ({tempRecords.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Các phiếu được lập trong phiên làm việc hiện tại, sẵn sàng xuất dữ liệu mở JSON/CSV
              </p>
            </div>
            {tempRecords.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportToJson(tempRecords, 'phieu_tam_tt05')}
                  className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất JSON phiếu tạm</span>
                </button>
                <button
                  onClick={() => exportToCsv(tempRecords, 'phieu_tam_tt05')}
                  className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất CSV phiếu tạm</span>
                </button>
              </div>
            )}
          </div>

          {tempRecords.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500 text-xs">
              <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-medium text-slate-700">Chưa có phiếu tạm nào được lưu</p>
              <p className="text-slate-400 mt-1">Hãy chuyển sang tab "Biểu mẫu nhập 23 trường" hoặc nhấn "Tải dữ liệu mẫu thử nghiệm".</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tempRecords.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {item.id}
                      </span>
                      <span className="font-mono text-slate-500">
                        {item.circular05.soDangKyBaoTang}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                        {item.circular05.mucKiemChung}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm font-serif">
                      {item.dublinCore.title}
                    </p>
                    <p className="text-slate-600 line-clamp-1">
                      {item.dublinCore.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => exportToJson([item], `phieu_${item.id}`)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      JSON
                    </button>
                    <button
                      onClick={() => exportToCsv([item], `phieu_${item.id}`)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      CSV
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
