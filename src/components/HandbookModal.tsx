import React, { useState } from 'react';
import { X, BookOpen, Layers, Target, Trophy, Flame, FileText, CheckCircle2 } from 'lucide-react';

interface HandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HandbookModal: React.FC<HandbookModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'layout' | 'aturan' | 'nembak' | 'lop' | 'sistem' | 'pdf'>('ringkasan');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 border border-amber-700/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-600/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-100 font-display">
                Buku Panduan Teknis Badaku
              </h2>
              <p className="text-xs text-stone-400">
                Komite Olahraga Tradisional · Edisi 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-stone-950/40 border-b border-stone-800 overflow-x-auto text-xs font-medium no-scrollbar">
          <button
            onClick={() => setActiveTab('ringkasan')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'ringkasan' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            1. Ketentuan Umum
          </button>
          <button
            onClick={() => setActiveTab('layout')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'layout' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            2. Layout Papan
          </button>
          <button
            onClick={() => setActiveTab('aturan')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'aturan' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            3. Aturan Main
          </button>
          <button
            onClick={() => setActiveTab('nembak')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'nembak' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            Aturan "Nembak"
          </button>
          <button
            onClick={() => setActiveTab('lop')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'lop' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            4. Babak "LOP"
          </button>
          <button
            onClick={() => setActiveTab('sistem')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'sistem' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            5. Sistem Pertandingan
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pdf' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-amber-400 hover:text-amber-300 hover:bg-stone-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Dokumen PDF Asli
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-stone-300">
          
          {activeTab === 'ringkasan' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/30 text-amber-200">
                <h3 className="font-semibold text-amber-300 mb-1">Ringkasan Eksekutif:</h3>
                <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
                  Panduan teknis ini disusun sebagai acuan baku regulasi, spesifikasi peralatan, dan tata cara pelaksanaan pertandingan olahraga tradisional Badaku. Bertujuan menjamin keadilan, ketertiban, serta kelancaran jalannya kompetisi dari tingkat daerah hingga nasional.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-amber-100 flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  1. Ketentuan & Ketentuan Umum
                </h3>
                <p className="text-stone-300">
                  Badaku adalah permainan tradisional berbasis strategi matematis yang dimainkan oleh dua orang pemain. Prinsip utama permainan ini adalah mengumpulkan biji/buah sebanyak-banyaknya di rumah induk milik sendiri melalui distribusi biji secara berkala searah jarum jam.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800">
                  <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-2">
                    Spesifikasi Papan Badaku
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-300 list-disc list-inside">
                    <li><strong className="text-stone-200">Bahan:</strong> Kayu keras / Plastik tebal sintetik.</li>
                    <li><strong className="text-stone-200">Lubang Kecil:</strong> 14 lubang (7 di tiap sisi: Sisi A & Sisi B).</li>
                    <li><strong className="text-stone-200">Lubang Induk:</strong> 2 lubang besar di kedua ujung.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800">
                  <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-2">
                    Spesifikasi Biji / Buah Badaku
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-300 list-disc list-inside">
                    <li><strong className="text-stone-200">Bahan:</strong> Biji kecil / Kelereng sintetis / cangkang kerang.</li>
                    <li><strong className="text-stone-200">Ukuran Biji:</strong> Uniform (diameter 1 – 1.5 cm).</li>
                    <li><strong className="text-stone-200">Jumlah Biji per Lubang Kecil:</strong> Terserah Panitia (Standar kompetisi 7 biji per lubang = 98 biji total).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-amber-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                2. Layout Papan & Denah Permainan
              </h3>
              <p className="text-stone-300 text-xs md:text-sm">
                Papan Badaku terdiri dari dua jajar lubang kecil yang berhadapan dan dua lubang Induk di kedua ujung:
              </p>

              {/* Diagram matching page 1 */}
              <div className="p-6 rounded-2xl bg-[#200c03] border-2 border-amber-900/60 my-4 shadow-inner text-center">
                <span className="text-xs font-bold text-amber-300 tracking-wider uppercase block mb-3">
                  SISI PEMAIN B (B1 - B7)
                </span>

                <div className="flex items-center justify-center gap-3">
                  {/* Induk B */}
                  <div className="w-20 h-28 rounded-full bg-amber-600/90 border-2 border-amber-400 flex flex-col items-center justify-center text-white font-bold shadow-lg">
                    <span className="text-xs uppercase">Induk B</span>
                    <span className="text-[10px] text-amber-100/70 font-normal">Pemain B</span>
                  </div>

                  {/* 2 rows of 7 */}
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      {['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'].map((id) => (
                        <div key={id} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-700/80 border border-amber-400 flex items-center justify-center text-xs font-bold text-amber-100 shadow-sm">
                          {id}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'].map((id) => (
                        <div key={id} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-700/80 border border-amber-400 flex items-center justify-center text-xs font-bold text-amber-100 shadow-sm">
                          {id}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Induk A */}
                  <div className="w-20 h-28 rounded-full bg-amber-600/90 border-2 border-amber-400 flex flex-col items-center justify-center text-white font-bold shadow-lg">
                    <span className="text-xs uppercase">Induk A</span>
                    <span className="text-[10px] text-amber-100/70 font-normal">Pemain A</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-amber-300 tracking-wider uppercase block mt-3">
                  SISI PEMAIN A (A1 - A7)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 text-xs space-y-2">
                <p>• <strong>Aliran Searah Jarum Jam:</strong> Putaran bergerak melingkar searah jarum jam: dari <code>B1 ➔ B7 ➔ Induk A ➔ A7 ➔ A1 ➔ Induk B ➔ B1</code>.</p>
                <p>• <strong>Induk A (Kanan):</strong> Rumah penyimpanan poin milik Pemain A.</p>
                <p>• <strong>Induk B (Kiri):</strong> Rumah penyimpanan poin milik Pemain B.</p>
                <p>• Biji dimasukkan ke Induk sendiri saat melewatinya, namun selalu dilewati (tidak diisi) pada Induk lawan.</p>
                <p>• Lubang yang berhadapan adalah lawan langsung (A1 ↔ B1, A2 ↔ B2, ..., A7 ↔ B7) yang menjadi sasaran tembak.</p>
              </div>
            </div>
          )}

          {activeTab === 'aturan' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-amber-100 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                3. Aturan & Mekanisme Permainan
              </h3>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40">
                <h4 className="font-bold text-amber-300 text-xs uppercase mb-1">
                  Fase Awal (Adu Pertama):
                </h4>
                <p className="text-xs md:text-sm text-stone-300">
                  Permainan dimulai secara serentak di mana kedua pemain mengambil seluruh biji dari salah satu lubang di sisinya masing-masing, lalu membagikan biji satu per satu ke tiap lubang secara berurutan melingkar (searah jarum jam). Biji juga dimasukkan ke lubang Induk milik sendiri, namun <strong>tidak dimasukkan ke Induk lawan</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-3">
                <h4 className="font-bold text-amber-300 text-xs uppercase">
                  Proses "Jalan" & "Mati":
                </h4>
                <p className="text-xs md:text-sm text-stone-300">
                  Jika biji terakhir jatuh di lubang kecil yang <strong>berisi biji</strong>, pemain wajib mengambil seluruh biji di lubang tersebut dan <strong>melanjutkan pengisian</strong>.
                </p>
                <p className="text-xs md:text-sm text-stone-300 font-medium text-amber-200">
                  Jika biji terakhir jatuh di:
                </p>
                <ul className="space-y-2 text-xs md:text-sm text-stone-300 list-disc list-inside pl-2">
                  <li>
                    <strong className="text-emerald-400">Induk Sendiri:</strong> Pemain mendapatkan kesempatan <em>"Jalan Lagi"</em> (bebas memilih lubang mana saja yang berisi biji di sisinya).
                  </li>
                  <li>
                    <strong className="text-amber-400">Lubang Kosong Sisi Sendiri:</strong> Terjadi kondisi <em>"Nembak" (Tombok)</em>.
                  </li>
                  <li>
                    <strong className="text-red-400">Lubang Kosong Sisi Lawan:</strong> Pemain dinyatakan <em>"Mati"</em>, giliran berpindah ke lawan tanpa mengambil biji.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'nembak' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-red-950/30 border-2 border-red-700/50">
                <h3 className="text-base font-bold text-red-300 flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-red-400" />
                  Aturan Khusus "Nembak" (Tombok)
                </h3>
                <p className="text-sm text-stone-200 leading-relaxed font-medium">
                  "Tembakan hanya sah apabila biji terakhir jatuh di lubang kosong di sisi milik sendiri dan lubang lawan di hadapannya memiliki isi (minimal 1 biji). Jika lubang lawan kosong, tembakan tidak menghasilkan biji tambahan."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                  <span className="font-bold text-emerald-400 uppercase text-[11px] block">
                    Kondisi 1: Tembakan Sah
                  </span>
                  <p className="text-stone-300">
                    Biji terakhir Anda mendarat di lubang kosong di sisi Anda (misalnya A4). Lubang lawan tepat di hadapannya (B4) memiliki minimal 1 biji.
                  </p>
                  <p className="text-emerald-300 font-medium">
                    Hasil: Seluruh biji di lubang B4 ditambah 1 biji terakhir di A4 diambil sekaligus dan dimasukkan ke Induk Anda. Giliran Anda selesai (mati).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
                  <span className="font-bold text-amber-400 uppercase text-[11px] block">
                    Kondisi 2: Lubang Lawan Kosong
                  </span>
                  <p className="text-stone-300">
                    Biji terakhir Anda mendarat di lubang kosong di sisi Anda (misalnya A4), namun lubang lawan di hadapannya (B4) juga kosong (0 biji).
                  </p>
                  <p className="text-stone-400 font-medium">
                    Hasil: Biji terakhir tetap berada di lubang A4. Anda tidak mendapatkan biji tambahan, dan giliran Anda selesai (mati).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lop' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-amber-100 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                4. Penentuan Pemenang & Babak "LOP" (Burn)
              </h3>
              <p className="text-stone-300 text-xs md:text-sm">
                Satu babak dinyatakan selesai apabila seluruh biji di lubang kecil telah habis dan terkumpul di kedua Induk. Pemain dengan jumlah biji terbanyak di Induknya memenangkan babak tersebut.
              </p>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs space-y-2">
                <h4 className="font-bold text-amber-300 uppercase">
                  Sistem Lop / Tembak Rumah:
                </h4>
                <p className="text-stone-300">
                  Untuk pertandingan multi-babak atau turnamen, biji dari masing-masing Induk dikeluarkan untuk mengisi kembali 7 lubang masing-masing pemain:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-stone-300">
                  <li>Setiap lubang diisi sesuai kuota (misal 7 biji per lubang).</li>
                  <li>Jika seorang pemain tidak memiliki cukup biji untuk mengisi seluruh 7 lubang, lubang yang kekurangan biji dinyatakan <strong>"LOP" (Terbakar / Ditutup)</strong>.</li>
                  <li>Lubang Lop tidak boleh diisi biji dan dilewati dalam perjalanan taburan.</li>
                  <li>Sisa biji disimpan kembali ke Induk sebagai tabungan poin.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'sistem' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-amber-100 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                5. Sistem Pertandingan
              </h3>
              <div className="p-5 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-3">
                <p className="text-stone-200 text-sm font-semibold">
                  Sistem pertandingan adalah sistem gugur (Knockout Tournament).
                </p>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Bagi yang menang akan lanjut bermain ke babak selanjutnya (Perempat Final → Semifinal → Babak Final), sedangkan yang kalah langsung tereliminasi dari kejuaraan.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="space-y-3 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  File Sumber: <code className="text-amber-300">Panduan_Teknis_Badaku_3bda761b.pdf</code>
                </span>
                <a
                  href="/assets/aistudio/Panduan_Teknis_Badaku_3bda761b.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Unduh / Buka Dokumen Asli
                </a>
              </div>
              <div className="w-full h-96 rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
                <iframe
                  src="/assets/aistudio/Panduan_Teknis_Badaku_3bda761b.pdf"
                  title="Panduan Teknis Badaku PDF"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-stone-800 bg-stone-950/60">
          <span className="text-xs text-stone-500">
            Regulasi Resmi Komite Olahraga Tradisional Indonesia
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
};
