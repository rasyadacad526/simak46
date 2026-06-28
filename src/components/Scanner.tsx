import React, { useState, useEffect, useRef } from 'react';
import { Search, Camera, CameraOff, RefreshCw, Scan } from 'lucide-react';
import { Item } from '../types';
import { Html5Qrcode } from 'html5-qrcode';

interface ScannerProps {
  items: Item[];
}

export default function Scanner({ items }: ScannerProps) {
  const [activeMode, setActiveMode] = useState<'camera' | 'manual'>('camera');
  const [scannedSku, setScannedSku] = useState('');
  const [scannedItem, setScannedItem] = useState<Item | null>(null);
  
  // Camera scanning states
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Stop scanning when leaving component
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(err => console.error("Cleanup stop failed", err));
      }
    };
  }, []);

  // Try to list cameras on mount or when mode changes to camera
  useEffect(() => {
    if (activeMode === 'camera') {
      Html5Qrcode.getCameras()
        .then((devices) => {
          setCameras(devices);
          if (devices.length > 0) {
            // Try to find rear/back camera
            const backCam = devices.find(d => 
              d.label.toLowerCase().includes('back') || 
              d.label.toLowerCase().includes('rear') || 
              d.label.toLowerCase().includes('environment')
            );
            const defaultCamId = backCam ? backCam.id : devices[0].id;
            setSelectedCameraId(defaultCamId);
          }
        })
        .catch((err) => {
          console.error("Gagal mendapatkan kamera:", err);
          setErrorMsg("Izin kamera ditolak atau tidak ada kamera yang terdeteksi.");
        });
    } else {
      stopScanning();
    }
  }, [activeMode]);

  const startScanning = async (cameraIdToUse?: string) => {
    setErrorMsg('');
    const targetCameraId = cameraIdToUse || selectedCameraId;
    
    if (!targetCameraId) {
      setErrorMsg("Kamera tidak ditemukan. Harap izinkan akses kamera.");
      return;
    }

    try {
      // If there's an existing scanner instance, stop it first
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch (e) {
          // ignore
        }
      }

      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;
      setIsScanning(true);

      await html5QrCode.start(
        targetCameraId,
        {
          fps: 15,
          qrbox: (width, height) => {
            const size = Math.min(width, height) * 0.7;
            return { width: size, height: size };
          }
        },
        (decodedText) => {
          // Success
          setScannedSku(decodedText);
          const found = items.find(i => 
            i.sku.toLowerCase() === decodedText.toLowerCase() || 
            i.sku.replace(/[-\s]/g, '').toLowerCase() === decodedText.replace(/[-\s]/g, '').toLowerCase()
          );
          setScannedItem(found || null);
          
          if (navigator.vibrate) {
            navigator.vibrate(100);
          }
          
          stopScanning();
        },
        () => {
          // Failure callback is empty to avoid excessive logs
        }
      );
    } catch (err: any) {
      console.error("Camera start error:", err);
      setErrorMsg(err?.message || "Gagal memulai kamera. Pastikan kamera tidak sedang digunakan aplikasi lain.");
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedSku) return;
    const found = items.find(i => 
      i.sku.toLowerCase() === scannedSku.toLowerCase() || 
      i.sku.replace(/[-\s]/g, '').toLowerCase() === scannedSku.replace(/[-\s]/g, '').toLowerCase()
    );
    setScannedItem(found || null);
  };

  const handleCameraChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedCameraId(newId);
    if (isScanning) {
      await stopScanning();
      setTimeout(() => {
        startScanning(newId);
      }, 300);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 max-w-2xl mx-auto w-full pt-4 px-2 sm:pt-8">
      <style>{`
        #reader {
          border: none !important;
          background: rgba(0, 0, 0, 0.4) !important;
          border-radius: 1.5rem;
          overflow: hidden;
          position: relative;
        }
        #reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 1.5rem;
        }
        #reader img {
          display: none !important;
        }
        @keyframes scan-line {
          0% { transform: translateY(0); }
          50% { transform: translateY(220px); }
          100% { transform: translateY(0); }
        }
        .animate-scan {
          animation: scan-line 3s infinite linear;
        }
      `}</style>

      <div className="text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase tracking-wider text-gradient">Scanner Barcode</h2>
        <p className="text-xs sm:text-sm font-mono font-medium text-slate-400 mt-2 uppercase tracking-wider">Pindai Barcode / QR Code barang menggunakan kamera smartphone atau input manual</p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full sm:w-80 mx-auto sm:mx-0">
        <button
          onClick={() => { setActiveMode('camera'); setScannedItem(null); setScannedSku(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all ${
            activeMode === 'camera' 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Camera size={16} />
          Kamera
        </button>
        <button
          onClick={() => { setActiveMode('manual'); setScannedItem(null); setScannedSku(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all ${
            activeMode === 'manual' 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Search size={16} />
          Input Manual
        </button>
      </div>

      <div className="glass-panel rounded-3xl p-4 sm:p-8">
        {activeMode === 'camera' ? (
          <div className="space-y-6">
            {/* Camera Preview Area */}
            <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-3xl bg-black/40 border border-white/10 overflow-hidden flex flex-col items-center justify-center">
              
              {/* Scan box visual overlay when scanning */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
                  <div className="w-[70%] max-w-[250px] aspect-square border-2 border-purple-500/50 rounded-2xl relative shadow-[0_0_30px_rgba(139,92,246,0.15)] bg-purple-500/[0.03]">
                    {/* Corners */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-md"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-md"></div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-purple-500 rounded-bl-md"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-purple-500 rounded-br-md"></div>
                    
                    {/* Laser scanning line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_12px_#c084fc] animate-scan"></div>
                  </div>
                  <p className="mt-4 text-xs font-mono text-slate-300 uppercase tracking-widest bg-black/70 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                    Mencari Barcode/QR Code...
                  </p>
                </div>
              )}

              {/* HTML5-qrcode mounting node */}
              <div 
                id="reader" 
                className={`w-full h-full ${isScanning ? 'block' : 'hidden'}`}
              ></div>

              {!isScanning && (
                <div className="text-center p-6 space-y-4">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto shadow-inner text-slate-400">
                    <Scan size={32} />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Kamera Dinonaktifkan</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Klik tombol di bawah untuk mengaktifkan kamera smartphone Anda dan memindai secara instan.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-xs font-mono text-center">
                {errorMsg}
              </div>
            )}

            {/* Camera Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {cameras.length > 1 && (
                <div className="w-full sm:flex-1">
                  <label className="block text-[10px] font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">Pilih Kamera</label>
                  <div className="relative">
                    <select
                      value={selectedCameraId}
                      onChange={handleCameraChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none"
                    >
                      {cameras.map((device, idx) => (
                        <option key={device.id} value={device.id} className="bg-[#181825] text-slate-200">
                          {device.label || `Kamera ${idx + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={isScanning ? stopScanning : () => startScanning()}
                className={`w-full ${cameras.length > 1 ? 'sm:w-auto sm:px-8' : 'w-full'} flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-display font-bold text-sm uppercase tracking-wider border transition-all ${
                  isScanning 
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                }`}
              >
                {isScanning ? (
                  <>
                    <CameraOff size={18} />
                    Matikan Kamera
                  </>
                ) : (
                  <>
                    <Camera size={18} />
                    Mulai Scan
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleManualSearch} className="space-y-6">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">SKU / Barcode</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text"
                  autoFocus
                  placeholder="Masukkan SKU barang secara manual..."
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-slate-500"
                  value={scannedSku}
                  onChange={(e) => setScannedSku(e.target.value)}
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={!scannedSku}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-purple-600 text-white py-3 rounded-xl font-display font-bold text-sm sm:text-base uppercase transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-white/10 tracking-wider disabled:shadow-none"
            >
              Cari Barang
            </button>
          </form>
        )}

        {/* Scan Result Section */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <h4 className="text-[10px] sm:text-xs font-mono font-medium text-slate-400 mb-4 uppercase tracking-widest">Hasil Scan / Pencarian</h4>
          
          {scannedItem ? (
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-purple-500/30 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[30px] rounded-full -z-10"></div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 border-b border-white/10 pb-4">
                <div>
                  <h5 className="text-lg sm:text-xl font-display font-bold text-white uppercase tracking-wide">{scannedItem.name}</h5>
                  <p className="font-mono text-xs sm:text-sm text-slate-400 mt-1">{scannedItem.sku}</p>
                </div>
                <span className="self-start px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase font-mono rounded-md tracking-wider">
                  Ditemukan
                </span>
              </div>
              <div className="mt-4 flex gap-6 sm:gap-8 flex-wrap">
                <div>
                  <span className="font-mono text-[10px] font-medium uppercase text-slate-500 block mb-1 tracking-wider">Kategori</span>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">{scannedItem.category}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] font-medium uppercase text-slate-500 block mb-1 tracking-wider">Letak/Posisi</span>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">{scannedItem.location || 'Gudang'}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] font-medium uppercase text-slate-500 block mb-1 tracking-wider">Stok</span>
                  <span className={`text-xs sm:text-sm font-bold ${scannedItem.stock === 0 ? 'text-red-400' : scannedItem.stock <= 5 ? 'text-orange-400' : 'text-white'}`}>
                    {scannedItem.stock}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[10px] font-medium uppercase text-slate-500 block mb-1 tracking-wider">Status</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider ${
                    scannedItem.status === 'Tersedia' ? 'bg-emerald-500/10 text-emerald-300' :
                    scannedItem.status === 'Stok Menipis' ? 'bg-orange-500/10 text-orange-300' :
                    'bg-red-500/10 text-red-300'
                  }`}>
                    {scannedItem.status}
                  </span>
                </div>
              </div>
            </div>
          ) : scannedItem === null && scannedSku ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
              <p className="font-display font-bold text-white uppercase text-base sm:text-lg tracking-wider">Barang tidak ditemukan</p>
              <p className="font-mono text-xs sm:text-sm mt-2 text-slate-400">Barcode/SKU "{scannedSku}" belum terdaftar dalam sistem.</p>
            </div>
          ) : (
            <div className="h-32 border border-dashed border-white/20 rounded-2xl bg-white/5 flex items-center justify-center text-center p-4">
              <p className="text-slate-500 font-mono text-xs sm:text-sm uppercase tracking-wider">Mulai pemindaian kamera atau masukkan kode secara manual</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
