import React, { useState, useRef, ChangeEvent } from 'react';
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
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
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
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto({ original: event.target?.result as string, processed: null, isProcessing: false, error: null });
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!photo.original) return;
    setPhoto(prev => ({ ...prev, isProcessing: true, error: null }));
    try {
      const colorToUse = options.bgColor === BgColor.CUSTOM ? options.customColor : options.bgColor;
      const result = await enhanceAndProcessImage(photo.original, colorToUse, options.enhance, options.smoothness, options.sharpness);
      setPhoto(prev => ({ ...prev, processed: result, isProcessing: false }));
      setStep(2);
    } catch (err: any) {
      setPhoto(prev => ({ ...prev, isProcessing: false, error: "AI processing failed. Please try again." }));
    }
  };

  const downloadFullSheet = async () => {
    if (!printRef.current || isExporting) return;
    setIsExporting(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      const canvas = await html2canvas(printRef.current, { scale: 3, useCORS: true, backgroundColor: '#FFFFFF' });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `Passport_Sheet.png`;
      link.click();
    } catch (err) {
      setPhoto(prev => ({ ...prev, error: "Download failed." }));
    } finally {
      setIsExporting(false);
    }
  };

  const reset = () => {
    setPhoto({ original: null, processed: null, isProcessing: false, error: null });
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {step === 1 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Maximize2 className="text-blue-600 w-6 h-6" /> Configure HD Passport
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 p-8 space-y-8">
                <div 
                  onClick={() => !photo.original && fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${photo.original ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400'}`}
                >
                  {photo.original ? (
                    <div className="relative">
                      <img src={photo.original} className="w-40 h-52 object-cover rounded-lg shadow-xl border-4 border-white" alt="Original" />
                      <button onClick={(e) => { e.stopPropagation(); reset(); }} className="absolute -top-4 -right-4 p-2 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-blue-600 font-bold">Click to Upload Photo</p>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase">Skin Smoothing ({options.smoothness}%)</label>
                      <input type="range" min="0" max="100" value={options.smoothness} onChange={(e) => setOptions({...options, smoothness: parseInt(e.target.value)})} className="w-full" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase">Detail Sharpness ({options.sharpness}%)</label>
                      <input type="range" min="0" max="100" value={options.sharpness} onChange={(e) => setOptions({...options, sharpness: parseInt(e.target.value)})} className="w-full" />
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {[BgColor.WHITE, BgColor.LIGHT_BLUE, BgColor.DARK_BLUE].map(c => (
                    <button key={c} onClick={() => setOptions({...options, bgColor: c})} className={`w-10 h-10 rounded-full border-4 ${options.bgColor === c ? 'border-blue-600' : 'border-white shadow'}`} style={{backgroundColor: c}} />
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-50 p-8 border-l border-gray-100">
                <div className="space-y-4">
                   <h4 className="font-bold text-slate-700">Instructions:</h4>
                   <ul className="text-sm text-slate-500 space-y-2">
                     <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Face the camera directly</li>
                     <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Use good lighting</li>
                   </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-900">
               <button 
                onClick={processImage}
                disabled={!photo.original || photo.isProcessing}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-xl flex items-center justify-center gap-4 disabled:opacity-50"
               >
                 {photo.isProcessing ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                 {photo.isProcessing ? 'Processing...' : 'Enhance & Generate'}
               </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm no-print">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 font-bold"><ChevronLeft /> Back</button>
                <div className="flex gap-4">
                  <button onClick={downloadFullSheet} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700">
                    <Download className="w-4 h-4" /> Save Sheet
                  </button>
                  <button onClick={() => window.print()} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2">
                    <Printer className="w-4 h-4" /> Print
                  </button>
                </div>
             </div>

             <div className="flex justify-center bg-slate-200 p-10 rounded-3xl overflow-auto">
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

      {photo.error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 p-4 bg-red-600 text-white rounded-xl shadow-2xl flex items-center gap-3">
          <AlertCircle /> {photo.error}
          <button onClick={() => setPhoto({...photo, error: null})}><X /></button>
        </div>
      )}
    </div>
  );
};

export default App;