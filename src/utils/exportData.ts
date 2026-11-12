import { ArtifactRecord } from '../types/tulieu';

export const getExportTimestamp = (): string => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const exportToJson = (data: any, prefix = 'phieu_hien_vat_so_tt05') => {
  const timestamp = getExportTimestamp();
  const filename = `${prefix}_${timestamp}.json`;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCsv = (artifacts: ArtifactRecord[], prefix = 'phieu_hien_vat_so_tt05') => {
  const timestamp = getExportTimestamp();
  const filename = `${prefix}_${timestamp}.csv`;

  const headers = [
    'Mã định danh (Identifier)',
    'Số ĐK bảo tàng (LSb)',
    'Tiêu đề (Title)',
    'Thời kỳ lịch sử',
    'Niên đại (Date)',
    'Chất liệu & Kích thước (Format)',
    'Loại bản hiển thị',
    'Tình trạng bản gốc',
    'Mức kiểm chứng',
    'Nơi lưu giữ hiện nay (Cấp 1 & 2)',
    'Nơi lưu giữ trước 01/7/2025',
    'Người cho phép công bố',
    'Văn bản pháp lý liên quan (Relation)'
  ];

  const rows = artifacts.map((item) => [
    `"${item.id}"`,
    `"${item.circular05.soDangKyBaoTang}"`,
    `"${item.dublinCore.title.replace(/"/g, '""')}"`,
    `"${item.thoiKy}"`,
    `"${item.dublinCore.date.replace(/"/g, '""')}"`,
    `"${item.dublinCore.format.replace(/"/g, '""')}"`,
    `"${item.circular05.loaiBanHienThi}"`,
    `"${item.circular05.tinhTrangBanGoc}"`,
    `"${item.circular05.mucKiemChung}"`,
    `"${item.circular05.noiLuuGiuHienNay2Cap.cap1CoSo} - ${item.circular05.noiLuuGiuHienNay2Cap.cap2HanhChinh}"`,
    `"${item.circular05.noiLuuGiuTruoc}"`,
    `"${item.circular05.nguoiChoPhepCongBo.replace(/"/g, '""')}"`,
    `"${item.dublinCore.relation.replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateCitation = (item: ArtifactRecord): string => {
  return `Bảo tàng Lịch sử Quốc gia (2026). Phiếu hiện vật số [${item.id}]: ${item.dublinCore.title} (Số kiểm kê: ${item.circular05.soDangKyBaoTang}). Lưu giữ tại ${item.circular05.noiLuuGiuHienNay2Cap.cap1CoSo}, ${item.circular05.noiLuuGiuHienNay2Cap.cap2HanhChinh}. Pháp lý: ${item.dublinCore.relation}. Công bố học thuật theo Điều 88 Luật Di sản văn hoá 2024.`;
};
