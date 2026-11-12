import React, { useState } from 'react';
import { ArtifactRecord } from '../types/tulieu';
import { DUBLIN_CORE_LABELS, CIRCULAR_05_LABELS } from '../data/tulieu';
import { ArtifactBlueprint } from '../components/ArtifactBlueprint';
import { PrintModal } from '../components/PrintModal';
import { generateCitation } from '../utils/exportData';
import {
  Printer,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  FileCheck2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  AlertTriangle
} from 'lucide-react';

interface Props {
  artifact: ArtifactRecord;
  artifactsList: ArtifactRecord[];
  onSelectArtifact: (artifact: ArtifactRecord) => void;
  onNavigate: (screen: string) => void;
}

export const Screen3Detail: React.FC<Props> = ({
  artifact,
  artifactsList,
  onSelectArtifact,
  onNavigate,
}) => {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [simulateMissingRights, setSimulateMissingRights] = useState(false);

  // Pagination Next / Previous
  const currentIndex = artifactsList.findIndex((a) => a.id === artifact.id);
  const prevArtifact = currentIndex > 0 ? artifactsList[currentIndex - 1] : null;
  const nextArtifact = currentIndex < artifactsList.length - 1 ? artifactsList[currentIndex + 1] : null;

  const handleCopyCitation = () => {
    const citation = generateCitation(artifact);
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Navigation & Action Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Prev / Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => prevArtifact && onSelectArtifact(prevArtifact)}
            disabled={!prevArtifact}
            className="p-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Hiện vật trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-xs">
            <span className="font-semibold text-slate-800">Hiện vật: </span>
            <span className="font-mono font-bold text-teal-800">{currentIndex + 1}</span>
            <span className="text-slate-400"> / {artifactsList.length}</span>
          </div>
          <button
            onClick={() => nextArtifact && onSelectArtifact(nextArtifact)}
            disabled={!nextArtifact}
            className="p-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Hiện vật tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Simulating Missing Rights Toggle for testing compliance */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs">
          <span className="text-amber-900 font-medium">Mô phỏng thiếu quyền công bố:</span>
          <button
            onClick={() => setSimulateMissingRights(!simulateMissingRights)}
            className="text-amber-700 hover:text-amber-900 flex items-center"
            title="Thử nghiệm quy định ẩn hình ảnh khi thiếu trường 'Người cho phép công bố'"
          >
            {simulateMissingRights ? (
              <ToggleRight className="w-6 h-6 text-amber-700" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-400" />
            )}
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Copy Citation */}
          <button
            onClick={handleCopyCitation}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-300 transition-colors"
            title="Sao chép trích dẫn học thuật chuẩn ISO 690 / APA"
          >
            {copiedCitation ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>Sao chép trích dẫn chuẩn</span>
              </>
            )}
          </button>

          {/* Export Print / PDF */}
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Xuất Bản In Phiếu (Print/PDF)</span>
          </button>
        </div>
      </div>

      {/* Main Title & Identification Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-6 rounded-2xl border border-teal-800/60 shadow-lg">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="bg-amber-400 text-amber-950 font-mono font-bold text-xs px-2.5 py-0.5 rounded">
            MÃ ĐỊNH DANH: {artifact.id}
          </span>
          <span className="bg-teal-700/60 text-teal-100 font-mono font-bold text-xs px-2.5 py-0.5 rounded border border-teal-500/40">
            SỐ ĐĂNG KÝ: {artifact.circular05.soDangKyBaoTang}
          </span>
          <span className="bg-white/10 text-slate-200 text-xs px-2.5 py-0.5 rounded">
            THỜI KỲ: {artifact.thoiKy.toUpperCase()}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-white mb-2 leading-tight">
          {artifact.dublinCore.title}
        </h1>
        <p className="text-teal-200/90 text-sm max-w-3xl leading-relaxed">
          {artifact.dublinCore.relation} • {artifact.dublinCore.format}
        </p>
      </div>

      {/* Blueprint Visualizer Component */}
      <ArtifactBlueprint
        artifact={artifact}
        simulateMissingRights={simulateMissingRights}
      />

      {/* Table 1: 15 Dublin Core Fields */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-teal-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Bảng 15 Trường Siêu Dữ Liệu Lõi Dublin Core (ISO 15836)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-teal-200 bg-teal-950 px-2 py-0.5 rounded">
            15/15 trường đầy đủ
          </span>
        </div>

        <div className="divide-y divide-slate-200 text-xs">
          {Object.entries(artifact.dublinCore).map(([key, value]) => {
            const meta = DUBLIN_CORE_LABELS[key as keyof typeof DUBLIN_CORE_LABELS];
            return (
              <div
                key={key}
                className="grid grid-cols-1 md:grid-cols-12 p-3.5 hover:bg-slate-50 transition-colors gap-2"
              >
                <div className="md:col-span-4">
                  <p className="font-bold text-slate-800">
                    {meta ? meta.labelVi : key}
                  </p>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">
                    {meta?.note}
                  </p>
                </div>
                <div className="md:col-span-8 text-slate-800 font-medium leading-relaxed">
                  {value}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table 2: 8 Mandatory Circular 05/2025 Extension Fields */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-amber-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-300" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Bảng 8 Trường Bổ Sung Bắt Buộc Theo Điều 14 Thông Tư 05/2025/TT-BVHTTDL
            </h2>
          </div>
          <span className="text-[11px] font-mono text-amber-200 bg-amber-950 px-2 py-0.5 rounded">
            8/8 trường chuẩn hóa
          </span>
        </div>

        <div className="divide-y divide-slate-200 text-xs">
          {/* 1. Nơi lưu giữ hiện nay 2 cấp */}
          <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 hover:bg-slate-50 gap-2">
            <div className="md:col-span-4">
              <p className="font-bold text-slate-800">{CIRCULAR_05_LABELS.noiLuuGiuHienNay2Cap.labelVi}</p>
              <p className="text-[11px] text-slate-500 italic mt-0.5">{CIRCULAR_05_LABELS.noiLuuGiuHienNay2Cap.note}</p>
            </div>
            <div className="md:col-span-8 text-slate-800 space-y-1">
              <p><strong>Cấp 1 (Cơ sở bảo tàng):</strong> {artifact.circular05.noiLuuGiuHienNay2Cap.cap1CoSo}</p>
              <p><strong>Cấp 2 (Hành chính):</strong> {artifact.circular05.noiLuuGiuHienNay2Cap.cap2HanhChinh}</p>
            </div>
          </div>

          {/* 2. Nơi lưu giữ tại thời điểm tư liệu */}
          <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 hover:bg-slate-50 gap-2">
            <div className="md:col-span-4">
              <p className="font-bold text-slate-800">{CIRCULAR_05_LABELS.noiLuuGiuTruoc.labelVi}</p>
              <p className="text-[11px] text-slate-500 italic mt-0.5">{CIRCULAR_05_LABELS.noiLuuGiuTruoc.note}</p>
            </div>
            <div className="md:col-span-8 text-slate-800 font-medium">
              {artifact.circular05.noiLuuGiuTruoc}
            </div>
          </div>

          {/* 3. Loại bản đang hiển thị */}
          <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 hover:bg-slate-50 gap-2">
            <div className="md:col-span-4">
              <p className="font-bold text-slate-800">{CIRCULAR_05_LABELS.loaiBanHienThi.labelVi}</p>
              <p className="text-[11px] text-slate-500 italic mt-0.5">{CIRCULAR_05_LABELS.loaiBanHienThi.note}</p>
            </div>
            <div className="md:col-span-8 font-semibold text-emerald-800">
              {artifact.circular05.loaiBanHienThi}
            </div>
          </div>

          {/* 4. Tình trạng bản gốc */}
          <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 hover:bg-slate-50 gap-2">
            <div className="md:col-span-4">
              <p className="font-bold text-slate-800">{CIRCULAR_05_LABELS.tinhTrangBanGoc.labelVi}</p>
              <p className="text-[11px] text-slate-500 italic mt-0.5">{CIRCULAR_05_LABELS.tinhTrangBanGoc.note}</p>
            </div>
            <div className="md:col-span-8 font-medium text-slate-800">
              {artifact.circular05.tinhTrangBanGoc}
            </div>
          </div>

          {/* 5. Số đăng ký kiểm kê bảo tàng */}
          <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 hover:bg-slate-50 gap-2">
            <div className="md:col-span-4">
              <p className="font-bold text-slate-800">{CIRCULAR_05_LABELS.soDangKyBaoTang.labelVi}</p>
              <p className="text-[11px] text-slate-500 italic mt-0.5">{CIRCULAR_05_LABELS.soDangKyBaoTang.note}</p>
            </div>
            <div className="md:col-span-8 font-mono font-bold text-slate-900">
              {artifact.circular05.soDangKyBaoTang}
            </div>
          </div>

          {/* 6. Người cho phép công bố */}
          <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 hover:bg-slate-50 gap-2">
            <div className="md:col-span-4">
              <p className="font-bold text-slate-800">{CIRCULAR_05_LABELS.nguoiChoPhepCongBo.labelVi}</p>
              <p className="text-[11px] text-slate-500 italic mt-0.5">{CIRCULAR_05_LABELS.nguoiChoPhepCongBo.note}</p>
            </div>
            <div className="md:col-span-8 font-bold text-slate-900">
              {simulateMissingRights ? (
                <span className="text-amber-700 italic">
                  [Đang mô phỏng để trống trường này - Hệ thống tự động khoá hình ảnh]
                </span>
              ) : (
                artifact.circular05.nguoiChoPhepCongBo
              )}
            </div>
          </div>

          {/* 7. Phần không công bố */}
          <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 hover:bg-slate-50 gap-2">
            <div className="md:col-span-4">
              <p className="font-bold text-slate-800">{CIRCULAR_05_LABELS.phanKhongCongBo.labelVi}</p>
              <p className="text-[11px] text-slate-500 italic mt-0.5">{CIRCULAR_05_LABELS.phanKhongCongBo.note}</p>
            </div>
            <div className="md:col-span-8 text-slate-600 italic">
              {artifact.circular05.phanKhongCongBo}
            </div>
          </div>

          {/* 8. Mức kiểm chứng */}
          <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 hover:bg-slate-50 gap-2">
            <div className="md:col-span-4">
              <p className="font-bold text-slate-800">{CIRCULAR_05_LABELS.mucKiemChung.labelVi}</p>
              <p className="text-[11px] text-slate-500 italic mt-0.5">{CIRCULAR_05_LABELS.mucKiemChung.note}</p>
            </div>
            <div className="md:col-span-8">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded">
                {artifact.circular05.mucKiemChung} (Nhãn xanh chuẩn xác)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Epigraphy Section if present */}
      {artifact.hanNom && (
        <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase text-stone-900 tracking-wide">
              Minh Văn Hán Nôm & Khảo Cổ Kim Thạch
            </h3>
            <button
              onClick={() => onNavigate('screen5')}
              className="text-xs text-teal-800 hover:text-teal-950 font-semibold underline"
            >
              Mở trong Trợ lý Gemini để phân tích chuyên sâu
            </button>
          </div>
          <div className="p-4 bg-white rounded-lg border border-stone-200 text-xs space-y-2">
            <p><strong>Nguyên văn:</strong> <span className="text-stone-900 font-serif text-sm">{artifact.hanNom.originalText}</span></p>
            <p><strong>Phiên âm:</strong> <span className="italic text-stone-800">{artifact.hanNom.transliteration}</span></p>
            <p><strong>Dịch nghĩa:</strong> <span className="text-stone-800">{artifact.hanNom.translation}</span></p>
            <p className="text-stone-500 text-[11px]"><strong>Ghi chú:</strong> {artifact.hanNom.notes}</p>
          </div>
        </div>
      )}

      {/* Print Modal Dialog */}
      <PrintModal
        artifact={artifact}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
};
