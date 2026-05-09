/**
 * Project: Vintage Cassette Player (Rough Draft)
 * Feature: Base UI for Stripe integration and PayPay application.
 */

import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const leftReelRef = useRef<HTMLDivElement | null>(null);
  const rightReelRef = useRef<HTMLDivElement | null>(null);
  
  const rotationRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mixTitle, setMixTitle] = useState("SUMMER MIX TAPE");
  const [artistName, setArtistName] = useState("VARIOUS ARTISTS");

  // 寄付（投げ銭）リンク：前回のコードから継承
  const handleDonation = () => {
    const paymentLink = "https://buy.stripe.com/eVq5kD034glf4eFgWpdIA00"; 
    if (paymentLink && paymentLink.startsWith("https://buy.stripe.com")) {
      window.location.href = paymentLink;
    } else {
      alert("Stripeの支払いリンクを正しく設定してください。");
    }
  };

  // 音楽ファイルの読み込み
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isPlaying) togglePlay();
      const newUrl = URL.createObjectURL(file);
      setAudioUrl(newUrl);
      setMixTitle(file.name.replace(/\.[^/.]+$/, "").toUpperCase());
    }
  };

  // 再生・停止の切り替え
  const togglePlay = () => {
    if (!audioUrl) {
      alert("まずは「LOAD MUSIC」から音楽をセットしてください！");
      return;
    }

    if (!isPlaying) {
      setIsPlaying(true);
      audioRef.current?.play().catch(e => console.error("Play error:", e));
    } else {
      setIsPlaying(false);
      audioRef.current?.pause();
    }
  };

  // リールの回転アニメーション（カセット特有の動き）
  useEffect(() => {
    let lastTs = 0;
    const tick = (ts: number) => {
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      if (isPlaying) {
        // レコードより少し遅めの回転をイメージ
        const speed = 120; 
        rotationRef.current = (rotationRef.current + speed * dt) % 360;
        
        if (leftReelRef.current && rightReelRef.current) {
          leftReelRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
          rightReelRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-300 font-sans p-4">
      
      {/* カセットテープ本体のUI */}
      <div className="relative w-full max-w-lg aspect-[1.6/1] bg-zinc-200 rounded-xl shadow-2xl border-4 border-zinc-300 flex flex-col items-center justify-center p-4">
        
        {/* カセットのラベル部分 */}
        <div className="absolute top-4 w-[85%] h-[75%] bg-white rounded-md shadow-sm border border-zinc-300 flex flex-col items-center pt-2">
          
          <div className="w-[90%] border-b-2 border-red-500 pb-1 mb-2">
            <input 
              type="text" 
              value={mixTitle} 
              onChange={(e) => setMixTitle(e.target.value.toUpperCase())}
              className="w-full text-center text-xl md:text-2xl font-black text-black outline-none bg-transparent"
            />
            <input 
              type="text" 
              value={artistName} 
              onChange={(e) => setArtistName(e.target.value.toUpperCase())}
              className="w-full text-center text-sm font-bold text-zinc-600 outline-none bg-transparent"
            />
          </div>

          {/* 中央の透明な窓とリール */}
          <div className="w-[70%] h-24 bg-zinc-800/80 rounded-lg flex items-center justify-between px-6 shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] bg-white/10" />
            </div>
            
            {/* 左リール */}
            <div ref={leftReelRef} className="w-12 h-12 bg-zinc-200 rounded-full flex items-center justify-center relative">
              <div className="absolute w-2 h-2 bg-zinc-800 rounded-full" />
              <div className="w-full h-full border-[4px] border-zinc-200 rounded-full flex justify-between items-center p-1">
                <div className="w-2 h-2 bg-zinc-800 rounded-full" />
                <div className="w-2 h-2 bg-zinc-800 rounded-full" />
                <div className="w-2 h-2 bg-zinc-800 rounded-full" />
              </div>
            </div>

            {/* 右リール */}
            <div ref={rightReelRef} className="w-12 h-12 bg-zinc-200 rounded-full flex items-center justify-center relative">
              <div className="absolute w-2 h-2 bg-zinc-800 rounded-full" />
              <div className="w-full h-full border-[4px] border-zinc-200 rounded-full flex justify-between items-center p-1">
                <div className="w-2 h-2 bg-zinc-800 rounded-full" />
                <div className="w-2 h-2 bg-zinc-800 rounded-full" />
                <div className="w-2 h-2 bg-zinc-800 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* カセット下部の台形部分 */}
        <div className="absolute bottom-0 w-[70%] h-[15%] bg-zinc-300 border-t-2 border-zinc-400 rounded-t-lg" />
      </div>

      {/* コントロールパネル */}
      <div className="mt-10 w-full max-w-lg bg-zinc-900 p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={togglePlay} 
            className={`px-8 py-4 rounded-lg font-black text-lg active:scale-95 transition-all shadow-lg ${
              isPlaying ? 'bg-red-600 text-white shadow-red-500/50' : 'bg-zinc-200 text-black hover:bg-white'
            }`}
          >
            {isPlaying ? "■ STOP" : "▶ PLAY"}
          </button>
        </div>

        <div className="flex gap-2 pt-4 border-t border-white/10">
          <label className="flex-1 h-14 bg-zinc-800 text-zinc-300 rounded-xl flex items-center justify-center cursor-pointer text-sm font-bold shadow-md hover:bg-zinc-700 transition-colors">
            LOAD MUSIC 📼
            <input 
              type="file" 
              accept="audio/*, video/*, .mp3, .wav, .m4a" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </label>
          
          <button 
            onClick={handleDonation} 
            className="flex-1 h-14 bg-amber-500 text-black rounded-xl flex flex-col items-center justify-center shadow-md hover:bg-amber-400 active:scale-95 transition-all"
          >
            <span className="text-sm font-black tracking-wider">Buy Me a Coffee ☕</span>
            <span className="text-[10px] font-bold opacity-80">Support (Stripe)</span>
          </button>
        </div>

      </div>

      {/* 隠しオーディオタグ */}
      <audio 
        ref={audioRef} 
        src={audioUrl || undefined} 
        onEnded={() => setIsPlaying(false)} 
      />
    </div>
  );
}