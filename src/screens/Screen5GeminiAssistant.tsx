import React, { useState } from 'react';
import { ArtifactRecord } from '../types/tulieu';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Save,
  Clock,
  ShieldCheck,
  RefreshCw,
  MessageSquare
} from 'lucide-react';

interface Props {
  artifacts: ArtifactRecord[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const Screen5GeminiAssistant: React.FC<Props> = ({ artifacts }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'epigraphy'>('chat');

  // --- FUNCTION 1: CHAT STATE ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Xin kính chào Cán bộ kiểm kê và Quý nhà nghiên cứu! Tôi là Trợ lý Kiểm kê số theo Thông tư 05/2025. 
Toàn bộ câu trả lời của tôi được kiểm chứng nghiêm ngặt và chỉ dựa trên Sổ đăng ký 15 Bảo vật quốc gia của Bảo tàng Lịch sử Quốc gia (tulieu.json).
Mọi phản hồi về hiện vật sẽ luôn cung cấp đầy đủ: Mã định danh, Số đăng ký bảo tàng, Nơi lưu giữ và Loại bản đang hiển thị. Xin mời Quý vị đặt câu hỏi!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Suggested questions for quick test
  const suggestedQuestions = [
    'Cho biết kích thước và niên đại của Trống đồng Ngọc Lũ?',
    'Ấn vàng "Sắc mệnh chi bảo" nặng bao nhiêu và được đúc vào năm nào?',
    'Kim sách triều Nguyễn niên hiệu Gia Long thứ 5 có cấu tạo ra sao?',
    'Chuông chùa Vân Bản được tìm thấy ở đâu và có đặc điểm gì nổi bật?',
    'Cho biết thông tin về tháp Eiffel của Pháp?' // Test out-of-scope question to verify strict fallback!
  ];

  const handleSendMessage = async (userPrompt?: string) => {
    const question = (userPrompt || inputQuestion).trim();
    if (!question || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsChatLoading(true);

    try {
      const history = chatMessages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, history })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi kết nối máy chủ');
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.reply || '',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `Lỗi kết nối Trợ lý AI: ${err.message}. Vui lòng thử lại.`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- FUNCTION 2: EPIGRAPHY & HÁN NÔM PROPOSAL STATE ---
  // Filter artifacts having Hán Nôm or epigraphy
  const hanNomArtifacts = artifacts.filter(
    (a) => a.hanNom || ['F01-00006', 'F01-00007', 'F01-00008', 'F01-00011', 'F01-00012', 'F01-00013'].includes(a.id)
  );

  const [selectedEpigraphyId, setSelectedEpigraphyId] = useState<string>(
    hanNomArtifacts[0]?.id || 'F01-00006'
  );
  const [expertNoteInput, setExpertNoteInput] = useState<string>('');
  const [isEpigraphyLoading, setIsEpigraphyLoading] = useState<boolean>(false);
  const [epigraphyResult, setEpigraphyResult] = useState<{
    analysis: string;
    tag: string;
  } | null>(null);

  // Editable Draft Text for the expert (Constraint: does NOT overwrite original data)
  const [editableExpertDraft, setEditableExpertDraft] = useState<string>('');
  const [savedExpertNotes, setSavedExpertNotes] = useState<
    { artifactId: string; note: string; date: string }[]
  >([]);
  const [noteSavedFeedback, setNoteSavedFeedback] = useState<boolean>(false);

  const currentEpigraphyArtifact = artifacts.find((a) => a.id === selectedEpigraphyId);

  const handleRunEpigraphyAnalysis = async () => {
    if (!currentEpigraphyArtifact || isEpigraphyLoading) return;
    setIsEpigraphyLoading(true);

    try {
      const res = await fetch('/api/gemini/epigraphy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artifactId: currentEpigraphyArtifact.id,
          originalText: currentEpigraphyArtifact.hanNom?.originalText || '',
          contextNote: expertNoteInput || 'Phân tích văn khắc Hán Nôm và dịch nghĩa'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi phân tích văn khắc');
      }

      setEpigraphyResult({
        analysis: data.analysis,
        tag: data.verificationTag || 'Bản đề xuất chưa kiểm - Cần chuyên gia Hán Nôm xác nhận'
      });
      // Initialize the editable draft box with the AI output
      setEditableExpertDraft(data.analysis);
    } catch (err: any) {
      alert(`Lỗi phân tích: ${err.message}`);
    } finally {
      setIsEpigraphyLoading(false);
    }
  };

  const handleSaveExpertReview = () => {
    if (!editableExpertDraft.trim()) return;

    setSavedExpertNotes((prev) => [
      {
        artifactId: selectedEpigraphyId,
        note: editableExpertDraft,
        date: new Date().toLocaleString('vi-VN')
      },
      ...prev
    ]);
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title & Description */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h1 className="text-2xl font-extrabold text-slate-900 font-serif">
            Trợ Lý Kiểm Kê & Phiên Âm Cùng Gemini
          </h1>
        </div>
        <p className="text-xs text-slate-600">
          Công cụ hỗ trợ cán bộ kiểm kê tra cứu hồ sơ 15 Bảo vật quốc gia và đề xuất đọc/phiên âm minh văn Hán Nôm
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'chat'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chức năng 1: Hỏi đáp hồ sơ kiểm kê (tulieu.json)</span>
        </button>

        <button
          onClick={() => setActiveTab('epigraphy')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'epigraphy'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Chức năng 2: Đề xuất đọc minh văn Hán Nôm & Gán nhãn</span>
        </button>
      </div>

      {/* CHỨC NĂNG 1: HỎI ĐÁP HỒ SƠ KIỂM KÊ */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          {/* Rules Banner */}
          <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl text-xs text-teal-950 space-y-1">
            <div className="flex items-center gap-2 font-bold text-teal-900">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Ràng buộc pháp lý & Bảo tàng học đối với Trợ lý Gemini:</span>
            </div>
            <p className="text-teal-900/90 leading-relaxed">
              1. Mọi câu trả lời bắt buộc trích xuất trực tiếp từ <strong>tulieu.json</strong> và kèm theo:
              <strong> Mã định danh, Số đăng ký bảo tàng, Nơi lưu giữ</strong> và <strong>Loại bản đang hiển thị</strong>.
            </p>
            <p className="text-teal-900/90 leading-relaxed">
              2. Nếu không có thông tin trong tệp dữ liệu, Gemini bắt buộc trả lời nguyên văn:
              <em className="text-amber-900 font-semibold block mt-0.5">
                "Hiện chưa có tư liệu đã kiểm chứng về nội dung này trong Sổ đăng ký Phiếu hiện vật số của ứng dụng. Ứng dụng tuyệt đối không tự suy đoán niên đại hay thông tin hiện vật."
              </em>
            </p>
          </div>

          {/* Quick Suggested Question Chips */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-2">
              Câu hỏi tra cứu gợi ý kiểm tra nhanh:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isChatLoading}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 text-slate-700 text-xs rounded-lg border border-slate-200 text-left transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
            {/* Messages list */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-amber-600 text-white'
                        : 'bg-teal-900 text-teal-200'
                    }`}
                  >
                    {msg.role === 'user' ? 'Tôi' : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-amber-700 text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex gap-3 max-w-xl mr-auto">
                  <div className="w-8 h-8 rounded-full bg-teal-900 text-teal-200 flex items-center justify-center shrink-0 animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-2xs text-xs text-slate-500 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-700" />
                    <span>Đang tra cứu cơ sở dữ liệu tulieu.json...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Đặt câu hỏi về 15 Bảo vật quốc gia tại BTLSQG..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputQuestion.trim() || isChatLoading}
                className="px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Gửi câu hỏi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHỨC NĂNG 2: HỖ TRỢ CHUẨN HOÁ & ĐỀ XUẤT ĐỌC MINH VĂN HÁN NÔM */}
      {activeTab === 'epigraphy' && (
        <div className="space-y-6">
          {/* Instruction & Select Artifact */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              1. Chọn hiện vật có văn tự / minh văn Hán Nôm cần thẩm định:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hiện vật:
                </label>
                <select
                  value={selectedEpigraphyId}
                  onChange={(e) => {
                    setSelectedEpigraphyId(e.target.value);
                    setEpigraphyResult(null);
                    setEditableExpertDraft('');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-teal-700"
                >
                  {hanNomArtifacts.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.id}] {item.dublinCore.title} ({item.circular05.soDangKyBaoTang})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Yêu cầu / Ghi chú khảo cứu cho Gemini:
                </label>
                <input
                  type="text"
                  value={expertNoteInput}
                  onChange={(e) => setExpertNoteInput(e.target.value)}
                  placeholder="Ví dụ: Phân tích niên hiệu và ngữ nghĩa cúng dường..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-teal-700"
                />
              </div>
            </div>

            {/* Currently Selected Artifact Epigraphy Summary */}
            {currentEpigraphyArtifact && (
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-1.5">
                <p className="font-bold text-stone-900">
                  Dữ liệu minh văn đã lưu trong Sổ kiểm kê:
                </p>
                <p>
                  <strong>Chữ Hán: </strong>
                  <span className="font-serif text-sm font-medium text-stone-900">
                    {currentEpigraphyArtifact.hanNom?.originalText || '(Chưa có bản ghi văn tự)'}
                  </span>
                </p>
                <p>
                  <strong>Phiên âm hiện tại: </strong>
                  <span className="italic text-stone-700">
                    {currentEpigraphyArtifact.hanNom?.transliteration || 'Chưa cập nhật'}
                  </span>
                </p>
              </div>
            )}

            <button
              onClick={handleRunEpigraphyAnalysis}
              disabled={isEpigraphyLoading}
              className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              {isEpigraphyLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang phân tích văn khắc cổ...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>Khởi chạy Gemini phân tích & đề xuất phiên âm</span>
                </>
              )}
            </button>
          </div>

          {/* Epigraphy Result Area */}
          {epigraphyResult && (
            <div className="space-y-4">
              {/* Mandatory Yellow Badge Requirement */}
              <div className="p-4 bg-amber-100 border-2 border-amber-400 rounded-xl flex items-center gap-3 shadow-xs">
                <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" />
                <div>
                  <div className="inline-block px-3 py-0.5 bg-amber-300 text-amber-950 font-bold rounded text-xs uppercase tracking-wide mb-1 border border-amber-400">
                    {epigraphyResult.tag}
                  </div>
                  <p className="text-xs text-amber-900 leading-normal">
                    Kết quả dưới đây do Trợ lý Gemini đề xuất tự động dựa trên thư tịch cổ.
                    Theo quy chuẩn kiểm kê, nội dung này <strong>KHÔNG tự động ghi đè vào dữ liệu gốc</strong>.
                    Chuyên gia Hán Nôm cần rà soát và lưu biên bản thẩm định riêng.
                  </p>
                </div>
              </div>

              {/* Editable Text Area for the Expert */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase">
                    <Edit3 className="w-4 h-4 text-teal-700" />
                    <span>Ô văn bản để người kiểm định chỉnh sửa (Không ghi đè dữ liệu gốc):</span>
                  </div>
                  <button
                    onClick={handleSaveExpertReview}
                    className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu ghi chú thẩm định</span>
                  </button>
                </div>

                <textarea
                  rows={12}
                  value={editableExpertDraft}
                  onChange={(e) => setEditableExpertDraft(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-lg text-xs md:text-sm font-mono text-slate-800 leading-relaxed focus:bg-white focus:ring-2 focus:ring-teal-700"
                />

                {noteSavedFeedback && (
                  <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã lưu biên bản thẩm định chuyên gia vào phiên làm việc!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Saved Expert Notes during the session */}
          {savedExpertNotes.length > 0 && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Nhật ký thẩm định của chuyên gia trong phiên ({savedExpertNotes.length}):
              </h4>
              <div className="space-y-3">
                {savedExpertNotes.map((note, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="font-mono font-bold text-teal-800">{note.artifactId}</span>
                      <span>{note.date}</span>
                    </div>
                    <pre className="text-slate-800 whitespace-pre-wrap font-sans text-xs pt-1">
                      {note.note.slice(0, 300)}...
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
