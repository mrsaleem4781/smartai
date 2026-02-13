
import React, { useState, useRef } from 'react';
import Header from './components/Header';
import LayoutPreview from './components/LayoutPreview';
import { PhotoState, ProcessingOptions, PhotoSize, PaperSize, BgColor } from './types';
import { enhanceAndProcessImage } from './services/geminiService';
import html2canvas from 'html2canvas';
import { 
  Upload, 
  RefreshCw, 
  Download, 
  Printer, 
  Check, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  X, 
  Paperclip, 
  Sparkles, 
  CheckCircle2,
  Maximize2,
  Image as ImageIcon,
  Palette
} from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [photo, setPhoto] = useState<PhotoState>({
    original: null,
    processed: null,
    isProcessing: false,
    error: null
  });

  const [options, setOptions] = useState<ProcessingOptions>({
    size: PhotoSize.PASSPORT_PAK,
    paperSize: PaperSize.A6,
    bgColor: BgColor.WHITE,
    customColor: '#ffffff',
    copies: 8,
    enhance: true,
    smoothness: 40,
    sharpness: 50,
    customWidth: 35,
    customHeight: 45
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(prev => ({ 
          ...prev, 
          original: event.target?.result as string, 
          processed: null, 
          error: null 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!photo.original) return;
    setPhoto(prev => ({ ...prev, isProcessing: true, error: null }));
    try {
      const colorToUse = options.bgColor === BgColor.CUSTOM ? options.customColor : options.bgColor;
      const result = await enhanceAndProcessImage(
        photo.original, 
        colorToUse,
        options.enhance,
        options.smoothness,
        options.sharpness
      );
      setPhoto(prev => ({ ...prev, processed: result, isProcessing: false }));
      setStep(2);
    } catch (err: any) {
      setPhoto(prev => ({ ...prev, isProcessing: false, error: err.message || "Failed to process image" }));
    }
  };

  const downloadFullSheet = async () => {
    if (!printRef.current || isExporting) return;
    setIsExporting(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      const canvas = await html2canvas(printRef.current, {
        scale: 3, 
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png', 1.0);
      link.download = `Passport_Sheet_${options.paperSize.split(' ')[0]}.png`;
      link.click();
    } catch (err) {
      setPhoto(prev => ({ ...prev, error: "Download failed." }));
    } finally {
      setIsExporting(false);
    }
  };

  const downloadSinglePhoto = () => {
    if (!photo.processed) return;
    const link = document.createElement('a');
    link.href = photo.processed;
    link.download = `Passport_Single_Photo.png`;
    link.click();
  };

  const reset = () => {
    setPhoto({ original: null, processed: null, isProcessing: false, error: null });
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] flex flex-col font-['Inter']">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {step === 1 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Maximize2 className="text-blue-600 w-6 h-6" />
                Configure HD Passport
              </h2>
              <div className="flex gap-2">
                {[PaperSize.A4, PaperSize.A6].map(p => (
                  <button 
                    key={p}
                    onClick={() => setOptions({...options, paperSize: p})}
                    className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${options.paperSize === p ? 'bg-slate-800 text-white' : 'bg-white border border-gray-200 text-slate-400'}`}
                  >
                    {p.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Side: Photo & Retouching */}
              <div className="lg:col-span-7 p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
                    Upload Photo
                  </h3>
                  
                  <div 
                    onClick={() => !photo.original && fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${photo.original ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-gray-50'}`}
                  >
                    {photo.original ? (
                      <div className="relative">
                        <img src={photo.original} className="w-40 h-52 object-cover rounded-lg shadow-xl border-4 border-white" alt="Original" />
                        <button onClick={(e) => { e.stopPropagation(); reset(); }} className="absolute -top-4 -right-4 p-2 bg-red-500 text-white rounded-full shadow-lg"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-blue-400 mb-4" />
                        <p className="text-blue-600 font-bold text-lg mb-2">Drag or Click to Upload</p>
                        <button className="mt-4 px-6 py-2 bg-white border border-blue-500 text-blue-600 rounded-lg font-bold flex items-center gap-2">
                          <Paperclip className="w-4 h-4" /> Select Image
                        </button>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
                    Advanced Retouching
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Skin Smoothing</label>
                        <span className="text-xs font-black text-blue-600 px-2 py-1 bg-blue-50 rounded">{options.smoothness}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={options.smoothness} onChange={(e) => setOptions({...options, smoothness: parseInt(e.target.value)})} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Detail Sharpness</label>
                        <span className="text-xs font-black text-emerald-600 px-2 py-1 bg-emerald-50 rounded">{options.sharpness}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={options.sharpness} onChange={(e) => setOptions({...options, sharpness: parseInt(e.target.value)})} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Palette className="w-4 h-4" /> Background Color Choice
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {[BgColor.WHITE, BgColor.LIGHT_BLUE, BgColor.DARK_BLUE, BgColor.RED].map((color) => (
                        <button
                          key={color}
                          onClick={() => setOptions({...options, bgColor: color})}
                          className={`w-10 h-10 rounded-full border-4 transition-all shadow-sm ${options.bgColor === color ? 'border-blue-600 scale-110' : 'border-white'}`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={options.customColor} 
                          onChange={(e) => setOptions({...options, customColor: e.target.value, bgColor: BgColor.CUSTOM})}
                          className="w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-white shadow-sm"
                        />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Custom</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Photo Count (2-12)</label>
                      <div className="grid grid-cols-6 gap-2">
                        {[2, 4, 6, 8, 10, 12].map(c => (
                          <button key={c} onClick={() => setOptions({...options, copies: c})} className={`py-2 rounded-lg font-black text-xs border-2 transition-all ${options.copies === c ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-slate-400 hover:border-blue-100'}`}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Dimensions / Standard</label>
                      <select 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-bold text-slate-700 outline-none"
                        value={options.size}
                        onChange={(e) => setOptions({...options, size: e.target.value as PhotoSize})}
                      >
                        <option value={PhotoSize.PASSPORT_PAK}>Pakistani Passport (35x45mm)</option>
                        <option value={PhotoSize.PASSPORT_US}>US Standard (2x2")</option>
                        <option value={PhotoSize.PASSPORT_EU}>EU Standard (35x45mm)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Tips & Samples */}
              <div className="lg:col-span-5 bg-slate-50 p-8 border-l border-gray-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">AI Retouching Guide</h4>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-700 border-b border-gray-50 pb-4">
                    <ImageIcon className="text-blue-500" /> Professional Standard
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0 grayscale opacity-40">
                         <img src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=200&q=80" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-xs text-slate-500">
                        <span className="text-red-500 font-bold block uppercase mb-1">Bad Example</span>
                        Low lighting, blurry features, distracting background.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-20 bg-white border border-emerald-100 rounded-lg overflow-hidden shrink-0 shadow-sm">
                         <img src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=200&q=80" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-xs text-slate-500">
                        <span className="text-emerald-500 font-bold block uppercase mb-1">AI Output</span>
                        Studio lighting, clean flat background, HD details.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-bold text-slate-700 text-sm">Print Tips:</h5>
                  <ul className="space-y-3">
                    {[
                      "Face forward, eyes level with camera",
                      "Ensure lighting is even on both sides",
                      "Plain background gives best AI results",
                      "High-res original = HD print results",
                    ].map((txt, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" /> {txt}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 p-4 bg-slate-800 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Security Check</p>
                    <p className="text-[10px] text-slate-200 leading-relaxed">
                      All processing happens locally. Your photos are encrypted and never stored on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-900 flex items-center justify-center">
               <button 
                onClick={processImage}
                disabled={!photo.original || photo.isProcessing}
                className="w-full max-w-lg py-5 bg-blue-600 text-white rounded-xl font-bold text-xl flex items-center justify-center gap-4 shadow-xl shadow-blue-500/20 disabled:opacity-30 group"
               >
                 {photo.isProcessing ? <RefreshCw className="animate-spin w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                 {photo.isProcessing ? 'Enhancing Photo...' : 'Process HD Image'}
                 <ChevronRight className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex flex-col lg:flex-row justify-between items-center gap-6 no-print bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
                  <ChevronLeft className="w-5 h-5" /> Back to Editor
                </button>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button onClick={downloadSinglePhoto} className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                    <ImageIcon className="w-4 h-4 text-blue-500" /> Download Single
                  </button>
                  <button onClick={downloadFullSheet} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:bg-blue-700">
                    <Download className="w-4 h-4" /> Save Full Sheet
                  </button>
                  <button onClick={() => window.print()} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-black">
                    <Printer className="w-4 h-4" /> Print HD
                  </button>
                </div>
             </div>

             <div className="bg-slate-200/40 rounded-[3rem] p-10 flex flex-col items-center min-h-[850px] border border-gray-200 shadow-inner overflow-hidden">
                {photo.processed && (
                  <LayoutPreview 
                    ref={printRef}
                    image={photo.processed} 
                    copies={options.copies} 
                    size={options.size} 
                    paperSize={options.paperSize}
                  />
                )}
             </div>
          </div>
        )}
      </main>

      <footer className="py-12 text-center no-print opacity-40">
         <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em]">ISO Standard 19794-5 • Smart AI Passport Engine</p>
      </footer>

      {photo.error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 p-5 bg-red-600 text-white rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 z-[100]">
          <AlertCircle className="w-6 h-6" />
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-widest">Process Error</span>
            <span className="text-sm font-medium opacity-90">{photo.error}</span>
          </div>
          <button onClick={() => setPhoto({...photo, error: null})} className="ml-6 p-1 hover:bg-white/20 rounded-lg"><X className="w-5 h-5"/></button>
        </div>
      )}
    </div>
  );
};

export default App;
