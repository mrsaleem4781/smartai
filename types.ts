<<<<<<< HEAD

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
=======
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
>>>>>>> ca2656e613e63ed0ca06b1cde5fcaff34e7bfb7d
}

export interface PhotoState {
  original: string | null;
  processed: string | null;
  isProcessing: boolean;
  error: string | null;
}
<<<<<<< HEAD
=======

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
>>>>>>> ca2656e613e63ed0ca06b1cde5fcaff34e7bfb7d
