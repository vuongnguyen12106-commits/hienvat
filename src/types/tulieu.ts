export interface DublinCoreRecord {
  title: string;          // Tiêu đề / Tên hiện vật
  creator: string;        // Tác giả / Nghệ nhân chế tác
  subject: string;        // Chủ đề / Từ khóa
  description: string;    // Mô tả chi tiết hình dáng, đặc điểm
  publisher: string;      // Đơn vị công bố / quản lý
  contributor: string;    // Người đóng góp / Đơn vị khai quật
  date: string;           // Niên đại / Thời gian
  type: string;           // Loại hình hiện vật
  format: string;         // Chất liệu, kích thước, trọng lượng
  identifier: string;     // Mã định danh phiếu (F01-xxxxx)
  source: string;         // Nguồn gốc xuất xứ / Địa điểm tìm thấy
  language: string;       // Ngôn ngữ minh văn / văn bản
  relation: string;       // Văn bản pháp lý liên quan (QĐ Thủ tướng)
  coverage: string;       // Phạm vi không gian và thời gian
  rights: string;         // Quyền sử dụng và bản quyền
}

export interface Circular05Record {
  noiLuuGiuHienNay2Cap: {
    cap1CoSo: string;      // Cấp 1: Cơ sở bảo tàng
    cap2HanhChinh: string;  // Cấp 2: Đơn vị hành chính cấp xã/tỉnh
  };
  noiLuuGiuTruoc: string;  // Nơi lưu giữ tại thời điểm tư liệu (trước 01/7/2025)
  loaiBanHienThi: 'Bản số của bản gốc' | 'Bản số của bản sao';
  tinhTrangBanGoc: 'Tốt' | 'Hư hại nhẹ' | 'Có vết nứt bảo quản' | 'Đã gia cố';
  soDangKyBaoTang: string; // Số đăng ký kiểm kê tại bảo tàng (LSb.xxxx)
  nguoiChoPhepCongBo: string; // Cơ quan / Người cho phép công bố
  phanKhongCongBo: string; // Phần không công bố / bảo mật
  mucKiemChung: 'Đã kiểm' | 'Chưa kiểm' | 'Chưa đọc được';
}

export interface TechnicalDrawingMeta {
  drawingType: 'drum' | 'bell' | 'stele' | 'seal' | 'goldbook' | 'statue' | 'lamp' | 'jar' | 'boat' | 'vase' | 'book' | 'manuscript';
  heightMm: number;
  diameterMm?: number;
  widthMm?: number;
  weightG?: number;
  storageFilename: string; // e.g. F01-00001-anh-01.jpg (<500KB)
  rawMasterResolution: string; // e.g. "Bản gốc 24MP lưu tại Kho số hoá BTLSQG"
  captionOverview: string;
  captionDetail: string;
  sourceNote: string;
}

export interface ArtifactRecord {
  id: string; // e.g. "F01-00001"
  thoiKy: 'Đông Sơn' | 'Lý' | 'Trần' | 'Lê' | 'Tây Sơn' | 'Nguyễn' | 'Hiện đại';
  dublinCore: DublinCoreRecord;
  circular05: Circular05Record;
  technicalDrawing: TechnicalDrawingMeta;
  hanNom?: {
    originalText: string;
    transliteration: string; // Phiên âm
    translation: string;     // Dịch nghĩa
    notes: string;
    isVerified: boolean;
  };
}
