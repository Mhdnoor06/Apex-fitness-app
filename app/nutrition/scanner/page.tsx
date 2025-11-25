"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

export default function ScannerPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [manualInput, setManualInput] = useState(false);
  const [detectedCode, setDetectedCode] = useState("");
  const [scanStatus, setScanStatus] = useState("Ready to scan");
  const [scanAttempts, setScanAttempts] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  const startCamera = async () => {
    try {
      setError("");
      setDetectedCode("");
      console.log("Starting barcode scanner...");

      setScanning(true);

      // Initialize the barcode reader with better settings
      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserMultiFormatReader();
      }

      const codeReader = codeReaderRef.current;

      // Configure hints for better detection
      const hints = new Map();
      hints.set(2, true); // Enable EAN_13
      hints.set(3, true); // Enable EAN_8
      hints.set(4, true); // Enable UPC_A
      hints.set(5, true); // Enable UPC_E
      codeReader.hints = hints;

      // Get available video devices
      const videoDevices = await codeReader.listVideoInputDevices();
      console.log("Video devices:", videoDevices);

      if (videoDevices.length === 0) {
        throw new Error("No camera found on device");
      }

      // Prefer back camera (environment facing)
      const selectedDevice = videoDevices.find(device =>
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('environment')
      ) || videoDevices[0];

      console.log("Using camera:", selectedDevice.label);

      // Start decoding from video device
      if (videoRef.current) {
        setScanStatus("Scanning... Point at barcode");

        codeReader.decodeFromVideoDevice(
          selectedDevice.deviceId,
          videoRef.current,
          (result, err) => {
            // Increment scan attempts to show activity
            setScanAttempts(prev => prev + 1);

            if (result) {
              const code = result.getText();
              console.log("✓ Barcode detected:", code);
              setDetectedCode(code);
              setScanStatus("Barcode found!");

              // Auto-lookup after detection
              setTimeout(() => {
                stopCamera();
                lookupBarcode(code);
              }, 500); // Small delay to show success message
            }

            if (err && !(err instanceof NotFoundException)) {
              console.error("Decode error:", err);
              setScanStatus("Scanning... Move closer to barcode");
            }
          }
        );
      }
    } catch (err) {
      console.error("Camera error:", err);
      setScanning(false);
      setError("Unable to access camera. Please allow camera permissions or enter barcode manually.");
      setManualInput(true);
    }
  };

  const stopCamera = () => {
    // Stop ZXing reader
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }

    // Stop media stream
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
        // Show detailed error message
        const errorMsg = data.message || data.error || "Failed to lookup barcode";
        throw new Error(errorMsg);
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
    // Cleanup on unmount
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
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
                  {detectedCode ? (
                    <p className="text-white text-sm bg-green-500 px-4 py-2 rounded-full inline-block font-semibold">
                      ✓ Barcode detected: {detectedCode}
                    </p>
                  ) : (
                    <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-full inline-block">
                      Align barcode within frame
                    </p>
                  )}
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
                {error.includes("not in our database") && (
                  <button
                    onClick={() => router.push("/nutrition")}
                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-primary text-white px-4 py-2 text-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-base">add_circle</span>
                    Add Food Manually
                  </button>
                )}
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
              <span>Hold phone steady 4-6 inches from barcode</span>
            </li>
            <li className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Try different angles and distances if not detecting</span>
            </li>
            <li className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Some products may not be in the database - add them manually</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
