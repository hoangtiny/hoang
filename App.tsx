
import { 
  Sparkles, 
  ArrowRight, 
  RefreshCcw, 
  Share2, 
  X,
  CheckCircle2,
  UtensilsCrossed,
  ChefHat,
  Flame,
  Award,
  Zap,
  ChevronRight,
  Camera,
  Upload,
  Image as ImageIcon,
  Download,
  Plus
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Mood, Ingredient, MixResult, Step } from './types';
import { MOODS, INGREDIENTS, LOADING_MESSAGES } from './constants';
import { generateMix } from './services/geminiService';

const BRAND_LOGO_URL = ""; 

const App: React.FC = () => {
  const [step, setStep] = useState<Step>("HOME");
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [selfieData, setSelfieData] = useState<{ data: string; mimeType: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [result, setResult] = useState<MixResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: number;
    if (step === "PROCESSING") {
      interval = window.setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const toggleIngredient = (ing: Ingredient) => {
    setSelectedIngredients(prev => 
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      setSelfieData({ data: base64, mimeType: file.type });
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startProcessing = async () => {
    setStep("PROCESSING");
    try {
      const data = await generateMix({ 
        mood: selectedMood || undefined, 
        ingredients: selectedIngredients,
        imagePart: selfieData ? { inlineData: selfieData } : undefined
      });
      setResult(data);
      setStep("RESULT");
    } catch (err) {
      console.error(err);
      setError("Hệ thống AI đang bận. Vui lòng thử lại sau giây lát.");
      setStep("KEYWORD_SELECT");
    }
  };

  const handleDownload = () => {
    if (!result?.imageUrl) return;
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `Miresto-tuyet-tac-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setStep("HOME");
    setSelectedMood(null);
    setSelectedIngredients([]);
    setSelfieData(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col relative overflow-x-hidden text-slate-50 font-sans selection:bg-red-500/30">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <header className="relative z-50 px-5 py-6 md:px-12 md:py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 md:gap-4 cursor-pointer group" onClick={reset}>
          <div className="w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-amber-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl shadow-red-600/20 group-hover:rotate-12 transition-transform">
            <ChefHat className="text-white w-5 h-5 md:w-7 md:h-7" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-400 uppercase tracking-[0.2em] leading-none">
               Miresto
            </h1>
            <span className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Trải nghiệm trí tuệ nhân tạo</span>
          </div>
        </div>
        
        {step !== "HOME" && step !== "PROCESSING" && (
          <button 
            onClick={reset} 
            className="p-2.5 md:p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 border border-white/5 backdrop-blur-xl"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col z-10 w-full max-w-7xl mx-auto px-5 md:px-12 pb-12">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl mb-6 text-red-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300 backdrop-blur-md">
            <X className="w-4 h-4 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {step === "HOME" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 md:space-y-12 animate-in fade-in duration-1000 py-6 md:py-12">
            <div className="space-y-6 md:space-y-8 max-w-4xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Tinh hoa ẩm thực Nhật Bản</span>
              </div>
              <h2 className="text-4xl md:text-8xl font-display font-bold leading-[1.1] tracking-tight">
                MIX VỊ <br className="md:hidden" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-red-500 to-red-700">CẢM XÚC</span>
              </h2>
              <p className="text-slate-400 text-base md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed italic opacity-80 px-4">
                "Biến chân dung của bạn thành Siêu đầu bếp Miresto và sáng tạo tuyệt phẩm ẩm thực dành riêng cho tâm hồn."
              </p>
            </div>
            
            <button 
              onClick={() => setStep("KEYWORD_SELECT")}
              className="group relative bg-white text-slate-950 px-10 md:px-14 py-5 md:py-6 rounded-full font-black text-lg md:text-xl flex items-center justify-center gap-4 hover:bg-amber-500 transition-all tracking-[0.2em] shadow-2xl active:scale-95"
            >
              KHÁM PHÁ NGAY <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}

        {step === "KEYWORD_SELECT" && (
          <div className="max-w-6xl mx-auto w-full py-4 md:py-12 space-y-10 animate-in slide-in-from-bottom duration-700">
            <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
                <section className="lg:col-span-5 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/30 text-blue-500">
                        <Camera className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-tight">1. Tải chân dung</h3>
                  </div>
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`group relative w-full aspect-[4/3] lg:aspect-[4/5] rounded-[2rem] md:rounded-[3rem] border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                      previewUrl ? 'border-amber-500 bg-amber-500/5 shadow-xl' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    }`}
                  >
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="w-10 h-10 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-800/80 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto text-slate-500 group-hover:scale-105 transition-transform shadow-inner">
                          <Upload className="w-7 h-7 md:w-9 md:h-9" />
                        </div>
                        <p className="font-black text-slate-300 text-sm md:text-base uppercase tracking-widest">Chụp hoặc Chọn ảnh</p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="user" onChange={handleFileChange} />
                  </div>
                </section>

                <div className="lg:col-span-7 space-y-10">
                    <section className="space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center border border-red-500/30 text-red-500">
                            <Zap className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-tight">2. Tâm trạng hiện tại?</h3>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
                        {MOODS.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setSelectedMood(selectedMood === m.id ? null : m.id)}
                            className={`p-3 md:p-4 rounded-xl md:rounded-2xl border flex flex-col items-center gap-1.5 transition-all duration-300 ${
                              selectedMood === m.id ? "bg-red-600 border-red-400 text-white shadow-lg" : "bg-slate-900/40 border-slate-800 text-slate-500"
                            }`}
                          >
                            <span className="text-xl md:text-2xl">{m.icon}</span>
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider">{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-600/20 flex items-center justify-center border border-amber-500/30 text-amber-500">
                            <UtensilsCrossed className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-tight">3. Bạn muốn ăn gì?</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {INGREDIENTS.map((i) => (
                          <button
                            key={i.id}
                            onClick={() => toggleIngredient(i.id)}
                            className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border flex flex-col items-center gap-3 md:gap-4 transition-all duration-300 ${
                              selectedIngredients.includes(i.id) ? "bg-amber-600 border-amber-400 text-white shadow-lg" : "bg-slate-900/40 border-slate-800 text-slate-500"
                            }`}
                          >
                            <span className="text-3xl md:text-4xl">{i.icon}</span>
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{i.label}</span>
                          </button>
                        ))}
                      </div>
                    </section>

                    <div className="pt-4 md:pt-6">
                        <button 
                            disabled={!selectedMood && selectedIngredients.length === 0 && !selfieData}
                            onClick={startProcessing}
                            className="group w-full bg-white text-slate-950 py-6 md:py-8 rounded-full font-black text-xl md:text-2xl shadow-xl hover:bg-amber-500 transition-all tracking-[0.2em] disabled:opacity-20 flex items-center justify-center gap-4"
                        >
                            CHẾ TÁC NGAY <Sparkles className="w-6 h-6 fill-amber-500 text-amber-500" />
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}

        {step === "PROCESSING" && (
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-10 animate-in fade-in py-12">
            <div className="relative">
              <div className="w-48 h-48 md:w-64 md:h-64 border-[6px] md:border-[8px] border-red-500/10 border-t-red-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 m-auto w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-red-600/30 to-amber-600/30 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl">
                <ChefHat className="w-12 h-12 md:w-16 md:h-16 text-white animate-pulse" />
              </div>
            </div>
            <div className="space-y-4 px-6">
              <h3 className="text-3xl md:text-5xl font-display font-bold italic text-amber-500">Đang chế tác...</h3>
              <p className="text-slate-400 text-lg md:text-xl italic opacity-70">"{LOADING_MESSAGES[loadingMsgIdx]}"</p>
            </div>
          </div>
        )}

        {step === "RESULT" && result && (
          <div className="max-w-7xl mx-auto w-full py-4 md:py-8 animate-in fade-in duration-1000 pb-24">
            <div className="grid lg:grid-cols-12 gap-8 md:gap-16 items-start">
                <section className="lg:col-span-7 space-y-4 md:space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600/90 text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-lg">
                            <Award className="w-3.5 h-3.5" /> Tuyệt tác dành riêng cho bạn
                        </div>
                    </div>
                    <div className="relative rounded-[2rem] md:rounded-[4rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl">
                        <img 
                          src={result.imageUrl} 
                          alt={result.drinkName} 
                          className="w-full h-auto object-cover block"
                        />
                    </div>
                </section>

                <div className="lg:col-span-5 flex flex-col gap-8 md:gap-12">
                    <section className="space-y-6">
                        <h2 className="text-4xl md:text-7xl font-display font-bold leading-tight italic text-amber-50 drop-shadow-lg">
                            {result.drinkName}
                        </h2>
                        <div className="bg-white/5 border border-white/5 p-7 md:p-10 rounded-[1.5rem] md:rounded-[3rem] backdrop-blur-xl">
                            <p className="text-slate-200 text-lg md:text-2xl italic leading-relaxed font-medium">
                                "{result.description}"
                            </p>
                        </div>
                    </section>

                    <section className="bg-gradient-to-br from-red-950/40 to-slate-900 p-7 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-red-500/20 space-y-8 shadow-2xl">
                        <div className="bg-black/40 p-5 rounded-2xl border border-white/5 flex justify-between items-center">
                            <div className="font-bold text-red-100 text-sm md:text-lg leading-snug">{result.realMenuMatch}</div>
                            <div className="bg-amber-500 text-slate-950 px-4 py-2 rounded-lg font-black text-xl shadow-lg">
                                -20%
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-3 bg-slate-950/80 p-6 md:p-8 rounded-[1.5rem] border-2 border-dashed border-slate-800 text-center">
                            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest opacity-60">Mã Ưu Đãi</span>
                            <strong className="text-4xl md:text-6xl text-amber-500 tracking-widest font-black">{result.voucherCode}</strong>
                        </div>

                        <button 
                             onClick={() => alert("Đang kết nối hệ thống đặt bàn...")}
                             className="w-full bg-white text-slate-950 py-5 rounded-full font-black text-lg flex items-center justify-center gap-3 hover:bg-amber-500 transition-all uppercase tracking-widest"
                        >
                             ĐẶT BÀN NGAY <ChevronRight className="w-5 h-5" />
                        </button>
                    </section>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <button onClick={handleDownload} className="bg-red-600 text-white py-5 rounded-2xl font-black text-[10px] md:text-xs flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> LƯU ẢNH AI
                        </button>
                        <button onClick={reset} className="bg-slate-900 border border-white/10 text-white py-5 rounded-2xl font-black text-[10px] md:text-xs flex items-center justify-center gap-2">
                            <RefreshCcw className="w-4 h-4" /> CHẾ TÁC LẠI
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
