import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { MoveLeft, Barcode, RefreshCcw, ShieldCheck, Box, Zap, Globe } from "lucide-react";
import gsap from "gsap";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Background Scanning Laser (Subtle and Premium)
    const laser = containerRef.current.querySelector(".scanner-laser");
    if (laser) {
      gsap.to(laser, {
        top: "100%",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // Floating Data Fragments
    const fragments = containerRef.current.querySelectorAll(".data-fragment");
    fragments.forEach(f => {
      gsap.to(f, {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        opacity: "random(0.1, 0.4)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    });

    // Glitchy Text Flicker
    if (textRef.current) {
        gsap.to(textRef.current, {
           skewX: "random(-10, 10)",
           opacity: "random(0.8, 1)",
           duration: 0.1,
           repeat: -1,
           repeatRefresh: true,
           ease: "none"
        });
    }

  }, []);

  return (
    <div 
      ref={containerRef}
      className="h-[100dvh] w-screen flex flex-col items-center justify-center bg-[#030712] text-white overflow-hidden relative font-sans selection:bg-orange-500/30"
    >
      {/* Premium Industrial Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      {/* Scanner Laser Background */}
      <div className="scanner-laser absolute left-0 right-0 h-px bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.3)] z-0 pointer-events-none" style={{ top: '0%' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        {/* Central Terminal Interface */}
        <div className="relative group mb-8">
            <div className="absolute -inset-10 bg-orange-500/5 blur-[100px] rounded-full animate-pulse" />
            
            <div className="relative p-12 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 overflow-hidden">
                {/* 404 Display */}
                <div className="relative">
                    <h1 
                        ref={textRef}
                        className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/10"
                    >
                        404
                    </h1>
                </div>

                {/* Service Icons Row */}
                <div className="flex gap-8 opacity-40">
                    <div className="flex flex-col items-center gap-2"><Barcode size={24}/><span className="text-[10px] font-mono tracking-widest uppercase">EAN-13</span></div>
                    <div className="flex flex-col items-center gap-2"><Box size={24}/><span className="text-[10px] font-mono tracking-widest uppercase">UPC-A</span></div>
                    <div className="flex flex-col items-center gap-2"><Zap size={24}/><span className="text-[10px] font-mono tracking-widest uppercase">ITF-14</span></div>
                    <div className="flex flex-col items-center gap-2"><ShieldCheck size={24}/><span className="text-[10px] font-mono tracking-widest uppercase">SCC-14</span></div>
                </div>

                <div className="w-48 h-px bg-white/10" />
                
                <p className="text-white/40 text-xs font-mono tracking-widest uppercase max-w-[200px]">
                    Critical Database Scan: <br/> Result [Null]
                </p>
            </div>
        </div>

        {/* Messaging */}
        <div className="mb-12 space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-tight">Registry Key Missing</h2>
            <p className="text-white/30 max-w-md text-sm leading-relaxed font-medium">
                Our global barcode indexing service could not find a valid match for the requested endpoint. The entry may have been de-listed or moved to a secure vault.
            </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/">
                <button className="flex items-center gap-3 px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-orange-500 hover:text-white transition-all transform active:scale-95 group shadow-xl uppercase text-xs tracking-widest">
                    <MoveLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Services
                </button>
            </Link>
            
            <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black rounded-2xl transition-all active:scale-95 uppercase text-xs tracking-widest"
            >
                <RefreshCcw className="h-4 w-4" />
                Refresh Pipeline
            </button>
        </div>
      </motion.div>

      {/* Floating Data Fragments (Branding bits) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <span className="data-fragment absolute top-20 left-[15%] text-[10px] font-mono">9 780201 379624</span>
         <span className="data-fragment absolute bottom-40 right-[15%] text-[10px] font-mono">0 12345 67890 5</span>
         <span className="data-fragment absolute top-[40%] right-[10%] text-[10px] font-mono">5 012345 678900</span>
         <span className="data-fragment absolute bottom-[20%] left-[20%] text-[10px] font-mono">GTIN: INVALID_CODE</span>
      </div>

      {/* Modern Status decals */}
      <div className="fixed top-8 left-8 flex flex-col gap-2 opacity-20 hidden md:flex">
         <div className="flex items-center gap-2 text-[10px] font-mono"><Globe size={12}/> Global_Server: [Online]</div>
         <div className="flex items-center gap-2 text-[10px] font-mono"><ShieldCheck size={12}/> Security: [Verified]</div>
      </div>
      
      <div className="fixed bottom-8 right-8 flex items-center gap-2 opacity-20 text-[10px] font-mono uppercase tracking-widest hidden md:flex">
         Industrial Standard Barcodes &copy; 2026
      </div>
    </div>
  );
}
