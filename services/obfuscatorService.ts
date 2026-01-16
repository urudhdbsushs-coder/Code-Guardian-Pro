
import { ObfuscationLevel, ObfuscationResult } from "../types";

const minify = (code: string): string => {
  return code
    .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
};

const hexEncode = (str: string): string => {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += '\\x' + str.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return result;
};

const base64Encode = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

export const obfuscateLocally = (
  code: string,
  level: ObfuscationLevel
): ObfuscationResult => {
  const originalSize = new Blob([code]).size;
  let obfuscatedCode = '';
  let explanation = '';
  let technique = '';

  switch (level) {
    case ObfuscationLevel.LOW:
      obfuscatedCode = minify(code);
      technique = 'Standard Minification';
      explanation = 'এই মোডে আপনার কোড থেকে সব কমেন্ট এবং বাড়তি স্পেস সরিয়ে ফেলা হয়। এটি কোডের সাইজ কমায় কিন্তু পড়ার জন্য খুব একটা কঠিন নয়।';
      break;

    case ObfuscationLevel.MEDIUM:
      const minified = minify(code);
      // Simple string splitting and hex encoding for scripts inside HTML
      obfuscatedCode = minified.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g, (match, scriptContent) => {
        const encoded = hexEncode(scriptContent);
        return `<script>eval("${encoded}")</script>`;
      });
      technique = 'Hex Script Injection';
      explanation = 'এখানে কোড মিনিফাই করার পাশাপাশি জাভাস্ক্রিপ্ট কোডকে হেক্স (Hex) ফরম্যাটে এনকোড করা হয়। এটি সাধারণ চোরদের থেকে আপনার লজিক কিছুটা সুরক্ষিত রাখবে।';
      break;

    case ObfuscationLevel.HIGH:
      // Wrap the entire HTML in a base64 decoder
      const b64 = base64Encode(code);
      obfuscatedCode = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>document.write(decodeURIComponent(escape(atob("${b64}"))));</script></body></html>`;
      technique = 'Full Base64 Wrapper';
      explanation = 'এটি সবচেয়ে শক্তিশালী মোড। আপনার পুরো কোডকে একটি এনক্রিপ্টেড লেয়ারে মুড়ে ফেলা হয়। ব্রাউজার এটি রান করতে পারলেও একজন মানুষের পক্ষে সোর্স কোড থেকে আসল লজিক বের করা অত্যন্ত কঠিন।';
      break;
  }

  return {
    originalSize,
    newSize: new Blob([obfuscatedCode]).size,
    obfuscatedCode,
    technique,
    explanation,
  };
};
