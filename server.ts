import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Load artifact documentation for Gemini grounding
const tulieuPath = path.resolve(__dirname, 'src/data/tulieu.json');
let tulieuDataRaw = '';
try {
  tulieuDataRaw = fs.readFileSync(tulieuPath, 'utf-8');
} catch {
  tulieuDataRaw = '[]';
}

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper: Search tulieuData directly if upstream AI has transient spike
function searchTulieuDirectly(query: string) {
  try {
    const data = JSON.parse(tulieuDataRaw);
    const artifacts = data.artifacts || [];
    const q = query.toLowerCase();

    const matched = artifacts.find((a: any) =>
      a.id.toLowerCase() === q ||
      a.circular05.soDangKyBaoTang.toLowerCase() === q ||
      a.dublinCore.title.toLowerCase().includes(q) ||
      q.includes(a.dublinCore.title.toLowerCase()) ||
      (a.dublinCore.title.toLowerCase().includes('ngọc lũ') && q.includes('ngọc lũ')) ||
      (a.dublinCore.title.toLowerCase().includes('hoàng hạ') && q.includes('hoàng hạ')) ||
      (a.dublinCore.title.toLowerCase().includes('đào thịnh') && q.includes('đào thịnh')) ||
      (a.dublinCore.title.toLowerCase().includes('cảnh thịnh') && q.includes('cảnh thịnh')) ||
      (a.dublinCore.title.toLowerCase().includes('vân bản') && q.includes('vân bản')) ||
      (a.dublinCore.title.toLowerCase().includes('bảo ân') && (q.includes('bảo ân') || q.includes('báo ân') || q.includes('sùng thiện'))) ||
      (a.dublinCore.title.toLowerCase().includes('việt khê') && q.includes('việt khê')) ||
      (a.dublinCore.title.toLowerCase().includes('thiên nga') && (q.includes('thiên nga') || q.includes('cù lao chàm'))) ||
      (a.dublinCore.title.toLowerCase().includes('nguyễn chúa') && (q.includes('vĩnh trấn') || q.includes('nguyễn chúa'))) ||
      (a.dublinCore.title.toLowerCase().includes('kim sách') && (q.includes('kim sách') || q.includes('gia long'))) ||
      (a.dublinCore.title.toLowerCase().includes('sắc mệnh') && q.includes('sắc mệnh')) ||
      (a.dublinCore.title.toLowerCase().includes('đường kách mệnh') && (q.includes('đường kách mệnh') || q.includes('nguyễn ái quốc'))) ||
      (a.dublinCore.title.toLowerCase().includes('lời kêu gọi') && (q.includes('kháng chiến') || q.includes('lời kêu gọi') || q.includes('toàn quốc kháng chiến')))
    );

    if (matched) {
      return `Thông tin trích lục từ Sổ đăng ký Phiếu hiện vật số Bảo tàng Lịch sử Quốc gia:

- **Mã định danh:** ${matched.id}
- **Số đăng ký bảo tàng:** ${matched.circular05.soDangKyBaoTang}
- **Nơi lưu giữ hiện nay:** ${matched.circular05.noiLuuGiuHienNay2Cap.cap1CoSo}, ${matched.circular05.noiLuuGiuHienNay2Cap.cap2HanhChinh}
- **Loại bản đang hiển thị:** ${matched.circular05.loaiBanHienThi}

**Tên hiện vật:** ${matched.dublinCore.title}
**Thời kỳ / Niên đại:** ${matched.thoiKy} (${matched.dublinCore.date})
**Chất liệu & Kích thước:** ${matched.dublinCore.format}
**Mô tả:** ${matched.dublinCore.description}
**Nguồn gốc xuất xứ:** ${matched.dublinCore.source}
**Cơ quan cho phép công bố:** ${matched.circular05.nguoiChoPhepCongBo}
**Văn bản pháp lý:** ${matched.dublinCore.relation}`;
    }

    return "Hiện chưa có tư liệu đã kiểm chứng về nội dung này trong Sổ đăng ký Phiếu hiện vật số của ứng dụng. Ứng dụng tuyệt đối không tự suy đoán niên đại hay thông tin hiện vật.";
  } catch {
    return "Hiện chưa có tư liệu đã kiểm chứng về nội dung này trong Sổ đăng ký Phiếu hiện vật số của ứng dụng. Ứng dụng tuyệt đối không tự suy đoán niên đại hay thông tin hiện vật.";
  }
}

// API 1: Chatbot & Q&A about the 15 artifacts
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Nội dung câu hỏi không hợp lệ' });
    return;
  }

  // Attempt Gemini API with retry and automatic fallback
  try {
    if (!apiKey) {
      // Use tulieu.json direct lookup
      const fallbackReply = searchTulieuDirectly(message);
      res.json({ reply: fallbackReply });
      return;
    }

    const systemInstruction = `
Bạn là Trợ lý Kiểm kê số học thuật của Đề tài F01 - "Phiếu hiện vật số theo Thông tư 05/2025" tại Bảo tàng Lịch sử Quốc gia.
Toàn bộ kiến thức của bạn về 15 Bảo vật quốc gia và hiện vật BẮT BUỘC chỉ được rút ra từ tệp dữ liệu tulieu.json sau đây:
\`\`\`json
${tulieuDataRaw}
\`\`\`

RÀNG BUỘC PHÁP LÝ & BẢO TÀNG HỌC NGHIÊM NGẶT:
1. NẾU KHÔNG TÌM THẤY THÔNG TIN TRONG TỆP DỮ LIỆU tulieu.json, BẠN BẮT BUỘC TRẢ LỜI NGUYÊN VĂN CÂU NÀY (KHÔNG THÊM BỚT BẤT KỲ TỪ NÀO):
"Hiện chưa có tư liệu đã kiểm chứng về nội dung này trong Sổ đăng ký Phiếu hiện vật số của ứng dụng. Ứng dụng tuyệt đối không tự suy đoán niên đại hay thông tin hiện vật."

2. KHI TRẢ LỜI VỀ BẤT KỲ HIỆN VẬT NÀO TRONG 15 HIỆN VẬT, MỖI CÂU TRẢ LỜI BẮT BUỘC KÈM THEO 4 TRƯỜNG THÔNG TIN NÀY Ở ĐẦU HOẶC CUỐI CÂU TRẢ LỜI THEO ĐÚNG ĐỊNH DẠNG:
- **Mã định danh:** [Mã F01-xxxxx]
- **Số đăng ký bảo tàng:** [LSb.xxxxx]
- **Nơi lưu giữ hiện nay:** [Cấp 1 & Cấp 2: Bảo tàng Lịch sử Quốc gia, Phường Cửa Nam, thành phố Hà Nội]
- **Loại bản đang hiển thị:** [Bản số của bản gốc hoặc Bản số của bản sao]

3. Luôn giữ phong cách học thuật bảo tàng, chuẩn mực tiếng Việt, khách quan, chính xác theo Luật Di sản văn hoá 2024 và Thông tư 05/2025/TT-BVHTTDL.
    `.trim();

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.role && item.text) {
          contents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.text }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction,
      },
    });

    res.json({
      reply: response.text || '',
    });
  } catch (error: any) {
    console.warn('Gemini Chat upstream busy, switching to tulieu.json verified search:', error?.message);
    const fallbackReply = searchTulieuDirectly(message);
    res.json({ reply: fallbackReply });
  }
});

// API 2: Epigraphy Analysis (Hán Nôm / văn khắc)
app.post('/api/gemini/epigraphy', async (req: Request, res: Response) => {
  const { artifactId, originalText, contextNote } = req.body;
  if (!artifactId) {
    res.status(400).json({ error: 'Mã hiện vật không được để trống' });
    return;
  }

  try {
    if (!apiKey) {
      throw new Error('Chưa cấu hình API key');
    }

    const systemInstruction = `
Bạn là chuyên gia thẩm định văn tự Hán Nôm và minh văn kim thạch học cổ Đại Việt tại Bảo tàng Lịch sử Quốc gia.
Dữ liệu 15 hiện vật chuẩn nằm trong tệp tulieu.json sau:
\`\`\`json
${tulieuDataRaw}
\`\`\`

NHIỆM VỤ:
Phân tích văn tự minh văn Hán Nôm hoặc đề xuất bản nháp phiên âm, dịch nghĩa, khảo dị niên hiệu và các thuật ngữ Phật giáo/hoàng triều.
RÀNG BUỘC BẮT BUỘC:
1. Mọi kết quả phân tích PHẢI gắn nhãn thông báo kiểm chứng:
"Bản đề xuất chưa kiểm - Cần chuyên gia Hán Nôm xác nhận"
2. Trình bày khoa học gồm 4 phần:
- 1. Chữ Hán nguyên bản (Khảo dị từng tự nếu có)
- 2. Bản phiên âm Hán - Việt tiêu chuẩn
- 3. Bản dịch nghĩa sang tiếng Việt hiện đại
- 4. Chú giải niên hiệu, chức quan, địa danh và giá trị lịch sử
3. Nếu hiện vật không có văn tự Hán Nôm trong tulieu.json, hãy thông báo: "Hiện vật này trong Sổ kiểm kê không mang minh văn Hán Nôm."
    `.trim();

    const prompt = `Phân tích minh văn văn tự cho hiện vật mang mã [${artifactId}].
Nguyên văn chữ Hán (nếu có bổ sung): "${originalText || 'Theo hồ sơ tulieu.json'}"
Ghi chú người kiểm kê: "${contextNote || 'Đề nghị phân tích niên hiệu và ngữ nghĩa cúng dường/sắc mệnh'}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    res.json({
      analysis: response.text || '',
      verificationTag: 'Bản đề xuất chưa kiểm - Cần chuyên gia Hán Nôm xác nhận',
      tagColor: 'yellow',
    });
  } catch (error: any) {
    console.warn('Gemini Epigraphy fallback:', error?.message);
    // Find artifact in tulieuData
    const data = JSON.parse(tulieuDataRaw);
    const item = (data.artifacts || []).find((a: any) => a.id === artifactId);

    if (item && item.hanNom) {
      const fallbackAnalysis = `1. CHỮ HÁN NGUYÊN BẢN (TRÍCH SỔ ĐĂNG KÝ KIỂM KÊ):
${item.hanNom.originalText}

2. BẢN PHIÊN ÂM HÁN - VIỆT TIÊU CHUẨN:
${item.hanNom.transliteration}

3. BẢN DỊCH NGHĨA SANG TIẾNG VIỆT HIỆN ĐẠI:
${item.hanNom.translation}

4. CHÚ GIẢI LỊCH SỬ & GIÁ TRỊ VĂN KHẮC:
- Hiện vật: ${item.dublinCore.title} (Số kiểm kê: ${item.circular05.soDangKyBaoTang})
- Niên đại: ${item.dublinCore.date}
- Ghi chú thẩm định: ${item.hanNom.notes}
- Quy chuẩn thẩm định: Lưu ý cần hội đồng chuyên gia Viện Nghiên cứu Hán Nôm xác nhận dập thác bản trước khi hiệu đính chính thức vào Sổ đăng ký quốc gia.`;

      res.json({
        analysis: fallbackAnalysis,
        verificationTag: 'Bản đề xuất chưa kiểm - Cần chuyên gia Hán Nôm xác nhận',
        tagColor: 'yellow',
      });
      return;
    }

    res.json({
      analysis: `Hiện vật mang mã [${artifactId}] trong Sổ kiểm kê không mang minh văn Hán Nôm hoặc chưa có văn bản rập thác bản được ghi nhận.`,
      verificationTag: 'Bản đề xuất chưa kiểm - Cần chuyên gia Hán Nôm xác nhận',
      tagColor: 'yellow',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bảo tàng số F01 server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
