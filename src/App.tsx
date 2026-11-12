import React, { useState } from 'react';
import { ARTIFACTS_DATA } from './data/tulieu';
import { ArtifactRecord } from './types/tulieu';
import { exportToJson, exportToCsv } from './utils/exportData';

import { Screen1Home } from './screens/Screen1Home';
import { Screen2List } from './screens/Screen2List';
import { Screen3Detail } from './screens/Screen3Detail';
import { Screen4NewRecord } from './screens/Screen4NewRecord';
import { Screen5GeminiAssistant } from './screens/Screen5GeminiAssistant';
import { Screen6SourcesAndAbout } from './screens/Screen6SourcesAndAbout';

import {
  Landmark,
  ListFilter,
  FileText,
  FilePlus,
  Bot,
  BookOpen,
  Download,
  Menu,
  X,
  Building2,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('screen1');
  const [artifactsList, setArtifactsList] = useState<ArtifactRecord[]>(ARTIFACTS_DATA);
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactRecord>(ARTIFACTS_DATA[0]);
  const [tempRecords, setTempRecords] = useState<ArtifactRecord[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Add new temporary record
  const handleAddNewArtifact = (record: ArtifactRecord) => {
    setTempRecords((prev) => [record, ...prev]);
    // Also prepend to current session's artifacts list so it can be previewed everywhere
    setArtifactsList((prev) => [record, ...prev]);
  };

  const navItems = [
    { id: 'screen1', label: '1. Trang chủ', icon: Landmark, desc: 'Khối hiện vật & Nơi lưu giữ' },
    { id: 'screen2', label: '2. Danh sách phiếu', icon: ListFilter, desc: 'Bộ lọc đa chiều' },
    { id: 'screen3', label: '3. Chi tiết phiếu', icon: FileText, desc: 'Chuẩn 23 trường TT05' },
    { id: 'screen4', label: '4. Lập phiếu mới', icon: FilePlus, desc: 'Kiểm tra & xuất dữ liệu' },
    { id: 'screen5', label: '5. Trợ lý Gemini', icon: Bot, desc: 'Tra cứu & phiên âm Hán Nôm' },
    { id: 'screen6', label: '6. Nguồn & Giới thiệu', icon: BookOpen, desc: '8 nguồn chính thống' },
  ];

  const handleSelectNav = (id: string) => {
    setCurrentScreen(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-slate-800 flex flex-col font-sans selection:bg-teal-800 selection:text-white">
      {/* Topmost Institutional Header */}
      <header className="bg-teal-950 text-white border-b border-teal-900 sticky top-0 z-40 shadow-md">
        {/* Top utility sub-bar */}
        <div className="bg-teal-900/90 text-teal-200 px-4 py-1.5 text-[11px] flex flex-wrap items-center justify-between gap-2 border-b border-teal-800/60">
          <div className="flex items-center gap-2">
            <span className="font-mono bg-amber-400 text-teal-950 px-1.5 py-0.2 rounded font-extrabold text-[10px]">
              F01
            </span>
            <span className="font-semibold text-slate-100">
              Bảo tàng Lịch sử Quốc gia
            </span>
            <span className="text-teal-300 hidden sm:inline">•</span>
            <span className="text-teal-200 hidden sm:inline">
              Nơi lưu giữ: Phường Cửa Nam, TP. Hà Nội (Trước 01/7/2025: Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-300 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dữ liệu mở học thuật (Điều 88 Luật DSVH 2024)</span>
            </span>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Logo & Project Title */}
          <div
            onClick={() => handleSelectNav('screen1')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-teal-950 flex items-center justify-center font-serif font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              ĐS
            </div>
            <div>
              <div className="text-sm md:text-base font-extrabold text-white font-serif tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                Phiếu Hiện Vật Số Theo TT 05/2025
              </div>
              <div className="text-[11px] text-teal-300 font-medium">
                15 Bảo vật quốc gia tại Bảo tàng Lịch sử Quốc gia (F01)
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-teal-800 text-amber-300 shadow-xs border border-teal-700'
                      : 'text-slate-200 hover:text-white hover:bg-teal-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-teal-900 text-slate-200 hover:text-white border border-teal-800"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-teal-950 border-t border-teal-850 px-4 py-3 space-y-1 text-xs animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className={`w-full p-2.5 rounded-lg font-semibold flex items-center gap-2.5 text-left transition-colors ${
                    isActive
                      ? 'bg-teal-800 text-amber-300 border border-teal-700'
                      : 'text-slate-200 hover:bg-teal-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-amber-400" />
                  <div>
                    <div>{item.label}</div>
                    <div className="text-[10px] text-teal-300 font-normal">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {currentScreen === 'screen1' && (
          <Screen1Home
            artifacts={artifactsList}
            onSelectArtifact={setSelectedArtifact}
            onNavigate={handleSelectNav}
          />
        )}

        {currentScreen === 'screen2' && (
          <Screen2List
            artifacts={artifactsList}
            onSelectArtifact={setSelectedArtifact}
            onNavigate={handleSelectNav}
          />
        )}

        {currentScreen === 'screen3' && (
          <Screen3Detail
            artifact={selectedArtifact}
            artifactsList={artifactsList}
            onSelectArtifact={setSelectedArtifact}
            onNavigate={handleSelectNav}
          />
        )}

        {currentScreen === 'screen4' && (
          <Screen4NewRecord
            onAddNewArtifact={handleAddNewArtifact}
            tempRecords={tempRecords}
          />
        )}

        {currentScreen === 'screen5' && (
          <Screen5GeminiAssistant artifacts={artifactsList} />
        )}

        {currentScreen === 'screen6' && <Screen6SourcesAndAbout />}
      </main>

      {/* Footer with legal attributions and student credits */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 px-4 sm:px-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="font-serif font-bold text-slate-100 text-sm">
              Phiếu Hiện Vật Số Theo Thông Tư 05/2025 (F01)
            </p>
            <p className="text-[11px] leading-relaxed">
              Ứng dụng kiểm kê, quản lý và tra cứu hồ sơ 15 Bảo vật quốc gia lưu giữ tại Bảo tàng Lịch sử Quốc gia.
              Tuân thủ Luật Di sản văn hoá 2024, Thông tư 05/2025/TT-BVHTTDL và chuẩn Dublin Core quốc tế.
            </p>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <p className="font-semibold text-slate-200">Đơn vị lưu giữ & Cho phép công bố:</p>
            <p>• Bảo tàng Lịch sử Quốc gia Việt Nam</p>
            <p>• Cục Di sản văn hoá (Bộ Văn hoá, Thể thao và Du lịch)</p>
            <p>• Địa danh hiện nay: Phường Cửa Nam, TP. Hà Nội</p>
            <p className="text-slate-500 italic">• Địa danh trước 01/7/2025: Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội</p>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <p className="font-semibold text-slate-200">Thông tin dự án & Bản quyền:</p>
            <p>• Thực tập sinh: <strong>Vương Bá Nguyên</strong> (PH59253 - Nhóm 1)</p>
            <p>• Đợt 15 FPT Polytechnic & IMTA TECH (Dự án xã hội phi lợi nhuận)</p>
            <p>• Dữ liệu công bố phục vụ học tập theo Điều 88 Luật Di sản văn hoá 2024</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 mt-6 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
          © 2026 Phiếu Hiện Vật Số Theo Thông Tư 05/2025 • Mã đề tài: F01 • Bảo tàng Lịch sử Quốc gia Việt Nam.
        </div>
      </footer>
    </div>
  );
}
