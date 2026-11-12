import React, { useState, useMemo } from 'react';
import { ArtifactRecord } from '../types/tulieu';
import { exportToJson, exportToCsv } from '../utils/exportData';
import {
  Landmark,
  Building2,
  FileCheck,
  Search,
  Download,
  ShieldCheck,
  ArrowRight,
  Database,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface Props {
  artifacts: ArtifactRecord[];
  onSelectArtifact: (artifact: ArtifactRecord) => void;
  onNavigate: (screen: string) => void;
}

export const Screen1Home: React.FC<Props> = ({ artifacts, onSelectArtifact, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Search filtering
  const filteredArtifacts = useMemo(() => {
    if (!searchTerm.trim()) return artifacts;
    const term = searchTerm.toLowerCase();
    return artifacts.filter((item) =>
      item.dublinCore.title.toLowerCase().includes(term) ||
      item.id.toLowerCase().includes(term) ||
      item.circular05.soDangKyBaoTang.toLowerCase().includes(term) ||
      item.thoiKy.toLowerCase().includes(term) ||
      item.dublinCore.format.toLowerCase().includes(term) ||
      item.dublinCore.subject.toLowerCase().includes(term)
    );
  }, [artifacts, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = artifacts.length;
    const goodCondition = artifacts.filter(a => a.circular05.tinhTrangBanGoc === 'Tốt').length;
    const verified = artifacts.filter(a => a.circular05.mucKiemChung === 'Đã kiểm').length;
    const originalDigitals = artifacts.filter(a => a.circular05.loaiBanHienThi === 'Bản số của bản gốc').length;
    
    // By era
    const eraCounts: Record<string, number> = {};
    artifacts.forEach(a => {
      eraCounts[a.thoiKy] = (eraCounts[a.thoiKy] || 0) + 1;
    });

    return { total, goodCondition, verified, originalDigitals, eraCounts };
  }, [artifacts]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner: Required Institutional & Legal Attribution Header */}
      <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-teal-800/60 relative overflow-hidden">
        {/* Decorative background vectors */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Landmark className="w-96 h-96 -mr-16 text-amber-200" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MÃ ĐỀ TÀI: F01 • CHUẨN THÔNG TƯ 05/2025/TT-BVHTTDL & DUBLIN CORE</span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight font-serif">
            Phiếu Hiện Vật Số Theo Thông Tư 05/2025
          </h1>
          <p className="text-teal-200/90 text-sm md:text-base leading-relaxed">
            Hệ thống chuẩn hoá phiếu kiểm kê số, tra cứu siêu dữ liệu 23 trường (15 trường Dublin Core + 8 trường Thông tư 05/2025)
            cho khối Bảo vật quốc gia tiêu biểu tại Bảo tàng Lịch sử Quốc gia Việt Nam.
          </p>

          {/* Institutional Grid Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-teal-800/80 text-xs text-slate-200">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                <Landmark className="w-4 h-4" />
                <span>Khối hiện vật</span>
              </div>
              <p className="text-slate-100 font-medium">15 Bảo vật quốc gia & hiện vật tiêu biểu</p>
              <p className="text-[11px] text-teal-300/80">Khảo cổ, kim khí, gốm sứ & tư liệu lịch sử</p>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-teal-300 font-bold mb-1">
                <Building2 className="w-4 h-4" />
                <span>Nơi lưu giữ hiện nay</span>
              </div>
              <p className="text-slate-100 font-semibold">Bảo tàng Lịch sử Quốc gia</p>
              <p className="text-[11px] text-teal-200">
                Phường Cửa Nam, TP. Hà Nội
              </p>
              <p className="text-[10px] text-slate-400 italic">
                (Trước 01/7/2025: Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội)
              </p>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Cơ quan cho phép công bố</span>
              </div>
              <p className="text-slate-100 font-medium">Bảo tàng Lịch sử Quốc gia & Cục Di sản văn hoá</p>
              <p className="text-[10px] text-emerald-300">
                Dữ liệu công bố phục vụ học tập phi lợi nhuận theo Điều 88 Luật Di sản văn hoá 2024
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Global Exports */}
      <div className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Quick Search Bar */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm nhanh tên hiện vật, mã F01, số đăng ký LSb, thời kỳ, chất liệu..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white transition-all"
          />
        </div>

        {/* Global Export Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => exportToJson(artifacts)}
            title="Xuất file JSON kèm ngày xuất trong tên tệp"
            className="px-3.5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất JSON (Ngày)</span>
          </button>
          <button
            onClick={() => exportToCsv(artifacts)}
            title="Xuất file CSV chuẩn hoá kèm ngày xuất trong tên tệp"
            className="px-3.5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất CSV (Ngày)</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Tổng số hiện vật</span>
            <Database className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{stats.total}</p>
          <p className="text-[11px] text-teal-700 font-medium mt-1">100% Bảo vật quốc gia</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Tình trạng bản gốc</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 font-mono">
            {stats.goodCondition} / {stats.total}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Trạng thái vật lý: Tốt</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Mức kiểm chứng</span>
            <ShieldCheck className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-sky-700 font-mono">
            {stats.verified} / {stats.total}
          </p>
          <span className="inline-block mt-1 text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
            Đã kiểm (Nhãn xanh)
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Loại bản hiển thị</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-800 font-mono">
            {stats.originalDigitals}
          </p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Bản số của bản gốc</p>
        </div>
      </div>

      {/* Breakdown by Historical Era Chips */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-teal-800" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Phân bố theo Thời kỳ lịch sử:
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(stats.eraCounts).map(([era, count]) => (
            <div
              key={era}
              className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-2"
            >
              <span className="font-semibold text-slate-800">{era}:</span>
              <span className="px-1.5 py-0.2 bg-teal-100 text-teal-900 rounded font-bold font-mono text-[11px]">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Artifacts Gallery / List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 font-serif">
            Danh mục 15 Bảo vật quốc gia ({filteredArtifacts.length})
          </h2>
          <button
            onClick={() => onNavigate('screen2')}
            className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 group"
          >
            <span>Xem danh sách đầy đủ với bộ lọc đa chiều</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Grid of 15 Artifact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArtifacts.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectArtifact(item);
                onNavigate('screen3');
              }}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-teal-600 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Top card metadata pills */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {item.id}
                  </span>
                  <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {item.circular05.soDangKyBaoTang}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-800 transition-colors font-serif leading-snug">
                    {item.dublinCore.title}
                  </h3>
                  <p className="text-xs text-amber-800 font-medium mt-1">
                    Thời kỳ: {item.thoiKy} • {item.dublinCore.date}
                  </p>
                </div>

                {/* Excerpt */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.dublinCore.description}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded border border-emerald-200">
                  {item.circular05.mucKiemChung}
                </span>
                <span className="text-teal-700 font-medium flex items-center gap-1 group-hover:underline">
                  Xem chi tiết phiếu
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
