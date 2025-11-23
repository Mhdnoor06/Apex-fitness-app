"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ScannerPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [manualInput, setManualInput] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError("");
      console.log("Starting camera...");

      // Set scanning to true first to show video element
      setScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });

      console.log("Camera stream obtained:", stream);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Video srcObject set");

        // Play the video
        try {
          await videoRef.current.play();
          console.log("Video playing");
        } catch (playError) {
          console.error("Error playing video:", playError);
        }
      }
    } catch (err) {
      console.error("Camera error:", err);
      setScanning(false);
      setError("Unable to access camera. Please allow camera permissions or enter barcode manually.");
      setManualInput(true);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const lookupBarcode = async (code: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/barcode-lookup?code=${code}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to lookup barcode");
      }

      if (data.product) {
        // Navigate to nutrition page with pre-filled data
        const params = new URLSearchParams({
          name: data.product.name,
          calories: data.product.calories.toString(),
          protein: data.product.protein.toString(),
          carbs: data.product.carbs.toString(),
          fat: data.product.fat.toString(),
          servingSize: data.product.servingSize || "",
          barcode: code,
        });
        router.push(`/nutrition?${params.toString()}`);
      }
    } catch (err) {
      console.error("Lookup error:", err);
      setError(err instanceof Error ? err.message : "Failed to lookup barcode");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      lookupBarcode(barcode.trim());
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col pb-24">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-background-light dark:bg-background-dark z-10">
        <Link
          href="/nutrition"
          className="flex size-10 shrink-0 items-center justify-center text-slate-800 dark:text-white"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center">
          Scan Barcode
        </h2>
        <div className="w-10"></div>
      </div>

      {/* Instructions */}
      <div className="px-4 pt-2">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
              info
            </span>
            <div className="flex-1">
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                How to scan
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Point your camera at a food barcode or enter the numbers manually below
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Camera View */}
      {!manualInput && (
        <div className="px-4 pt-4">
          <div className="bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden shadow-sm">
            {scanning ? (
              <div className="relative aspect-[4/3] bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-40 border-2 border-white rounded-lg relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-start"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-start"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-start"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-start"></div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-full inline-block">
                    Align barcode within frame
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-center p-8">
                <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-500 mb-4">
                  qr_code_scanner
                </span>
                <p className="text-slate-600 dark:text-slate-400 text-center mb-2">
                  Camera not active
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 text-center">
                  Click the button below to start scanning
                </p>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="flex gap-2 mt-4">
            {scanning ? (
              <button
                onClick={stopCamera}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500 text-white px-4 py-3 text-base font-medium shadow-lg"
              >
                <span className="material-symbols-outlined">stop_circle</span>
                Stop Camera
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-white px-4 py-3 text-base font-medium shadow-lg"
              >
                <span className="material-symbols-outlined">videocam</span>
                Start Camera
              </button>
            )}
            <button
              onClick={() => setManualInput(!manualInput)}
              className="flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-3 text-base font-medium shadow-lg"
            >
              <span className="material-symbols-outlined">keyboard</span>
            </button>
          </div>
        </div>
      )}

      {/* Manual Input */}
      <div className="px-4 pt-4">
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 dark:text-white text-base font-semibold">
              Enter Barcode Manually
            </h3>
            {manualInput && (
              <button
                onClick={() => {
                  setManualInput(false);
                  setBarcode("");
                }}
                className="text-sm text-primary-start font-medium"
              >
                Use Camera
              </button>
            )}
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="e.g., 012345678901"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-center text-lg tracking-wider font-mono"
                pattern="[0-9]*"
                inputMode="numeric"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                Enter the numbers found below the barcode
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !barcode.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-white px-4 py-3 text-base font-medium shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Looking up...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">search</span>
                  Lookup Product
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 pt-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                error
              </span>
              <div className="flex-1">
                <p className="text-sm text-red-900 dark:text-red-100 font-medium mb-1">
                  Error
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="px-4 pt-4">
        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
          <h4 className="text-slate-900 dark:text-white text-sm font-semibold mb-3">
            Tips for best results
          </h4>
          <ul className="space-y-2">
            <li className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Ensure good lighting when scanning</span>
            </li>
            <li className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Hold phone steady and align barcode in frame</span>
            </li>
            <li className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>If scanning fails, try entering the numbers manually</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
