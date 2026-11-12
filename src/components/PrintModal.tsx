import React from 'react';
import { ArtifactRecord } from '../types/tulieu';
import { DUBLIN_CORE_LABELS, CIRCULAR_05_LABELS } from '../data/tulieu';
import { Printer, X, Download } from 'lucide-react';

interface Props {
  artifact: ArtifactRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintModal: React.FC<Props> = ({ artifact, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Action Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-teal-400" />
            <h3 className="font-semibold text-sm md:text-base">
              Bản In Phiếu Kiểm Kê Hiện Vật Chuẩn (Thông tư 05/2025/TT-BVHTTDL)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              In phiếu / Lưu PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document (A4 Styling) */}
        <div className="p-8 md:p-12 overflow-y-auto bg-white text-slate-900 text-xs font-serif leading-relaxed print:p-0 print:overflow-visible">
          {/* Header Block: National Motto & Institution */}
          <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-300">
            <div className="text-center space-y-1">
              <p className="font-sans uppercase text-[11px] font-bold text-slate-700">
                BỘ VĂN HÓA, THỂ THAO VÀ DU LỊCH
              </p>
              <p className="font-sans uppercase text-[12px] font-extrabold text-teal-950">
                BẢO TÀNG LỊCH SỬ QUỐC GIA
              </p>
              <p className="text-[11px] text-slate-600">
                Số: {artifact.circular05.soDangKyBaoTang}/PKK-BTLSQG
              </p>
            </div>
            <div className="text-center space-y-1">
              <p className="font-sans uppercase text-[11px] font-bold text-slate-800">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </p>
              <p className="font-sans text-[11px] font-bold text-slate-800">
                Độc lập - Tự do - Hạnh phúc
              </p>
              <div className="w-24 h-[1px] bg-slate-400 mx-auto my-1"></div>
              <p className="text-[11px] text-slate-500 italic">
                Hà Nội, ngày 12 tháng 11 năm 2026
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-6 space-y-1">
            <h1 className="font-sans text-lg md:text-xl font-extrabold text-teal-950 uppercase tracking-wide">
              PHIẾU KIỂM KÊ HIỆN VẬT SỐ
            </h1>
            <p className="text-[11px] text-slate-600 italic">
              (Thực hiện theo Điều 14 Thông tư số 05/2025/TT-BVHTTDL và chuẩn Dublin Core quốc tế)
            </p>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded font-mono text-[11px] text-teal-900">
              <span>Mã định danh F01: <strong>{artifact.id}</strong></span>
              <span>•</span>
              <span>Số đăng ký: <strong>{artifact.circular05.soDangKyBaoTang}</strong></span>
              <span>•</span>
              <span>Thời kỳ: <strong>{artifact.thoiKy}</strong></span>
            </div>
          </div>

          {/* Section 1: 15 Dublin Core Fields */}
          <div className="mb-6">
            <h2 className="font-sans text-xs font-bold uppercase bg-slate-100 px-3 py-1.5 border-l-4 border-teal-700 text-teal-950 mb-2">
              I. BẢNG 15 TRƯỜNG SIÊU DỮ LIỆU LÕI DUBLIN CORE (ISO 15836)
            </h2>
            <table className="w-full border-collapse border border-slate-300 text-[11px]">
              <tbody>
                {Object.entries(artifact.dublinCore).map(([key, val]) => {
                  const meta = DUBLIN_CORE_LABELS[key as keyof typeof DUBLIN_CORE_LABELS];
                  return (
                    <tr key={key} className="border-b border-slate-300 hover:bg-slate-50/50">
                      <td className="w-1/3 p-2 font-sans font-semibold text-slate-800 bg-slate-50/80 border-r border-slate-300 align-top">
                        {meta ? meta.labelVi : key}
                      </td>
                      <td className="p-2 text-slate-800 align-top leading-normal">
                        {val}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Section 2: 8 Circular 05/2025 Mandatory Extension Fields */}
          <div className="mb-6">
            <h2 className="font-sans text-xs font-bold uppercase bg-amber-50 px-3 py-1.5 border-l-4 border-amber-600 text-amber-950 mb-2">
              II. BẢNG 8 TRƯỜNG BỔ SUNG BẮT BUỘC THEO ĐIỀU 14 THÔNG TƯ 05/2025/TT-BVHTTDL
            </h2>
            <table className="w-full border-collapse border border-slate-300 text-[11px]">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-1/3 p-2 font-sans font-semibold text-slate-800 bg-slate-50 border-r border-slate-300">
                    1. Nơi lưu giữ hiện nay (2 cấp)
                  </td>
                  <td className="p-2 text-slate-800">
                    <strong>Cấp 1 (Cơ sở bảo tàng):</strong> {artifact.circular05.noiLuuGiuHienNay2Cap.cap1CoSo}<br />
                    <strong>Cấp 2 (Hành chính):</strong> {artifact.circular05.noiLuuGiuHienNay2Cap.cap2HanhChinh}
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-sans font-semibold text-slate-800 bg-slate-50 border-r border-slate-300">
                    2. Nơi lưu giữ tại thời điểm tư liệu
                  </td>
                  <td className="p-2 text-slate-800">{artifact.circular05.noiLuuGiuTruoc}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-sans font-semibold text-slate-800 bg-slate-50 border-r border-slate-300">
                    3. Loại bản đang hiển thị
                  </td>
                  <td className="p-2 text-slate-800 font-medium text-emerald-800">
                    {artifact.circular05.loaiBanHienThi}
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-sans font-semibold text-slate-800 bg-slate-50 border-r border-slate-300">
                    4. Tình trạng bản gốc
                  </td>
                  <td className="p-2 text-slate-800">{artifact.circular05.tinhTrangBanGoc}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-sans font-semibold text-slate-800 bg-slate-50 border-r border-slate-300">
                    5. Số đăng ký kiểm kê bảo tàng
                  </td>
                  <td className="p-2 font-mono font-bold text-slate-900">{artifact.circular05.soDangKyBaoTang}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-sans font-semibold text-slate-800 bg-slate-50 border-r border-slate-300">
                    6. Người cho phép công bố
                  </td>
                  <td className="p-2 text-slate-800 font-semibold">{artifact.circular05.nguoiChoPhepCongBo}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-sans font-semibold text-slate-800 bg-slate-50 border-r border-slate-300">
                    7. Phần không công bố (Bảo mật kho)
                  </td>
                  <td className="p-2 text-slate-600 italic">{artifact.circular05.phanKhongCongBo}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-sans font-semibold text-slate-800 bg-slate-50 border-r border-slate-300">
                    8. Mức kiểm chứng phiên âm / dịch nghĩa
                  </td>
                  <td className="p-2 text-slate-800 font-semibold text-emerald-700">
                    {artifact.circular05.mucKiemChung}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Epigraphy / Hán Nôm if available */}
          {artifact.hanNom && (
            <div className="mb-6">
              <h2 className="font-sans text-xs font-bold uppercase bg-stone-100 px-3 py-1.5 border-l-4 border-stone-600 text-stone-900 mb-2">
                III. VĂN BẢN MINH VĂN VÀ PHIÊN ÂM HÁN NÔM
              </h2>
              <div className="p-3 bg-stone-50 border border-stone-200 rounded space-y-2 text-[11px]">
                <p><strong>Nguyên văn chữ Hán:</strong> <span className="text-stone-900 font-medium font-serif">{artifact.hanNom.originalText}</span></p>
                <p><strong>Phiên âm Hán Việt:</strong> <span className="italic text-stone-800">{artifact.hanNom.transliteration}</span></p>
                <p><strong>Dịch nghĩa tiếng Việt:</strong> <span className="text-stone-800">{artifact.hanNom.translation}</span></p>
                <p><strong>Ghi chú chuyên môn:</strong> <span className="text-stone-600">{artifact.hanNom.notes}</span></p>
              </div>
            </div>
          )}

          {/* Signature Sign-off Block */}
          <div className="grid grid-cols-3 gap-4 text-center pt-8 border-t border-slate-300 font-sans">
            <div>
              <p className="font-bold text-[11px] uppercase">Cán bộ lập phiếu</p>
              <p className="text-[10px] text-slate-500 italic mb-14">(Ký, ghi rõ họ tên)</p>
              <p className="font-semibold text-[11px]">Vương Bá Nguyên</p>
            </div>
            <div>
              <p className="font-bold text-[11px] uppercase">Trưởng phòng Kiểm kê - Bảo quản</p>
              <p className="text-[10px] text-slate-500 italic mb-14">(Ký, ghi rõ họ tên)</p>
              <p className="font-semibold text-[11px]">Đã duyệt</p>
            </div>
            <div>
              <p className="font-bold text-[11px] uppercase">Giám đốc Bảo tàng LSQG</p>
              <p className="text-[10px] text-slate-500 italic mb-14">(Ký tên và đóng dấu)</p>
              <p className="font-semibold text-[11px]">TS. Nguyễn Văn Đoàn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
