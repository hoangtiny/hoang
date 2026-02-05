
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
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[50%] bg-red-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[120%] h-[50%] bg-amber-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <header className="relative z-50 px-4 py-5 md:px-12 md:py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={reset}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:rotate-6 transition-transform">
            <ChefHat className="text-white w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 uppercase tracking-widest leading-none">
               Miresto
            </h1>
            <span className="text-[7px] md:text-[9px] text-slate-500 font-black uppercase tracking-[0.25em]">AI Master Chef Experience</span>
          </div>
        </div>
        
        {step !== "HOME" && step !== "PROCESSING" && (
          <button 
            onClick={reset} 
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 border border-white/10 backdrop-blur-md active:scale-90 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col z-10 w-full max-w-7xl mx-auto px-4 md:px-12 pb-10">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6 text-red-400 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-4 backdrop-blur-md">
            <X className="w-4 h-4 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {step === "HOME" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in zoom-in-95 duration-1000 py-10">
            <div className="space-y-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">The Future of Dining</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-display font-bold leading-[1] tracking-tight">
                MIX VỊ <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-red-500 to-red-600">CẢM XÚC</span>
              </h2>
              <p className="text-slate-400 text-base md:text-xl max-w-xl mx-auto font-medium leading-relaxed italic opacity-80 px-2">
                Biến chân dung của bạn thành Siêu đầu bếp Miresto và sáng tạo tuyệt phẩm Nhật Bản dành riêng cho tâm hồn.
              </p>
            </div>
            
            <button 
              onClick={() => setStep("KEYWORD_SELECT")}
              className="group relative bg-white text-slate-950 w-full md:w-auto px-10 py-5 rounded-full font-black text-base md:text-lg flex items-center justify-center gap-3 hover:bg-amber-500 transition-all tracking-widest shadow-2xl active:scale-95"
            >
              KHÁM PHÁ NGAY <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {step === "KEYWORD_SELECT" && (
          <div className="max-w-5xl mx-auto w-full py-2 md:py-8 space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
                {/* 1. Upload Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/20 text-blue-500">
                        <Camera className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">1. Tải chân dung</h3>
                  </div>
                  
                  <div className={`relative w-full aspect-[4/3] rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${
                      previewUrl ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-800 bg-slate-900/50'
                    }`}
                  >
                    {previewUrl ? (
                      <div className="relative w-full h-full group">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex gap-2">
                           <button onClick={() => cameraInputRef.current?.click()} className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest">Chụp lại</button>
                           <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest">Chọn ảnh</button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6 space-y-6 w-full">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-600">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col gap-3 max-w-xs mx-auto">
                          <button onClick={() => cameraInputRef.current?.click()} className="bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all font-black text-[11px] uppercase tracking-widest shadow-lg shadow-red-900/20 active:scale-95">
                            <Camera className="w-4 h-4" /> Chụp ảnh mới
                          </button>
                          <button onClick={() => fileInputRef.current?.click()} className="bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all font-black text-[11px] uppercase tracking-widest active:scale-95">
                            <Upload className="w-4 h-4" /> Tải từ thư viện
                          </button>
                        </div>
                      </div>
                    )}
                    <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="user" onChange={handleFileChange} />
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                </section>

                <div className="space-y-8">
                    {/* 2. Moods Section */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-red-600/20 flex items-center justify-center border border-red-500/20 text-red-500">
                            <Zap className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">2. Tâm trạng bạn?</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {MOODS.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setSelectedMood(selectedMood === m.id ? null : m.id)}
                            className={`py-3.5 px-1 rounded-xl border flex flex-col items-center gap-1.5 transition-all duration-300 ${
                              selectedMood === m.id ? "bg-red-600 border-red-400 text-white shadow-lg shadow-red-900/40" : "bg-slate-900/60 border-slate-800 text-slate-500"
                            }`}
                          >
                            <span className="text-xl">{m.icon}</span>
                            <span className="text-[8px] font-black uppercase tracking-tighter">{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </section>

                    {/* 3. Ingredients Section */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-600/20 flex items-center justify-center border border-amber-500/20 text-amber-500">
                            <UtensilsCrossed className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">3. Bạn muốn ăn gì?</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {INGREDIENTS.map((i) => (
                          <button
                            key={i.id}
                            onClick={() => toggleIngredient(i.id)}
                            className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all duration-300 ${
                              selectedIngredients.includes(i.id) ? "bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-900/40" : "bg-slate-900/60 border-slate-800 text-slate-500"
                            }`}
                          >
                            <span className="text-2xl">{i.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{i.label}</span>
                          </button>
                        ))}
                      </div>
                    </section>

                    <div className="pt-2">
                        <button 
                            disabled={(!selectedMood && selectedIngredients.length === 0) || !selfieData}
                            onClick={startProcessing}
                            className="group w-full bg-white text-slate-950 py-5 rounded-2xl font-black text-base shadow-xl hover:bg-amber-500 transition-all tracking-[0.2em] disabled:opacity-20 flex items-center justify-center gap-3 active:scale-95"
                        >
                            CHẾ TÁC NGAY <Sparkles className="w-5 h-5 fill-amber-500 text-amber-500" />
                        </button>
                        {!selfieData && (
                          <p className="text-center mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest italic opacity-60">Hãy tải ảnh để bắt đầu</p>
                        )}
                    </div>
                </div>
            </div>
          </div>
        )}

        {step === "PROCESSING" && (
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-12 animate-in fade-in py-10">
            <div className="relative">
              <div className="w-48 h-48 border-4 border-slate-800 border-t-red-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 m-auto w-24 h-24 bg-gradient-to-br from-red-600/20 to-amber-600/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/5">
                <ChefHat className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>
            <div className="space-y-4 max-w-xs">
              <h3 className="text-2xl font-display font-bold italic text-amber-500">Master Chef is cooking...</h3>
              <p className="text-slate-400 text-sm italic font-medium opacity-75 leading-relaxed">"{LOADING_MESSAGES[loadingMsgIdx]}"</p>
            </div>
          </div>
        )}

        {step === "RESULT" && result && (
          <div className="max-w-4xl mx-auto w-full py-2 animate-in fade-in duration-700">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 items-start">
                {/* Visual Section */}
                <section className="w-full space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/90 text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-lg">
                        <Award className="w-3.5 h-3.5" /> Tuyệt tác của bạn
                    </div>
                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
                        <img 
                          src={result.imageUrl} 
                          alt={result.drinkName} 
                          className="w-full h-full object-cover"
                        />
                    </div>
                </section>

                {/* Info Section */}
                <div className="w-full flex flex-col gap-6">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight italic text-amber-100 drop-shadow-md">
                            {result.drinkName}
                        </h2>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
                            <p className="text-slate-300 text-lg md:text-xl italic leading-relaxed font-medium">
                                "{result.description}"
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-950/30 to-slate-900/50 p-6 md:p-8 rounded-3xl border border-red-500/10 space-y-6 shadow-xl">
                        <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                            <div className="font-bold text-red-200 text-xs md:text-sm uppercase tracking-wide">Menu Match: {result.realMenuMatch}</div>
                            <div className="bg-amber-500 text-slate-950 px-3 py-1 rounded-lg font-black text-sm">
                                -20%
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 bg-slate-950/60 p-6 rounded-2xl border-2 border-dashed border-slate-800 text-center">
                            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Mã Ưu Đãi</span>
                            <strong className="text-4xl md:text-5xl text-amber-500 tracking-tighter font-black">{result.voucherCode}</strong>
                        </div>

                        <button 
                             onClick={() => window.open('https://hatoyama.vn/dat-ban', '_blank')}
                             className="w-full bg-white text-slate-950 py-4.5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-amber-500 transition-all uppercase tracking-widest shadow-lg active:scale-95"
                        >
                             ĐẶT BÀN NGAY <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleDownload} className="bg-red-600 text-white py-4 rounded-xl font-black text-[10px] flex items-center justify-center gap-2 uppercase tracking-widest shadow-md">
                            <Download className="w-4 h-4" /> Lưu Ảnh
                        </button>
                        <button onClick={reset} className="bg-slate-900 border border-white/10 text-white py-4 rounded-xl font-black text-[10px] flex items-center justify-center gap-2 uppercase tracking-widest">
                            <RefreshCcw className="w-4 h-4" /> Làm mới
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="relative z-10 px-4 py-8 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 items-center opacity-30">
          <div className="flex items-center gap-2">
            <ChefHat className="w-3.5 h-3.5" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">Miresto AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
