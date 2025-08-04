import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface BarcodeQrScannerProps {
  isActive: boolean;
  save: (documentNumber: string) => void;
  isLoading: boolean;
}

const qrcodeRegionId = "html5qr-code-live-region";

const BarcodeQrScanner: React.FC<BarcodeQrScannerProps> = ({
  isActive,
  save,
  isLoading
}) => {
  const html5QrRef = useRef<InstanceType<typeof Html5Qrcode> | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);
  const isLoadingRef = useRef(false);

  const stopScanner = async () => {
    if (html5QrRef.current && startedRef.current) {
      try {
        if (html5QrRef.current.isScanning) {
          await html5QrRef.current.stop();
        }
        await html5QrRef.current.clear();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error al detener/limpiar el scanner:", error);
      } finally {
        html5QrRef.current = null;
      }
    }

    if (divRef.current) {
      divRef.current.innerHTML = "";
    }
    startedRef.current = false;
  };

  const startScanner = async () => {
    if (startedRef.current || !divRef.current) return;

    startedRef.current = true;
    divRef.current.innerHTML = "";

    html5QrRef.current = new Html5Qrcode(qrcodeRegionId);

    try {
      await html5QrRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 200,
          disableFlip: false
        },
        (decodedText: string) => {

          if (isLoadingRef.current) {
            return;
          }

          if (
            /^\d{8}$/.test(decodedText) ||
            /^([A-Z]{2}\d{6}|[A-Z0-9]{9})$/i.test(decodedText) ||
            /^\d{9}$/.test(decodedText)
          ) {
            save(decodedText);
          }
        },
        () => {}
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("No se pudo iniciar la cámara:", err);
      startedRef.current = false;
      html5QrRef.current = null;
    }
  };

  useEffect(() => {
    if (isActive) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isActive]);

  useEffect(() => {
    if (isLoading) {
      isLoadingRef.current = true;
    } else {
      isLoadingRef.current = false;
    }
  }, [isLoading]);

  return (
    <div ref={divRef} id={qrcodeRegionId} style={{ width: "100%" }} />
  );
};

export default BarcodeQrScanner;
