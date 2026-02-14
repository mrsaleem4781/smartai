import React, { useState, useRef, ChangeEvent } from 'react';
import Header from './components/Header';
import LayoutPreview from './components/LayoutPreview';
import React, { useState, useRef, ChangeEvent, forwardRef } from 'react';
// Types ko check karein ke ye file majood ho (niche di gayi hai)
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
  X, 
  Paperclip, 
  Sparkles, 
  CheckCircle2,
  Maximize2,
  Image as ImageIcon,
  Palette
} from 'lucide-react';

type LayoutPreviewProps = {
  image: string;
  copies: number;
  size: PhotoSize;
  paperSize: PaperSize;
};

const PHOTO_DIMENSIONS: Record<PhotoSize, { widthMm: number; heightMm: number }> = {
  [PhotoSize.PASSPORT_PAK]: { widthMm: 35, heightMm: 45 },
  [PhotoSize.PASSPORT_EU]: { widthMm: 35, heightMm: 45 },
  [PhotoSize.PASSPORT_US]: { widthMm: 51, heightMm: 51 },
};

const PAPER_DIMENSIONS: Record<PaperSize, { widthMm: number; heightMm: number }> = {
  [PaperSize.A4]: { widthMm: 210, heightMm: 297 },
  [PaperSize.A6]: { widthMm: 105, heightMm: 148 },
};

const MM_TO_PX = 3.78;

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-400/20">
            <Check className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight">Smart AI Passport Photo Maker</h1>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Studio Quality • Print Ready</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-300">
          <Sparkles className="w-4 h-4 text-blue-300" />
          AI Assisted Retouching
        </div>
      </div>
    </header>
  );
};

const LayoutPreview = forwardRef<HTMLDivElement, LayoutPreviewProps>(({ image, copies, size, paperSize }, ref) => {
  const photo = PHOTO_DIMENSIONS[size];
  const paper = PAPER_DIMENSIONS[paperSize];

  const photoWidthPx = Math.round(photo.widthMm * MM_TO_PX);
  const photoHeightPx = Math.round(photo.heightMm * MM_TO_PX);
  const cols = Math.max(1, Math.floor((paper.widthMm * MM_TO_PX - 40) / (photoWidthPx + 12)));

  return (
    <div
      ref={ref}
      className="print-sheet rounded-2xl p-6 bg-white border border-slate-200"
      style={{ width: Math.round(paper.widthMm * MM_TO_PX), minHeight: Math.round(paper.heightMm * MM_TO_PX) }}
    >
      <div
        className="grid gap-3 justify-center"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(${photoWidthPx}px, ${photoWidthPx}px))` }}
      >
        {Array.from({ length: copies }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded border border-slate-200 bg-slate-100"
            style={{ width: photoWidthPx, height: photoHeightPx }}
          >
            <img src={image} alt={`Processed ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
});

LayoutPreview.displayName = 'LayoutPreview';

const enhanceAndProcessImage = async (
  originalImage: string,
  _backgroundColor: string,
  _enhance: boolean,
  _smoothness: number,
  _sharpness: number
): Promise<string> => {
  if (!originalImage) {
    throw new Error('No image selected.');
  }

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error('Unable to load selected image.'));
    element.src = originalImage;
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas rendering is not available in this browser.');
  }

  context.filter = 'contrast(1.02) saturate(1.04)';
  context.drawImage(img, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.96);
};

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
index.html
index.html
+0
-1

@@ -32,32 +32,31 @@
            .print-sheet {
                position: absolute;
                left: 0;
                top: 0;
                box-shadow: none;
                margin: 0;
                visibility: visible !important;
            }
            .print-sheet * {
                visibility: visible !important;
            }
        }
    </style>
<script type="importmap">
{
  "imports": {
    "react/": "https://esm.sh/react@^19.2.4/",
    "react": "https://esm.sh/react@^19.2.4",
    "@google/genai": "https://esm.sh/@google/genai@^1.41.0",
    "lucide-react": "https://esm.sh/lucide-react@^0.563.0",
    "react-dom/": "https://esm.sh/react-dom@^19.2.4/",
    "html2canvas": "https://esm.sh/html2canvas@^1.4.1"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
<body>
    <div id="root"></div>
<script type="module" src="/index.tsx"></script>
</body>
</html>
text-xs font-black uppercase">Error</span>
            <span className="text-sm font-medium">{photo.error}</span>
          </div>
          <button onClick={() => setPhoto({...photo, error: null})} className="ml-4 p-1 hover:bg-white/20 rounded-lg"><X className="w-5 h-5"/></button>
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> ca2656e613e63ed0ca06b1cde5fcaff34e7bfb7d
