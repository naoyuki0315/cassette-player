/**
 * Project: Vintage Cassette Player
 * Feature: MP3 upload via EJECT button, dynamic song title, and Stripe integration.
 */
import { useRef, useState, type ChangeEvent } from "react";

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  
  // ★ 初期設定の曲（publicフォルダに入れた安全なファイル名を指定）
  const [audioUrl, setAudioUrl] = useState<string>("/Blues_With_a_Feeling_2120B.B._.mp3");
  
  // ★ カセットのラベルに表示される初期の曲名
  const [songTitle, setSongTitle] = useState<string>("Blues With a Feeling");

  const togglePlay = () => {
    if (!isPlaying) {
      if (audioRef.current) {
        audioRef.current.play().catch((e) => console.log("Play error:", e));
      }
      setIsPlaying(true);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
  };

  // EJECTボタンを押した時の処理（ファイル選択ダイアログを開く）
  const handleEject = () => {
    // 再生中ならまずは停止する
    if (isPlaying) {
      togglePlay();
    }
    // 隠してあるinput要素をクリックしたことにする
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ファイルが選択（セット）された時の処理
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 選んだファイルから再生用のURLを作成
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      
      // ファイル名から拡張子（.mp3など）を取り除いて、ラベルの曲名にする
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      setSongTitle(nameWithoutExtension);
    }
  };

  const handleDonate = () => {
    // 新しいStripeの支払いリンク（缶コーヒーを奢る）
    const paymentLink = "https://buy.stripe.com/aFa9ATeXYed74eF49DdIA01";
    if (paymentLink) {
      window.location.href = paymentLink;
    }
  };

  // カセット四隅のネジを表現するコンポーネント
  const Screw = ({ className }: { className: string }) => (
    <div className={`absolute w-3 h-3 md:w-4 md:h-4 bg-zinc-300 rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] flex items-center justify-center ${className}`}>
      <div className="w-full h-[1px] bg-zinc-600/80 rotate-45"></div>
      <div className="absolute w-[60%] h-[60%] rounded-full border border-zinc-400/30"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 font-sans select-none overflow-x-hidden">
      
      {/* プレイヤーデッキ（背景コンテナ） */}
      <div className="bg-zinc-800 p-6 md:p-12 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.9)] border-t border-zinc-700 border-b-8 border-zinc-900 flex flex-col items-center relative">
        
        {/* ========= カセット本体 ========= */}
        <div className="relative w-[340px] h-[220px] md:w-[480px] md:h-[310px] bg-[#d9d9d9] rounded-lg md:rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex flex-col items-center border-t-2 border-white/60 border-b-4 border-zinc-400 border-x border-zinc-300 transition-all duration-300">
          
          {/* 上部の録音防止ツメの穴（左右の窪み） */}
          <div className="absolute top-0 left-6 md:left-10 w-4 md:w-6 h-2 md:h-3 bg-zinc-900 rounded-b-sm shadow-inner"></div>
          <div className="absolute top-0 right-6 md:right-10 w-4 md:w-6 h-2 md:h-3 bg-zinc-900 rounded-b-sm shadow-inner"></div>

          {/* 四隅のネジ */}
          <Screw className="top-2 left-2 md:top-3 md:left-3" />
          <Screw className="top-2 right-2 md:top-3 md:right-3" />
          <Screw className="bottom-2 left-2 md:bottom-3 md:left-3" />
          <Screw className="bottom-2 right-2 md:bottom-3 md:right-3" />

          {/* === ラベルエリア === */}
          <div className="w-[85%] h-[55%] mt-5 md:mt-7 bg-[#d35400] rounded-sm relative shadow-[0_1px_2px_rgba(0,0,0,0.2)] border border-black/10 overflow-hidden flex flex-col items-center">
            
            {/* ラベル上部デザイン（ノーマルポジション表記） */}
            <div className="w-full h-8 md:h-10 bg-[#2c3e50] flex items-center px-4 justify-between border-b-2 border-[#1a252f]">
              <span className="text-white font-black text-[10px] md:text-xs tracking-[0.2em] opacity-90">TYPE I (NORMAL)</span>
              <span className="text-white font-bold text-sm md:text-base border border-white/30 px-2 rounded-sm bg-white/10">A</span>
            </div>

            {/* 手書き風タイトルエリア */}
            <div className="w-[90%] h-12 md:h-16 bg-[#f5f5dc] mt-3 md:mt-4 rounded-sm shadow-inner flex flex-col justify-center px-4 border-b border-orange-300 relative">
              {/* 薄い罫線 */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-300/30"></div>
              <div className="absolute top-full left-0 w-full h-[1px] bg-blue-300/30"></div>
              
              {/* 曲名 (長い場合は省略記号...になるようにtruncateを追加) */}
              <span className="text-blue-900 text-xl md:text-3xl font-bold italic tracking-tight z-10 truncate w-full text-center px-2" style={{ fontFamily: 'cursive' }}>
                {songTitle}
              </span>
            </div>

            {/* === カセット中央の窓 === */}
            <div className="absolute bottom-2 w-[70%] h-[40px] md:h-[60px] bg-[#111] rounded border-[2px] border-zinc-400 shadow-[inset_0_0_15px_rgba(0,0,0,1)] flex justify-between px-6 md:px-10 items-center overflow-hidden">
              
              {/* テープの巻き（左：太い / 右：細い で残量を表現） */}
              <div className="absolute left-[-15%] md:left-[-10%] top-1/2 -translate-y-1/2 w-[110px] h-[110px] md:w-[150px] md:h-[150px] rounded-full bg-[#1a1a1a] shadow-[0_0_5px_rgba(0,0,0,0.8)] border-[0.5px] border-white/5"></div>
              <div className="absolute right-[-5%] md:right-[0%] top-1/2 -translate-y-1/2 w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full bg-[#1a1a1a] shadow-[0_0_5px_rgba(0,0,0,0.8)] border-[0.5px] border-white/5"></div>

              {/* 左のハブ（歯車） */}
              <div className="relative z-10 w-8 h-8 md:w-10 md:h-10">
                 <div className="w-full h-full bg-[#eee] rounded-full flex items-center justify-center shadow-lg" style={isPlaying ? { animation: 'spin 3s linear infinite' } : {}}>
                    {/* 6本のツメ */}
                    <div className="absolute w-[120%] h-[16%] bg-[#ccc] rotate-0 shadow-sm"></div>
                    <div className="absolute w-[120%] h-[16%] bg-[#ccc] rotate-60 shadow-sm"></div>
                    <div className="absolute w-[120%] h-[16%] bg-[#ccc] rotate-120 shadow-sm"></div>
                    {/* 中心の穴 */}
                    <div className="absolute w-[45%] h-[45%] bg-[#111] rounded-full border-[2px] border-zinc-300"></div>
                    {/* 外周リング */}
                    <div className="absolute w-full h-full border-[3px] border-[#ddd] rounded-full shadow-inner"></div>
                 </div>
              </div>

              {/* 窓の中央にあるメモリ（残量ガイド） */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-1 w-12 md:w-16 h-2 md:h-3 flex justify-between items-end opacity-40 z-10">
                <div className="w-px h-full bg-white"></div>
                <div className="w-px h-1/2 bg-white"></div>
                <div className="w-px h-3/4 bg-white"></div>
                <div className="w-px h-1/2 bg-white"></div>
                <div className="w-px h-full bg-white"></div>
              </div>

              {/* 右のハブ（歯車） */}
              <div className="relative z-10 w-8 h-8 md:w-10 md:h-10">
                 <div className="w-full h-full bg-[#eee] rounded-full flex items-center justify-center shadow-lg" style={isPlaying ? { animation: 'spin 3s linear infinite' } : {}}>
                    <div className="absolute w-[120%] h-[16%] bg-[#ccc] rotate-0 shadow-sm"></div>
                    <div className="absolute w-[120%] h-[16%] bg-[#ccc] rotate-60 shadow-sm"></div>
                    <div className="absolute w-[120%] h-[16%] bg-[#ccc] rotate-120 shadow-sm"></div>
                    <div className="absolute w-[45%] h-[45%] bg-[#111] rounded-full border-[2px] border-zinc-300"></div>
                    <div className="absolute w-full h-full border-[3px] border-[#ddd] rounded-full shadow-inner"></div>
                 </div>
              </div>

            </div>
          </div>

          {/* === カセット下部の台形とリアルな穴 === */}
          <div className="absolute bottom-0 w-[70%] md:w-[65%] h-[18%] md:h-[20%]">
            <div className="w-full h-full bg-[#d0d0d0] border-t border-white/50 shadow-[0_-2px_4px_rgba(0,0,0,0.1)] relative flex justify-around items-end pb-2 md:pb-3 px-4 md:px-6" style={{ clipPath: 'polygon(6% 0%, 94% 0%, 100% 100%, 0% 100%)' }}>
               <div className="w-3 h-3 md:w-4 md:h-4 bg-zinc-900 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,1)] border border-white/20"></div>
               <div className="w-4 h-4 md:w-5 md:h-5 bg-zinc-900 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,1)] border border-white/20"></div>
               <div className="w-12 h-4 md:w-16 md:h-5 bg-zinc-900 rounded-sm shadow-[inset_0_2px_5px_rgba(0,0,0,1)] relative flex items-center justify-center border-b border-white/10">
                  <div className="w-full h-[60%] bg-[#2a1b14] shadow-inner"></div>
               </div>
               <div className="w-4 h-4 md:w-5 md:h-5 bg-zinc-900 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,1)] border border-white/20"></div>
               <div className="w-3 h-3 md:w-4 md:h-4 bg-zinc-900 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,1)] border border-white/20"></div>
            </div>
          </div>
          
        </div>

        {/* ========= デッキの操作ボタン群（メカニカルUI） ========= */}
        <div className="mt-8 md:mt-12 flex gap-1 md:gap-3 bg-zinc-900 p-2 md:p-3 rounded-lg border-b-[6px] border-zinc-950 shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]">
          
          {/* EJECTボタン (クリックでファイル選択) */}
          <button 
            onClick={handleEject}
            className="w-14 h-12 md:w-20 md:h-14 bg-zinc-700 text-zinc-400 font-bold rounded border-b-[6px] border-zinc-800 active:border-b-0 active:translate-y-[6px] transition-all text-[10px] md:text-xs flex flex-col items-center justify-center gap-1 shadow-md hover:text-white"
          >
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-current"></div>
            EJECT
          </button>
          {/* 隠しファイル入力 */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*"
            className="hidden"
          />
          
          <button 
            onClick={() => { if(isPlaying) togglePlay(); }} 
            className={`w-14 h-12 md:w-20 md:h-14 font-bold rounded transition-all text-[10px] md:text-xs flex flex-col items-center justify-center gap-1 shadow-md
              ${!isPlaying 
                ? 'bg-zinc-600 text-red-500 border-b-0 translate-y-[6px]' // 停止中は押し込まれた状態
                : 'bg-zinc-700 text-zinc-400 border-b-[6px] border-zinc-800 hover:text-white'}`} // 再生中は出っ張る
          >
             <div className="w-3 h-3 bg-current rounded-sm"></div>
             STOP
          </button>
          
          <button className="w-14 h-12 md:w-20 md:h-14 bg-zinc-700 text-zinc-400 font-bold rounded border-b-[6px] border-zinc-800 active:border-b-0 active:translate-y-[6px] transition-all text-[10px] md:text-xs flex flex-col items-center justify-center gap-1 shadow-md hover:text-white">
             <div className="flex"><div className="w-0 h-0 border-y-[5px] border-y-transparent border-r-[8px] border-r-current"></div><div className="w-0 h-0 border-y-[5px] border-y-transparent border-r-[8px] border-r-current"></div></div>
             REW
          </button>
          
          <button className="w-14 h-12 md:w-20 md:h-14 bg-zinc-700 text-zinc-400 font-bold rounded border-b-[6px] border-zinc-800 active:border-b-0 active:translate-y-[6px] transition-all text-[10px] md:text-xs flex flex-col items-center justify-center gap-1 shadow-md hover:text-white">
             <div className="flex"><div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-current"></div><div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-current"></div></div>
             FF
          </button>

          <button 
            onClick={() => { if(!isPlaying) togglePlay(); }} 
            className={`w-14 h-12 md:w-20 md:h-14 font-bold rounded transition-all text-[10px] md:text-xs flex flex-col items-center justify-center gap-1 shadow-md
              ${isPlaying 
                ? 'bg-zinc-600 text-green-400 border-b-0 translate-y-[6px] shadow-inner' // 再生中はガチャンと押し込まれる
                : 'bg-zinc-700 text-zinc-400 border-b-[6px] border-zinc-800 hover:text-white'}`}
          >
             <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-current"></div>
             PLAY
          </button>

        </div>
      </div>

      {/* ========= Stripe 投げ銭ボタン ========= */}
      <div className="mt-12 text-center relative z-10">
        <button 
          onClick={handleDonate} 
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-[#635BFF] rounded-full hover:bg-[#4b45d6] hover:-translate-y-1 shadow-[0_4px_14px_0_rgba(99,91,255,0.4)] hover:shadow-[0_8px_25px_rgba(99,91,255,0.4)] active:translate-y-0 active:shadow-none"
        >
          <span className="mr-3 text-xl">☕</span>
          缶コーヒーを奢る (Stripe決済)
        </button>
        <div className="mt-4 text-zinc-500 font-mono text-xs flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          PayPay審査用リンク接続済
        </div>
      </div>

      {/* 隠しオーディオプレイヤー */}
      <audio ref={audioRef} src={audioUrl || undefined} preload="auto" playsInline crossOrigin="anonymous" onEnded={() => setIsPlaying(false)} />
      
    </div>
  );
}