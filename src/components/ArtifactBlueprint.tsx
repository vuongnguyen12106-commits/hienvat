import React, { useState } from 'react';
import { ArtifactRecord } from '../types/tulieu';
import { ZoomIn, ZoomOut, RotateCcw, ShieldAlert, Layers, Ruler, FileCheck2 } from 'lucide-react';

interface Props {
  artifact: ArtifactRecord;
  simulateMissingRights?: boolean;
}

export const ArtifactBlueprint: React.FC<Props> = ({ artifact, simulateMissingRights = false }) => {
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showRuler, setShowRuler] = useState<boolean>(true);

  const hasPublishingRights = !simulateMissingRights && Boolean(artifact.circular05.nguoiChoPhepCongBo?.trim());

  // Render SVG technical drawing based on artifact drawingType
  const renderSvgDrawing = () => {
    const { drawingType, heightMm, diameterMm, widthMm } = artifact.technicalDrawing;

    if (viewMode === 'detail') {
      // Detail view: Macro motifs / inscriptions
      return (
        <svg viewBox="0 0 600 400" className="w-full h-full text-amber-900/80">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Detailed schematic based on type */}
          {artifact.hanNom ? (
            <g transform="translate(40, 40)">
              <rect x="0" y="0" width="520" height="320" fill="#fdfbf7" stroke="#b45309" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="260" y="30" textAnchor="middle" fill="#78350f" fontSize="13" fontWeight="bold">
                BẢN RẬP THÁC BẢN CHI TIẾT MINH VĂN HÁN NÔM
              </text>
              <line x1="40" y1="45" x2="480" y2="45" stroke="#d97706" strokeWidth="1" />
              
              <g transform="translate(60, 80)">
                <rect x="-10" y="-10" width="420" height="150" fill="#fef3c7" fillOpacity="0.4" stroke="#d97706" strokeWidth="1" rx="4" />
                <text x="200" y="30" textAnchor="middle" fill="#92400e" fontSize="20" fontFamily="serif" letterSpacing="4">
                  {artifact.hanNom.originalText.slice(0, 36)}...
                </text>
                <text x="200" y="70" textAnchor="middle" fill="#78350f" fontSize="12" fontStyle="italic">
                  Phiên âm: "{artifact.hanNom.transliteration.slice(0, 50)}..."
                </text>
                <text x="200" y="105" textAnchor="middle" fill="#451a03" fontSize="11">
                  Độ sâu nét khắc: 0.8mm - 1.2mm | Kỹ thuật khắc chìm (âm khắc) kim loại/đá
                </text>
              </g>

              {/* Technical annotations */}
              <circle cx="90" cy="270" r="16" fill="none" stroke="#0284c7" strokeWidth="1.5" />
              <text x="90" y="275" textAnchor="middle" fill="#0284c7" fontSize="11" fontWeight="bold">1</text>
              <text x="120" y="275" fill="#334155" fontSize="11">Dấu vết gia công nguội và gờ phân định ranh giới cột văn tự</text>
              
              <line x1="430" y1="250" x2="490" y2="250" stroke="#059669" strokeWidth="1.5" />
              <text x="430" y="270" fill="#059669" fontSize="10">Thước vi mô: 1 ô = 10mm</text>
            </g>
          ) : (
            <g transform="translate(50, 40)">
              <rect x="0" y="0" width="500" height="320" fill="#f8fafc" stroke="#0f766e" strokeWidth="1.5" />
              <text x="250" y="30" textAnchor="middle" fill="#0f766e" fontSize="13" fontWeight="bold">
                BẢN VẼ VI MÔ ĐỒ ÁN HOA VĂN ĐẶC TRƯNG ({artifact.thoiKy.toUpperCase()})
              </text>
              <line x1="30" y1="45" x2="470" y2="45" stroke="#0d9488" strokeWidth="1" />

              {/* Motifs illustration */}
              <circle cx="250" cy="170" r="100" fill="none" stroke="#0d9488" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="250" cy="170" r="70" fill="none" stroke="#b45309" strokeWidth="2" />
              <circle cx="250" cy="170" r="30" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
              
              {/* Star rays or bird motifs */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const x1 = 250 + Math.cos(rad) * 32;
                const y1 = 170 + Math.sin(rad) * 32;
                const x2 = 250 + Math.cos(rad) * 68;
                const y2 = 170 + Math.sin(rad) * 68;
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#b45309" strokeWidth="1.5" />
                );
              })}

              <path d="M 210,135 Q 235,110 265,115 T 290,140" fill="none" stroke="#047857" strokeWidth="1.5" />
              <text x="250" y="295" textAnchor="middle" fill="#475569" fontSize="11">
                {artifact.technicalDrawing.captionDetail}
              </text>
            </g>
          )}
        </svg>
      );
    }

    // Overview Blueprint (CAD/Vector style with dimensions and elevations)
    return (
      <svg viewBox="0 0 600 420" className="w-full h-full">
        <defs>
          <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0f2fe" strokeWidth="0.5" />
          </pattern>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
          </marker>
        </defs>

        <rect width="100%" height="100%" fill="#f8fafc" />
        <rect width="100%" height="100%" fill="url(#cadGrid)" />

        {/* Blueprint Title Header */}
        <g transform="translate(30, 25)">
          <rect x="0" y="0" width="540" height="28" fill="#0f172a" rx="4" />
          <text x="15" y="18" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
            BẢN SỐ HỒ SƠ KIỂM KÊ: {artifact.id} | {artifact.circular05.soDangKyBaoTang}
          </text>
          <text x="525" y="18" textAnchor="end" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            QUY CHUẨN ĐIỀU 14 TT05/2025
          </text>
        </g>

        {/* Specific Object Schematics */}
        {drawingType === 'drum' && (
          <g transform="translate(160, 80)">
            {/* Top tympanum */}
            <ellipse cx="140" cy="50" rx="130" ry="24" fill="#f1f5f9" stroke="#0f766e" strokeWidth="2" />
            <ellipse cx="140" cy="50" rx="90" ry="16" fill="none" stroke="#0d9488" strokeWidth="1" strokeDasharray="3 2" />
            <ellipse cx="140" cy="50" rx="25" ry="6" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
            
            {/* Mantle / Tang trống */}
            <path d="M 10 50 Q 0 90 25 130 L 255 130 Q 280 90 270 50" fill="#f8fafc" stroke="#0f766e" strokeWidth="2" />
            {/* Waist / Thân hình trụ */}
            <rect x="35" y="130" width="210" height="65" fill="#f1f5f9" stroke="#0f766e" strokeWidth="2" />
            {/* Quai kép */}
            <path d="M 25 90 C 10 90 10 140 25 140" fill="none" stroke="#b45309" strokeWidth="3" />
            <path d="M 255 90 C 270 90 270 140 255 140" fill="none" stroke="#b45309" strokeWidth="3" />
            {/* Foot / Chân choè */}
            <path d="M 35 195 L 15 250 L 265 250 L 245 195 Z" fill="#f8fafc" stroke="#0f766e" strokeWidth="2" />
            <ellipse cx="140" cy="250" rx="125" ry="18" fill="none" stroke="#0f766e" strokeWidth="1.5" strokeDasharray="4 2" />
            
            {/* Centerline */}
            <line x1="140" y1="20" x2="140" y2="275" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
          </g>
        )}

        {drawingType === 'bell' && (
          <g transform="translate(180, 80)">
            {/* Dragon Hanger Quai chuông */}
            <path d="M 80 50 C 80 15 160 15 160 50 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
            {/* Bell Crown & Body */}
            <path d="M 60 50 C 65 100 50 200 30 250 L 210 250 C 190 200 175 100 180 50 Z" fill="#f1f5f9" stroke="#0f766e" strokeWidth="2" />
            {/* Inscription Grid gờ chia ô */}
            <line x1="50" y1="120" x2="190" y2="120" stroke="#0d9488" strokeWidth="1.5" />
            <line x1="40" y1="180" x2="200" y2="180" stroke="#0d9488" strokeWidth="1.5" />
            <line x1="120" y1="50" x2="120" y2="250" stroke="#0d9488" strokeWidth="1" strokeDasharray="4 2" />
            {/* Lotus Bosses núm gõ sen */}
            <circle cx="80" cy="205" r="10" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
            <circle cx="160" cy="205" r="10" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
            <ellipse cx="120" cy="250" rx="90" ry="14" fill="none" stroke="#0f766e" strokeWidth="2" />
          </g>
        )}

        {drawingType === 'seal' && (
          <g transform="translate(170, 95)">
            {/* Coiling Dragon Handle */}
            <path d="M 90 90 C 80 40 180 30 170 90 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
            <circle cx="115" cy="55" r="6" fill="#b45309" />
            {/* Seal Base */}
            <polygon points="50,90 210,90 230,120 30,120" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
            <rect x="30" y="120" width="200" height="50" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
            {/* Seal text footprint below */}
            <g transform="translate(60, 185)">
              <rect x="0" y="0" width="140" height="45" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" rx="3" />
              <text x="70" y="28" textAnchor="middle" fill="#dc2626" fontSize="13" fontWeight="bold" fontFamily="serif" letterSpacing="3">
                [ TRIỆN VĂN ]
              </text>
            </g>
          </g>
        )}

        {drawingType === 'stele' && (
          <g transform="translate(190, 80)">
            {/* Dragon Crest / Trán bia lá đề */}
            <path d="M 40 80 C 40 20 180 20 180 80 Z" fill="#f1f5f9" stroke="#0f766e" strokeWidth="2" />
            <circle cx="110" cy="55" r="12" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
            {/* Stele Body / Thân bia */}
            <rect x="40" y="80" width="140" height="170" fill="#f8fafc" stroke="#0f766e" strokeWidth="2" />
            {/* Border lines diềm hoa dây */}
            <rect x="48" y="88" width="124" height="154" fill="none" stroke="#0d9488" strokeWidth="1" strokeDasharray="3 2" />
            {/* Inscription lines */}
            {[105, 120, 135, 150, 165, 180, 195, 210].map((y, idx) => (
              <line key={idx} x1="58" y1={y} x2="162" y2={y} stroke="#94a3b8" strokeWidth="0.8" />
            ))}
            {/* Base bệ rùa/đá */}
            <polygon points="20,250 200,250 215,270 5,270" fill="#e2e8f0" stroke="#0f766e" strokeWidth="1.5" />
          </g>
        )}

        {drawingType === 'jar' && (
          <g transform="translate(170, 75)">
            {/* Lid with mating figures Nắp thạp */}
            <path d="M 40 50 L 220 50 L 205 35 L 55 35 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
            <circle cx="80" cy="25" r="7" fill="#b45309" />
            <circle cx="180" cy="25" r="7" fill="#b45309" />
            {/* Jar body */}
            <path d="M 40 50 L 55 240 L 205 240 L 220 50 Z" fill="#f1f5f9" stroke="#0f766e" strokeWidth="2" />
            {/* Handles quai chữ U */}
            <path d="M 42 100 C 25 100 25 140 45 140" fill="none" stroke="#b45309" strokeWidth="3" />
            <path d="M 218 100 C 235 100 235 140 215 140" fill="none" stroke="#b45309" strokeWidth="3" />
            {/* Decorative bands */}
            <line x1="45" y1="85" x2="215" y2="85" stroke="#0d9488" strokeWidth="1.5" />
            <line x1="48" y1="170" x2="212" y2="170" stroke="#0d9488" strokeWidth="1.5" />
          </g>
        )}

        {drawingType === 'vase' && (
          <g transform="translate(190, 75)">
            {/* Flare mouth miệng loe */}
            <ellipse cx="110" cy="35" rx="45" ry="10" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
            {/* Neck cổ thon */}
            <path d="M 85 35 C 90 70 95 85 70 120 C 35 160 40 210 65 245 L 155 245 C 180 210 185 160 150 120 C 125 85 130 70 135 35" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" />
            {/* Swan pattern placement */}
            <circle cx="110" cy="180" r="32" fill="#fef3c7" stroke="#d97706" strokeWidth="1" strokeDasharray="3 2" />
            <text x="110" y="185" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">HỌA TIẾT THIÊN NGA</text>
            <ellipse cx="110" cy="245" rx="45" ry="8" fill="none" stroke="#0284c7" strokeWidth="1.5" />
          </g>
        )}

        {drawingType === 'goldbook' && (
          <g transform="translate(170, 85)">
            {/* 4 gold leaves stacked */}
            <rect x="40" y="30" width="160" height="210" fill="#fef3c7" stroke="#b45309" strokeWidth="2" rx="4" />
            <rect x="48" y="38" width="144" height="194" fill="#fffbeb" stroke="#d97706" strokeWidth="1" strokeDasharray="2 2" />
            {/* Rings khuyên xỏ */}
            <circle cx="35" cy="70" r="8" fill="none" stroke="#b45309" strokeWidth="2.5" />
            <circle cx="35" cy="135" r="8" fill="none" stroke="#b45309" strokeWidth="2.5" />
            <circle cx="35" cy="200" r="8" fill="none" stroke="#b45309" strokeWidth="2.5" />
            {/* Dragons and characters */}
            <text x="120" y="80" textAnchor="middle" fill="#92400e" fontSize="12" fontFamily="serif">嘉隆五年</text>
            <text x="120" y="120" textAnchor="middle" fill="#92400e" fontSize="12" fontFamily="serif">金冊尊稱</text>
            <text x="120" y="160" textAnchor="middle" fill="#78350f" fontSize="10">LÁ VÀNG DÁT MỎNG</text>
          </g>
        )}

        {drawingType === 'boat' && (
          <g transform="translate(80, 140)">
            {/* Dug-out canoe longitudinal section */}
            <path d="M 20 40 Q 220 75 420 40 L 400 90 Q 220 120 40 90 Z" fill="#f1f5f9" stroke="#0f766e" strokeWidth="2.5" />
            {/* Hollowed inside */}
            <path d="M 35 48 Q 220 70 405 48" fill="none" stroke="#0d9488" strokeWidth="1.5" strokeDasharray="4 2" />
            {/* Bronze grave goods layout */}
            <circle cx="100" cy="75" r="8" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
            <circle cx="210" cy="80" r="12" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
            <rect x="280" y="72" width="40" height="8" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
            <text x="220" y="115" textAnchor="middle" fill="#334155" fontSize="10">HƠN 100 ĐỒ TUỲ TÁNG KIM KHÍ TRONG THÂN GỖ</text>
          </g>
        )}

        {/* General fallback / statue / lamp / manuscript schematics */}
        {!['drum', 'bell', 'seal', 'stele', 'jar', 'vase', 'goldbook', 'boat'].includes(drawingType) && (
          <g transform="translate(190, 80)">
            <rect x="30" y="20" width="160" height="230" fill="#f8fafc" stroke="#0f766e" strokeWidth="2" rx="4" />
            <circle cx="110" cy="80" r="35" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
            <rect x="60" y="130" width="100" height="90" fill="#f1f5f9" stroke="#0d9488" strokeWidth="1" />
            <text x="110" y="180" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="bold">
              {artifact.technicalDrawing.captionOverview}
            </text>
          </g>
        )}

        {/* Dimension Callout Lines (Kích thước kỹ thuật tiêu chuẩn CAD) */}
        {showRuler && (
          <g stroke="#0284c7" strokeWidth="1">
            {/* Height dimension (right side) */}
            <line x1="510" y1="90" x2="510" y2="330" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <line x1="470" y1="90" x2="520" y2="90" stroke="#94a3b8" strokeDasharray="2 2" />
            <line x1="470" y1="330" x2="520" y2="330" stroke="#94a3b8" strokeDasharray="2 2" />
            <text x="525" y="215" fill="#0284c7" fontSize="11" fontWeight="bold" fontFamily="monospace">
              H: {heightMm} mm
            </text>

            {/* Diameter or Width dimension (bottom) */}
            {(diameterMm || widthMm) && (
              <>
                <line x1="160" y1="365" x2="440" y2="365" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                <line x1="160" y1="335" x2="160" y2="375" stroke="#94a3b8" strokeDasharray="2 2" />
                <line x1="440" y1="335" x2="440" y2="375" stroke="#94a3b8" strokeDasharray="2 2" />
                <text x="300" y="385" textAnchor="middle" fill="#0284c7" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {diameterMm ? `Ø: ${diameterMm} mm` : `W: ${widthMm} mm`}
                </text>
              </>
            )}
          </g>
        )}

        {/* Blueprint Stamp Bottom Right */}
        <g transform="translate(40, 350)">
          <rect x="0" y="0" width="190" height="45" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" rx="3" />
          <text x="10" y="16" fill="#64748b" fontSize="9" fontWeight="bold">BẢO TÀNG LỊCH SỬ QUỐC GIA</text>
          <text x="10" y="28" fill="#0f172a" fontSize="10" fontWeight="bold">SƠ ĐỒ TRẮC DIỆN KỸ THUẬT</text>
          <text x="10" y="39" fill="#0284c7" fontSize="9">Tỷ lệ biểu diễn: 1:10 (Vector)</text>
        </g>
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Blueprint Toolbar */}
      <div className="bg-slate-900 text-slate-100 px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-sm tracking-wide">
            KHUNG BẢN VẼ SƠ ĐỒ KỸ THUẬT HIỆN VẬT SỐ
          </span>
          <span className="bg-teal-950 text-teal-300 text-xs px-2 py-0.5 rounded border border-teal-700/60 font-mono">
            {artifact.id}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Switch View: Overview vs Macro Detail */}
          <div className="bg-slate-800 p-0.5 rounded-lg flex border border-slate-700">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'overview'
                  ? 'bg-teal-600 text-white font-medium shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Toàn cảnh kỹ thuật
            </button>
            <button
              onClick={() => setViewMode('detail')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'detail'
                  ? 'bg-teal-600 text-white font-medium shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Cận cảnh minh văn/hoa văn
            </button>
          </div>

          {/* Toggle Dimension Lines */}
          <button
            onClick={() => setShowRuler(!showRuler)}
            title="Bật/Tắt thước đo tỷ lệ"
            className={`p-1.5 rounded border transition-colors ${
              showRuler
                ? 'bg-sky-950 text-sky-400 border-sky-700'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Ruler className="w-4 h-4" />
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 px-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
              disabled={zoomLevel <= 0.7}
              className="p-1 hover:text-white disabled:opacity-30"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1 text-slate-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
              disabled={zoomLevel >= 1.8}
              className="p-1 hover:text-white disabled:opacity-30"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:text-white text-slate-400"
              title="Đặt lại phóng to"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Drawing Viewport */}
      <div className="relative bg-slate-50 min-h-[360px] md:min-h-[420px] flex items-center justify-center p-4 overflow-hidden select-none">
        {/* Missing Rights Guard: Auto-hide and show warning if missing 'Người cho phép công bố' */}
        {!hasPublishingRights ? (
          <div className="w-full max-w-lg p-6 bg-amber-50 border-2 border-dashed border-amber-400 rounded-xl text-center shadow-xs">
            <ShieldAlert className="w-12 h-12 text-amber-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-amber-900 mb-2 uppercase">
              Cảnh báo: Bản ghi chờ xác nhận quyền công bố
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed mb-4">
              Theo quy định tại Điều 14 Thông tư số 05/2025/TT-BVHTTDL và Điều 88 Luật Di sản văn hoá 2024,
              bản ghi hiện vật thiếu trường bắt buộc <strong>"Người cho phép công bố"</strong>.
              Hệ thống đã tự động khóa hiển thị hình ảnh/sơ đồ kỹ thuật cho đến khi có phê duyệt chính thức
              từ Bảo tàng Lịch sử Quốc gia hoặc Cục Di sản văn hoá.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200 text-amber-900 text-xs font-medium rounded-full">
              Trạng thái: 🔒 Khóa hình ảnh bảo vệ di sản
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full max-w-2xl transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {renderSvgDrawing()}
          </div>
        )}
      </div>

      {/* Required Footers: Detailed Caption & Storage Source Note */}
      <div className="bg-slate-50 border-t border-slate-200 p-4 text-xs space-y-2">
        <div className="flex items-start gap-2">
          <FileCheck2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800">Chú thích chi tiết: </span>
            <span className="text-slate-600">
              {viewMode === 'overview'
                ? artifact.technicalDrawing.captionOverview
                : artifact.technicalDrawing.captionDetail}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">Tệp ảnh lưu trữ số hoá: </span>
            <code className="bg-slate-200/70 text-slate-800 px-1.5 py-0.5 rounded font-mono">
              {artifact.technicalDrawing.storageFilename}
            </code>
            <span className="text-emerald-700 font-medium ml-1.5">(&lt; 500KB)</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Nguồn lưu trữ: </span>
            <span>{artifact.technicalDrawing.rawMasterResolution}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic bg-amber-50/70 px-3 py-1.5 rounded border border-amber-200/60">
          * Ghi chú nguồn gốc: {artifact.technicalDrawing.sourceNote}
        </div>
      </div>
    </div>
  );
};
