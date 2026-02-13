
export enum PhotoSize {
  PASSPORT_PAK = 'Pakistani Passport (2x2")',
  PASSPORT_US = 'US Standard (2x2")',
  PASSPORT_EU = 'EU/Global (35x45mm)',
  CUSTOM = 'Custom Size'
}

export enum PaperSize {
  A6 = 'A6 (105x148mm)',
  A4 = 'A4 (210x297mm)'
}

export enum BgColor {
  WHITE = '#FFFFFF',
  LIGHT_BLUE = '#ADD8E6',
  DARK_BLUE = '#003399',
  RED = '#FF0000',
  CUSTOM = 'custom'
}

export interface ProcessingOptions {
  size: PhotoSize;
  paperSize: PaperSize;
  bgColor: string;
  customColor: string;
  copies: number;
  enhance: boolean;
  smoothness: number; // 0-100
  sharpness: number;  // 0-100
  customWidth: number;
  customHeight: number;
}

export interface PhotoState {
  original: string | null;
  processed: string | null;
  isProcessing: boolean;
  error: string | null;
}
