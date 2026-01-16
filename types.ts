
export enum ObfuscationLevel {
  LOW = 'Low (Minify)',
  MEDIUM = 'Medium (Encode Strings)',
  HIGH = 'High (AI Logic Scrambling)',
}

export interface ObfuscationResult {
  originalSize: number;
  newSize: number;
  obfuscatedCode: string;
  technique: string;
  explanation: string;
}
