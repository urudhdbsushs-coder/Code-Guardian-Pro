
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Editor } from './components/Editor';
import { ObfuscationLevel, ObfuscationResult } from './types';
import { obfuscateLocally } from './services/obfuscatorService';

const App: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>('<!-- Example Code -->\n<section class="hero">\n  <h1>Premium Website Protection</h1>\n  <p>Protect your intellectual property with one click.</p>\n  <script>\n    const APP_SECRET = "88-JK-2025";\n    function init() {\n      console.log("System Initialized...");\n      alert("Code Protected!");\n    }\n    init();\n  </script>\n</section>');
  const [level, setLevel] = useState<ObfuscationLevel>(ObfuscationLevel.MEDIUM);
  const [result, setResult] = useState<ObfuscationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Premium Voice Feedback Helper
  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Try to find a high-quality Bengali voice if available
      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find(v => v.lang.includes('bn') || v.lang.includes('BN'));
      if (bnVoice) {
        utterance.voice = bnVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleProtect = useCallback(() => {
    if (!inputCode.trim()) {
      const errorMsg = "দয়া করে আপনার কোডটি এখানে পেস্ট করুন।";
      const voiceMsg = "দয়া করে আপনার কোড পেশ করুন";
      setError(errorMsg);
      speakFeedback(voiceMsg);
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    setTimeout(() => {
      try {
        const output = obfuscateLocally(inputCode, level);
        setResult(output);
      } catch (err: any) {
        setError("কোড প্রোটেকশন ব্যর্থ হয়েছে। কোডের ফরম্যাট চেক করুন।");
      } finally {
        setIsProcessing(false);
      }
    }, 400);
  }, [inputCode, level]);

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.obfuscatedCode);
      const btn = document.getElementById('copy-btn');
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Copied!';
        setTimeout(() => btn.innerHTML = originalText, 2000);
      }
    }
  };

  const downloadCode = () => {
    if (result) {
      const blob = new Blob([result.obfuscatedCode], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `protected_${new Date().getTime()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const openWhatsAppHelp = () => {
    const phone = "01831634001";
    const message = encodeURIComponent("আসসালামালাইকুম ভাইয়া আমার সাহায্য লাগবে");
    window.open(`https://wa.me/88${phone}?text=${message}`, '_blank');
  };

  const openTelegramHelp = () => {
    const phone = "01831634001";
    window.open(`https://t.me/+88${phone}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-10 space-y-10 max-w-7xl mx-auto relative">
      {/* Side Menu Drawer */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div 
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-80 glass border-r border-white/10 z-[70] transition-transform duration-500 ease-out shadow-2xl ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white tracking-tight">Guardian Menu</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Support & Help</p>
            
            {/* WhatsApp Button */}
            <button 
              onClick={openWhatsAppHelp}
              className="w-full group p-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]"
            >
              <div className="p-3 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div className="text-left">
                <div className="text-emerald-400 font-bold text-lg leading-tight">WhatsApp Help</div>
                <div className="text-slate-500 text-xs tracking-tight">01831634001</div>
              </div>
            </button>

            {/* Telegram Button */}
            <button 
              onClick={openTelegramHelp}
              className="w-full group p-4 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]"
            >
              <div className="p-3 bg-sky-500 rounded-xl shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.24.38-.49 1.04-.75 4.05-1.76 6.74-2.92 8.08-3.48 3.84-1.6 4.63-1.88 5.15-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.03.22z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sky-400 font-bold text-lg leading-tight">Telegram Help</div>
                <div className="text-slate-500 text-xs tracking-tight">01831634001</div>
              </div>
            </button>
          </div>

          <div className="pt-8 border-t border-white/5">
            <p className="text-xs text-slate-500 leading-relaxed">
              আপনার যদি এই টুলটি ব্যবহারে কোনো সমস্যা হয়, তবে সরাসরি আমাদের সাথে যোগাযোগ করুন। আমরা আপনার সেবায় সর্বদা নিয়োজিত।
            </p>
          </div>
        </div>
      </div>

      {/* Premium Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
             {/* Three-dot / Hamburger Button */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-3 glass rounded-2xl border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all active:scale-95 group"
            >
              <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Local Protection Enabled
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Code <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Guardian Pro</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">আপনার এইচটিএমএল এবং স্ক্রিপ্ট কোডকে চুরির হাত থেকে রক্ষা করার জন্য প্রিমিয়াম সিকিউরিটি টুল।</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 glass p-2 rounded-2xl">
          <div className="flex p-1 bg-slate-950/50 rounded-xl">
            {(Object.values(ObfuscationLevel)).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                  level === lvl 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                {lvl.split(' (')[0]}
              </button>
            ))}
          </div>
          <button
            onClick={handleProtect}
            disabled={isProcessing}
            className={`btn-gradient px-8 py-3 rounded-xl font-bold text-white shadow-2xl flex items-center justify-center gap-2 ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? (
               <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
               </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
            {isProcessing ? 'Processing...' : 'Protect Now'}
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl flex items-center gap-4 animate-bounce">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Main Grid Workspace */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-[500px] z-10">
        <Editor 
          label="Your Original Code" 
          value={inputCode} 
          onChange={setInputCode}
          placeholder="Paste your HTML, CSS, or JS code here..."
        />
        
        <div className="flex flex-col gap-8">
          <Editor 
            label="Protected Output" 
            value={result?.obfuscatedCode || ''} 
            readOnly 
            placeholder="Protected code will appear here after clicking 'Protect Now'..."
          />
          
          {result && (
            <div className="glass rounded-2xl p-8 border border-white/10 animate-in fade-in zoom-in duration-500">
              <div className="flex flex-wrap justify-between items-center gap-6 mb-8 pb-8 border-b border-white/5">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-500/20 rounded-md">
                       <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    প্রোটেকশন সফল হয়েছে!
                  </h3>
                  <p className="text-sm text-slate-500">টেকনিক ব্যবহার করা হয়েছে: <span className="text-indigo-400 font-mono">{result.technique}</span></p>
                </div>
                <div className="flex gap-3">
                  <button
                    id="copy-btn"
                    onClick={copyToClipboard}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy Code
                  </button>
                  <button
                    onClick={downloadCode}
                    className="btn-gradient px-6 py-3 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-xl"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download HTML
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 transition-colors hover:bg-indigo-500/10">
                  <div className="text-[10px] uppercase text-indigo-400 font-black mb-1 tracking-widest">Original Size</div>
                  <div className="text-3xl font-extrabold text-white">{(result.originalSize / 1024).toFixed(2)} <span className="text-sm font-medium text-slate-500 uppercase">KB</span></div>
                </div>
                <div className="p-5 bg-pink-500/5 rounded-2xl border border-pink-500/10 transition-colors hover:bg-pink-500/10">
                  <div className="text-[10px] uppercase text-pink-400 font-black mb-1 tracking-widest">Protected Size</div>
                  <div className="text-3xl font-extrabold text-white">{(result.newSize / 1024).toFixed(2)} <span className="text-sm font-medium text-slate-500 uppercase">KB</span></div>
                </div>
              </div>

              <div className="p-6 bg-slate-950/40 rounded-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:bg-indigo-500/10"></div>
                <h4 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-[0.2em]">
                  সুরক্ষা রিপোর্ট (Analysis)
                </h4>
                <p className="text-slate-300 leading-relaxed text-sm font-medium italic">
                  "{result.explanation}"
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Feature Bento Section */}
      <section className="mt-20 space-y-8 z-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">কেন এই টুলটি ব্যবহার করবেন?</h2>
          <p className="text-slate-500">আমাদের প্রিমিয়াম ফিচারসমূহ এক নজরে দেখে নিন।</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { 
              title: "সম্পূর্ণ অফলাইন", 
              desc: "আপনার কোড কোথাও আপলোড হয় না, সবকিছু ব্রাউজারেই সম্পন্ন হয়। ১০০% সিকিউর।",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-5.19 4.595-9.362 9.716-10.198" />
            },
            { 
              title: "ইনস্ট্যান্ট ডাউনলোড", 
              desc: "প্রোটেক্ট করার পর সরাসরি .html ফাইল হিসেবে সেভ করুন এবং আপনার সার্ভারে ব্যবহার করুন।",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            },
            { 
              title: "অ্যাডভান্সড এনক্রিপশন", 
              desc: "Hex Encoding এবং Base64 Wrappers ব্যবহার করে কোডকে সাধারণ মানুষের কাছে অপাঠ্য করা হয়।",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            }
          ].map((feature, i) => (
            <div key={i} className="glass p-8 rounded-[2rem] border border-white/5 transition-all hover:translate-y-[-5px] hover:border-indigo-500/20 group">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600/20 transition-colors">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-10 border-t border-white/5 text-center z-10">
        <div className="flex justify-center items-center gap-2 text-slate-500 mb-4">
          <div className="h-1 w-1 rounded-full bg-slate-700"></div>
          <p className="text-sm font-bold tracking-widest uppercase">&copy; {new Date().getFullYear()} Code Guardian Pro</p>
          <div className="h-1 w-1 rounded-full bg-slate-700"></div>
        </div>
        <p className="text-xs text-slate-600">Built with pure quality for professionals.</p>
      </footer>
    </div>
  );
};

export default App;
