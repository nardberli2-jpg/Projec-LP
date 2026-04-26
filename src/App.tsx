/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Copy, Sparkles, Loader2, Image as ImageIcon, Palette, Layout, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [productName, setProductName] = useState('');
  const [benefit, setBenefit] = useState('');
  const [framework, setFramework] = useState('AIDA (Attention-Interest-Desire-Action)');
  const [tone, setTone] = useState('Willy Wang Style (Pattern Interrupt)');
  const [images, setImages] = useState(['', '', '']);
  const [dominantColor, setDominantColor] = useState('#f97316');
  const [output, setOutput] = useState('Menunggu data...');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const generateNow = async () => {
    if (!productName || !benefit) {
      alert("Mohon isi nama produk dan manfaat produk terlebih dahulu!");
      return;
    }

    setIsLoading(true);
    setOutput('Sedang menyusun kodingan logis...');

    const promptText = `
      Kamu adalah Expert Copywriter & Web Developer Landing Page.
      Tugas: Buat Landing Page HTML lengkap (Gunakan Tailwind CSS CDN).
      
      DETAIL PRODUK:
      - Nama: ${productName}
      - Manfaat Utama: ${benefit}
      - Framework: ${framework}
      - Tone: ${tone} (Gunakan pola pikir Willy Wang: Direct, logis, pattern interrupt, jangan ngambang).
      
      ASET & VISUAL:
      - Gambar Produk 1: ${images[0] || 'https://via.placeholder.com/800x600?text=Produk+1'}
      - Gambar Produk 2: ${images[1] || 'https://via.placeholder.com/800x600?text=Produk+2'}
      - Gambar Produk 3: ${images[2] || 'https://via.placeholder.com/800x600?text=Produk+3'}
      - Warna Dominan: ${dominantColor}
      
      INSTRUKSI KHUSUS:
      1. Gunakan Tailwind CSS.
      2. Warna dominan (${dominantColor}) HARUS digunakan untuk tombol utama, gradient aksen, dan bayangan (shadow).
      3. Buat desain yang modern, high-converting, dan mobile responsive.
      4. Gunakan typography yang kuat (Inter/sans-serif).
      5. Landing page harus mencakup: Hero section, Social Proof (jika relevan), Benefits Grid, Image Gallery (menggunakan 3 gambar tadi), dan Strong CTA.
      6. Output: Hanya kode HTML lengkap (termasuk tag <head> dan <body>).
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: promptText }] }],
      });

      let text = response.text || '';
      // Clean markdown code blocks
      text = text.replace(/```html/g, "").replace(/```/g, "").trim();
      setOutput(text);
    } catch (err) {
      console.error(err);
      setOutput("Error: Gagal menghubungi AI Engine. Pastikan koneksi stabil.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert("Kode disalin!");
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#cbd5e1] font-sans selection:bg-orange-500/30">
      <div className="max-w-7xl mx-auto p-4 md:p-10">
        <header className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">
            SESUAI<span className="text-orange-500">FORMAT</span> ENGINE
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          <section className="space-y-6">
            <div className="bg-[#151b27] border border-[#2d3748] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors duration-500" />
              
              <div className="flex items-center gap-2 mb-6">
                <Layout className="w-4 h-4 text-orange-500" />
                <h2 className="text-orange-500 font-bold uppercase text-xs tracking-[0.2em] italic">Setup Copywriting</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Framework</label>
                  <select 
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    className="w-full bg-[#1e293b] border border-[#334155] text-white p-3 rounded-xl outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Before-After-Bridge (BAB)">BAB (Before-After-Bridge)</option>
                    <option value="AIDA (Attention-Interest-Desire-Action)">AIDA (Attention-Interest)</option>
                    <option value="PAS (Problem-Agitate-Solution)">PAS (Problem-Solution)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Style/Tone</label>
                  <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-[#1e293b] border border-[#334155] text-white p-3 rounded-xl outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Direct & To The Point">Direct & To The Point</option>
                    <option value="Willy Wang Style (Pattern Interrupt)">Willy Wang Style</option>
                    <option value="Emotional Storytelling">Emotional Storytelling</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 flex items-center gap-1">
                    <Layout className="w-3 h-3" /> NAMA PRODUK
                  </label>
                  <input 
                    type="text" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Contoh: Scentpreneur Class"
                    className="w-full bg-[#1e293b] border border-[#334155] text-white p-3 rounded-xl outline-none focus:border-orange-500 transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> MANFAAT (LOGIKA DATA)
                  </label>
                  <textarea 
                    value={benefit}
                    onChange={(e) => setBenefit(e.target.value)}
                    rows={4} 
                    placeholder="Contoh: Profit 2jt dlm 7 hari, bukan janji manis tapi data..."
                    className="w-full bg-[#1e293b] border border-[#334155] text-white p-3 rounded-xl outline-none focus:border-orange-500 transition-all placeholder:text-gray-600 resize-none font-mono text-sm"
                  />
                </div>

                <div className="pt-4 border-t border-[#2d3748] mt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon className="w-4 h-4 text-orange-500" />
                    <h2 className="text-orange-500 font-bold uppercase text-xs tracking-widest italic">Aset Gambar (URL)</h2>
                  </div>
                  <div className="space-y-3">
                    {images.map((img, idx) => (
                      <input 
                        key={idx}
                        type="url"
                        value={img}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        placeholder={`URL Gambar Produk ${idx + 1}...`}
                        className="w-full bg-[#1e293b] border border-[#334155] text-white p-3 rounded-xl outline-none focus:border-orange-500 transition-all text-sm font-mono"
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2d3748] mt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-4 h-4 text-orange-500" />
                    <h2 className="text-orange-500 font-bold uppercase text-xs tracking-widest italic">Visual Dominan</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="color" 
                      value={dominantColor}
                      onChange={(e) => setDominantColor(e.target.value)}
                      className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-mono">{dominantColor.toUpperCase()}</p>
                      <p className="text-[10px] text-gray-600">Warna ini akan menjadi aksen utama landing page.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={generateNow}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-slate-700 disabled:to-slate-800 text-white font-black py-4 rounded-xl shadow-xl shadow-orange-500/20 transform transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-[0.2em] mt-8 overflow-hidden group relative"
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Landing Page</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Output Section */}
          <section className="bg-[#151b27] border border-[#2d3748] rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col h-full min-h-[600px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <h2 className="text-orange-500 font-bold uppercase text-xs tracking-widest italic">AI Prompt Output</h2>
              </div>
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-[10px] font-bold bg-[#1e293b] hover:bg-[#2d3748] px-3 py-2 rounded-lg transition-colors border border-[#334155] uppercase tracking-wider"
              >
                <Copy className="w-3 h-3" /> Salin Kode
              </button>
            </div>

            <div className="flex-1 relative bg-black rounded-xl border border-[#334155] overflow-hidden flex flex-col">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin mb-6" />
                    <p className="text-sm italic text-orange-500 font-medium">Menyusun logika marketing produk...</p>
                    <p className="text-[10px] text-gray-500 mt-2 tracking-widest uppercase">Analyzing Dominant Colors & Frameworks</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <pre className="flex-1 p-6 text-[13px] font-mono leading-relaxed text-[#10b981] overflow-auto selection:bg-[#10b981]/20">
                <code>{output}</code>
              </pre>
            </div>

            <p className="text-[10px] text-gray-600 mt-4 italic text-center">
              *Paste kode di atas ke file .html untuk melihat hasilnya.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
