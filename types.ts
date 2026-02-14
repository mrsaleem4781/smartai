export enum PhotoSize {
  PASSPORT_PAK = "35x45mm",
  PASSPORT_US = "2x2in",
  PASSPORT_EU = "35x45mm_EU"
}

export enum PaperSize {
  A4 = "A4 (210x297mm)",
  A6 = "A6 (105x148mm)"
}

export enum BgColor {
  WHITE = "#ffffff",
  LIGHT_BLUE = "#add8e6",
  DARK_BLUE = "#00008b",
  RED = "#ff0000",
  CUSTOM = "custom"
}

export interface PhotoState {
  original: string | null;
  processed: string | null;
  isProcessing: boolean;
  error: string | null;
}

export interface ProcessingOptions {
  size: PhotoSize;
  paperSize: PaperSize;
  bgColor: BgColor | string;
  customColor: string;
  copies: number;
  enhance: boolean;
  smoothness: number;
  sharpness: number;
  customWidth?: number;
  customHeight?: number;
}