
import React, { forwardRef, useEffect, useState, useRef } from 'react';
import { PhotoSize, PaperSize } from '../types';
import { Info } from 'lucide-react';

interface LayoutPreviewProps {
  image: string;
  copies: number;
  size: PhotoSize;
  paperSize: PaperSize;
  customWidth?: number;
  customHeight?: number;
}

const LayoutPreview = forwardRef<HTMLDivElement, LayoutPreviewProps>(({ 
  image, 
  copies, 
  size, 
  paperSize,
  customWidth = 35, 
  customHeight = 45 
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const isA4 = paperSize === PaperSize.A4;
  
  const paperWidthMm = isA4 ? 210 : 105;
  const paperHeightMm = isA4 ? 297 : 148;

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const pxPerMm = 3.7795275591;
        const paperWidthPx = paperWidthMm * pxPerMm; 
        if (containerWidth < paperWidthPx) {
          setScale((containerWidth - 60) / paperWidthPx);
        } else {
          setScale(1);
        }
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [paperWidthMm]);

  const getPhotoSizeStyles = (): React.CSSProperties => {
    let width = '35mm';
    let height = '45mm';

    switch (size) {
      case PhotoSize.PASSPORT_PAK:
        width = '35mm';
        height = '45mm';
        break;
      case PhotoSize.PASSPORT_US: 
        width = '50.8mm'; 
        height = '50.8mm'; 
        break;
      case PhotoSize.PASSPORT_EU: 
        width = '35mm';
        height = '45mm';
        break;
      case PhotoSize.CUSTOM:
        width = `${customWidth}mm`;
        height = `${customHeight}mm`;
        break;
    }

    return {
      width,
      height,
      minWidth: width,
      minHeight: height,
      maxWidth: width,
      maxHeight: height,
      overflow: 'hidden',
      // Added subtle cut-guide border
      border: '0.05mm solid #cbd5e1',
      display: 'block',
      margin: '0',
      backgroundColor: '#ffffff'
    };
  };

  // Grid layout logic
  const isLargePhoto = size === PhotoSize.PASSPORT_US;
  const gridColumns = isA4 ? (isLargePhoto ? 3 : 5) : (isLargePhoto ? 2 : 2);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center justify-start overflow-hidden">
        <div 
          className="flex flex-col items-center transition-all duration-700 origin-top"
          style={{ transform: `scale(${scale})` }}
        >
            <div 
              ref={ref}
              style={{
                width: `${paperWidthMm}mm`,
                minHeight: `${paperHeightMm}mm`,
                padding: '12mm',
                backgroundColor: '#ffffff',
                boxShadow: scale < 1 ? 'none' : '0 60px 120px -30px rgba(0, 0, 0, 0.2)'
              }}
              className="print-sheet-inner flex flex-col items-center justify-start overflow-hidden bg-white"
            >
                {/* Print Grid with 2mm gap for cutting */}
                <div 
                  className="grid gap-[2mm] w-full justify-center content-start"
                  style={{
                    gridTemplateColumns: `repeat(${gridColumns}, min-content)`
                  }}
                >
                    {Array.from({ length: copies }).map((_, i) => (
                        <div 
                            key={i} 
                            style={getPhotoSizeStyles()}
                            className="bg-white shrink-0 relative"
                        >
                            <img 
                                src={image} 
                                alt={`Copy ${i + 1}`} 
                                className="w-full h-full block"
                                style={{ 
                                  objectFit: 'cover',
                                  imageRendering: 'high-quality',
                                  display: 'block'
                                }}
                            />
                        </div>
                    ))}
                </div>
                
                {/* Identifier Bar */}
                <div className="mt-auto pt-10 pb-2 w-full flex justify-between items-end border-t border-slate-50 no-print opacity-20">
                   <div className="flex flex-col gap-1">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Smart Passport AI</div>
                      <div className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em]">{size} • {paperSize}</div>
                   </div>
                   <div className="text-[7px] text-slate-400 font-bold uppercase tracking-[0.2em]">HD Professional Layout</div>
                </div>
            </div>
        </div>
        
        {scale < 1 && (
          <div className="mt-10 flex items-center gap-3 no-print bg-white px-8 py-4 rounded-full border border-slate-200 shadow-2xl">
             <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
             <p className="text-[13px] text-slate-600 font-black uppercase tracking-widest">
               Print Preview <span className="text-blue-600">(Optimized)</span>
             </p>
          </div>
        )}
    </div>
  );
});

LayoutPreview.displayName = 'LayoutPreview';

export default LayoutPreview;
