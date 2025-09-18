import React, { useRef, useEffect, useState } from "react";

export default function CameraCaptureUpload() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment"); // toggle between "user" and "environment"
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // re-run when facingMode changes to switch camera
  }, [facingMode]);

  async function startCamera() {
    setError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera API not supported.");
      return;
    }
    try {
      const constraints = {
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      await videoRef.current.play();
    } catch (e) {
      console.error(e);
      setError(e.name === "NotAllowedError" ? "Permission denied." : e.message);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  // resize function: downscale to maxWidth for faster upload
  async function captureResizeBlob(maxWidth = 800, quality = 0.8) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    const originalW = video.videoWidth || 1280;
    const originalH = video.videoHeight || 720;
    const scale = Math.min(1, maxWidth / originalW);
    const w = Math.round(originalW * scale);
    const h = Math.round(originalH * scale);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    return blob;
  }

  async function captureAndUpload() {
    setError(null);
    try {
      const blob = await captureResizeBlob(800, 0.8);
      if (!blob) { setError("Capture failed"); return; }

      const fd = new FormData();
      fd.append("file", blob, "capture.jpg");

      setUploading(true);
      const res = await fetch("/api/analyze-food", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Server error: " + res.status);
      const json = await res.json();
      setResult(json); // expected: prediction, calories, etc.
      setUploading(false);
    } catch (e) {
      console.error("upload error", e);
      setError(e.message || "Upload failed");
      setUploading(false);
    }
  }

  return (
    <>
    <div>
      <h3>Food Scanner</h3>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <video ref={videoRef} autoPlay playsInline muted width="360" height="270" />
      <div style={{ marginTop: 8 }}>
        <button onClick={() => setFacingMode((s) => (s === "environment" ? "user" : "environment"))}>
          Switch camera
        </button>
        <button onClick={captureAndUpload} disabled={uploading} style={{ marginLeft: 8 }}>
          {uploading ? "Uploading..." : "Capture & Analyze"}
        </button>
        <button onClick={stopCamera} style={{ marginLeft: 8 }}>Stop</button>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {result && (
        <div style={{ marginTop: 12 }}>
          <h4>Analysis</h4>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <small>Fallback file upload:</small>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={async (e) => {
            const f = e.target.files && e.target.files[0];
            if (!f) return;
            setUploading(true);
            const fd = new FormData();
            fd.append("file", f);
            try {
              const res = await fetch("/api/analyze-food", { method: "POST", body: fd });
              const json = await res.json();
              setResult(json);
            } catch (err) {
              setError("Upload failed");
            } finally {
              setUploading(false);
            }
          }}
        />
      </div>
    </div>
    <div>
           <button onClick={CameraCaptureUpload}>Take Photo</button>

    </div>
</>
  );
}

