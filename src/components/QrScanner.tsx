import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useZxing } from "react-zxing";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import ScannerOverlay from "./ScannerOverlay";

interface QrScannerProps {
  onScanSuccess: (data: string) => void;
  onClose: () => void;
  closeOnScanSuccess: boolean;
  format: BarcodeFormat;
  square?: boolean;
  instructions: string;
}

export default function QrScanner({
  onScanSuccess,
  onClose,
  closeOnScanSuccess,
  format,
  square = false,
  instructions
}: QrScannerProps) {

  // 1. Camera State
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [isSwitching, setIsSwitching] = useState(false); // UI Lock during switch

  // 2. Scan Throttling (Prevents spamming success)
  const lastScanRef = useRef<{ code: string; time: number } | null>(null);

  const handleScan = useCallback((decodedText: string) => {
    const now = Date.now();
    // 2-second cooldown for the EXACT same code to prevent double-reads
    if (
      lastScanRef.current &&
      lastScanRef.current.code === decodedText &&
      now - lastScanRef.current.time < 500
    ) {
      return;
    }

    lastScanRef.current = { code: decodedText, time: now };
    onScanSuccess(decodedText);

    if (closeOnScanSuccess) {
      onClose();
    }
  }, [onScanSuccess, onClose, closeOnScanSuccess]);

  // 3. Initialize Camera List (Run once)
  useEffect(() => {
    let mounted = true;
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === "videoinput");

        if (!mounted) return;
        setVideoDevices(videoInputs);

        // Auto-select "Back" camera
        const backCamera = videoInputs.find(
          (d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("trasera")
        );

        if (backCamera) {
          setDeviceId(backCamera.deviceId);
        } else if (videoInputs.length > 0) {
          setDeviceId(videoInputs[0].deviceId);
        }
      } catch (err) {
        console.error("Error listing cameras:", err);
      }
    };

    getCameras();
    return () => { mounted = false; };
  }, []);

  // 4. PERFORMANCE FIX: Memoize constraints
  // This object MUST stay stable, otherwise the camera restarts on every render.
  const constraints = useMemo(() => ({
    video: {
      deviceId: deviceId ? { exact: deviceId } : undefined,
      // If we don't have a specific ID yet, ask for "environment" (back camera)
      facingMode: deviceId ? undefined : "environment",
      // PDF417 needs pixels. 1080p is ideal.
      width: { ideal: 1280 },
      height: { ideal: 720 },
      focusMode: "continuous",

    },
  }), [deviceId]);

  // 5. PERFORMANCE FIX: Memoize hints
  const hints = useMemo(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [format])
    return hints;
  }, [format]);

  // 6. The Hook
  const { ref } = useZxing({
    onDecodeResult(result) {
      handleScan(result.getText());
    },
    hints,
    constraints,
    // PERFORMANCE FIX: Slower checks (500ms) = Less lag
    timeBetweenDecodingAttempts: 200,
  });

  // 7. Robust Switch Logic
  const handleSwitchCamera = useCallback(() => {
    if (videoDevices.length < 2 || isSwitching) return;

    setIsSwitching(true); // Lock button

    // Calculate next camera
    const currentIdx = videoDevices.findIndex(d => d.deviceId === deviceId);
    // If current is not found, start at 0. Otherwise next.
    const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % videoDevices.length;

    setDeviceId(videoDevices[nextIdx].deviceId);

    // Unlock after 1s (allows camera hardware to settle)
    setTimeout(() => setIsSwitching(false), 1000);
  }, [videoDevices, deviceId, isSwitching]);

  return (
    <div className="fixed inset-0 bg-black z-[1000] overflow-hidden">
      {/* Video Element */}
      <video
        ref={ref as React.RefObject<HTMLVideoElement>}
        className={`h-full w-full object-cover transition-opacity duration-300 ${isSwitching ? 'opacity-50' : 'opacity-100'}`}
        muted
        playsInline
      />

      <ScannerOverlay
        onClose={onClose}
        onSwitchCamera={handleSwitchCamera}
        square={square}
        instructions={instructions}
      />
    </div>
  );
}