import React, { useState, useMemo } from 'react';
import { ArtifactRecord } from '../types/tulieu';
import {
  Filter,
  RotateCcw,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileText
} from 'lucide-react';

interface Props {
  artifacts: ArtifactRecord[];
  onSelectArtifact: (artifact: ArtifactRecord) => void;
  onNavigate: (screen: string) => void;
}

export const Screen2List: React.FC<Props> = ({ artifacts, onSelectArtifact, onNavigate }) => {
  // Multi-dimensional filters
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [selectedDisplayType, setSelectedDisplayType] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Eras
  const eras = ['all', 'Đông Sơn', 'Lý', 'Trần', 'Lê', 'Tây Sơn', 'Nguyễn', 'Hiện đại'];

  const filteredArtifacts = useMemo(() => {
    return artifacts.filter((item) => {
      // Era filter
      if (selectedEra !== 'all' && item.thoiKy !== selectedEra) return false;

      // Display type filter
      if (selectedDisplayType !== 'all' && item.circular05.loaiBanHienThi !== selectedDisplayType) return false;

      // Condition filter
      if (selectedCondition !== 'all' && item.circular05.tinhTrangBanGoc !== selectedCondition) return false;

      // Verification filter
      if (selectedVerification !== 'all' && item.circular05.mucKiemChung !== selectedVerification) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          item.dublinCore.title.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.circular05.soDangKyBaoTang.toLowerCase().includes(query) ||
          item.dublinCore.format.toLowerCase().includes(query) ||
          item.dublinCore.subject.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [artifacts, selectedEra, selectedDisplayType, selectedCondition, selectedVerification, searchQuery]);

  const handleResetFilters = () => {
    setSelectedEra('all');
    setSelectedDisplayType('all');
    setSelectedCondition('all');
    setSelectedVerification('all');
    setSearchQuery('');
  };

  // Helper for verification badge
  const renderVerificationBadge = (level: string) => {
    switch (level) {
      case 'Đã kiểm':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            Đã kiểm (Nhãn xanh)
          </span>
        );
      case 'Chưa kiểm':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3" />
            Chưa kiểm (Nhãn vàng)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 border border-slate-300">
            <HelpCircle className="w-3 h-3" />
            Chưa đọc được (Nhãn xám)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-serif">
            Danh Sách Phiếu Hiện Vật Số (F01)
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Quản lý và tra cứu hồ sơ 15 Bảo vật quốc gia theo Thông tư 05/2025/TT-BVHTTDL
          </p>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
          Hiển thị: <strong>{filteredArtifacts.length}</strong> / {artifacts.length} bản ghi
        </div>
      </div>

      {/* Filter Matrix Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Filter className="w-4 h-4 text-teal-700" />
            <span>Bộ lọc hồ sơ đa chiều</span>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-500 hover:text-teal-800 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại bộ lọc</span>
          </button>
        </div>

        {/* 1. Filter: Thời kỳ lịch sử */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            1. Thời kỳ lịch sử:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {eras.map((era) => (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                className={`px-3 py-1 text-xs rounded-lg transition-all ${
                  selectedEra === era
                    ? 'bg-teal-800 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {era === 'all' ? 'Tất cả thời kỳ' : era}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Filter: Loại bản, Tình trạng, Mức kiểm chứng */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Loại bản đang hiển thị */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              2. Loại bản đang hiển thị:
            </label>
            <select
              value={selectedDisplayType}
              onChange={(e) => setSelectedDisplayType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700"
            >
              <option value="all">Tất cả loại bản</option>
              <option value="Bản số của bản gốc">Bản số của bản gốc</option>
              <option value="Bản số của bản sao">Bản số của bản sao</option>
            </select>
          </div>

          {/* Tình trạng bản gốc */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              3. Tình trạng bản gốc:
            </label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700"
            >
              <option value="all">Tất cả tình trạng</option>
              <option value="Tốt">Tốt (100% nguyên vẹn/ổn định)</option>
              <option value="Hư hại nhẹ">Hư hại nhẹ</option>
            </select>
          </div>

          {/* Mức kiểm chứng */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              4. Mức kiểm chứng:
            </label>
            <select
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700"
            >
              <option value="all">Tất cả mức kiểm chứng</option>
              <option value="Đã kiểm">Đã kiểm (Nhãn xanh)</option>
              <option value="Chưa kiểm">Chưa kiểm (Nhãn vàng)</option>
              <option value="Chưa đọc được">Chưa đọc được (Nhãn xám)</option>
            </select>
          </div>
        </div>

        {/* Search Input Filter */}
        <div className="pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Lọc thêm theo từ khoá..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
          </div>
        </div>
      </div>

      {/* Artifacts Cards List */}
      {filteredArtifacts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Không tìm thấy hiện vật phù hợp</p>
          <p className="text-xs text-slate-500 mt-1">Vui lòng thử nới lỏng các điều kiện lọc phía trên.</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-teal-800 text-white rounded-lg text-xs font-semibold hover:bg-teal-900 transition-colors"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredArtifacts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-600 transition-all flex flex-col md:flex-row gap-5"
            >
              {/* Left Column: Tech schematic preview badge */}
              <div className="w-full md:w-48 bg-slate-100 rounded-lg p-3 flex flex-col items-center justify-center text-center shrink-0 border border-slate-200/80">
                <span className="font-mono text-xs font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 mb-2">
                  {item.id}
                </span>
                <span className="font-mono text-[11px] text-slate-600">
                  {item.circular05.soDangKyBaoTang}
                </span>
                <span className="text-[10px] text-slate-500 mt-2">
                  {item.technicalDrawing.storageFilename}
                </span>
                <div className="mt-3 w-full border-t border-slate-200 pt-2 text-[10px] text-slate-600">
                  Cao: {item.technicalDrawing.heightMm}mm
                </div>
              </div>

              {/* Middle Column: Metadata */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-xs font-semibold rounded">
                    Thời kỳ {item.thoiKy}
                  </span>
                  <span className="px-2 py-0.5 bg-sky-50 text-sky-800 text-xs font-medium rounded border border-sky-200">
                    {item.circular05.loaiBanHienThi}
                  </span>
                  {renderVerificationBadge(item.circular05.mucKiemChung)}
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  {item.dublinCore.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {item.dublinCore.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-700 pt-1">
                  <div>
                    <span className="font-medium text-slate-500">Niên đại: </span>
                    <span>{item.dublinCore.date}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-500">Chất liệu: </span>
                    <span>{item.dublinCore.format}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-500">Nơi lưu giữ: </span>
                    <span>{item.circular05.noiLuuGiuHienNay2Cap.cap1CoSo} ({item.circular05.noiLuuGiuHienNay2Cap.cap2HanhChinh})</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-500">Pháp lý: </span>
                    <span className="text-teal-900 font-medium">{item.dublinCore.relation}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex md:flex-col items-center justify-end md:justify-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5">
                <button
                  onClick={() => {
                    onSelectArtifact(item);
                    onNavigate('screen3');
                  }}
                  className="w-full px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Chi tiết phiếu</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
