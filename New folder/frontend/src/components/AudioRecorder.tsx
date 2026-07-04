import { useRef, useState } from "react";
import { Mic, Square, Upload, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AudioRecorderProps {
  patientId: string;
  onUpload: (blob: Blob) => Promise<void>;
  compact?: boolean;
}

type RecordState = "idle" | "recording" | "uploading" | "done";

export function AudioRecorder({ patientId: _patientId, onUpload, compact = false }: AudioRecorderProps) {
  const [state, setState] = useState<RecordState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    setFileError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setState("uploading");
        try {
          await onUpload(blob);
          setState("done");
          setSeconds(0);
          setTimeout(() => setState("idle"), 2500);
        } catch {
          setState("idle");
        }
      };
      mr.start();
      mediaRef.current = mr;
      setState("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setFileError("Microphone access denied. Please enable it in browser settings.");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRef.current?.stop();
    mediaRef.current = null;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    setState("uploading");
    try {
      await onUpload(file);
      setState("done");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setFileError("Upload failed. Please try again.");
      setState("idle");
    }
    e.target.value = "";
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className={cn("flex flex-col gap-3", compact ? "items-center" : "")}>
      {/* Main record button */}
      <div className="flex items-center gap-3">
        {state === "idle" && (
          <>
            <Button
              onClick={startRecording}
              className={cn("gap-2 gradient-hero text-primary-foreground hover:opacity-90 shadow-card", compact ? "h-10 px-4" : "h-11 px-6")}
            >
              <Mic size={16} />
              {!compact && "Start Recording"}
            </Button>
            <Button
              variant="outline"
              size={compact ? "sm" : "default"}
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={15} />
              {!compact && "Upload Audio"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.webm,.wav,.m4a"
              className="hidden"
              onChange={handleFileUpload}
            />
          </>
        )}

        {state === "recording" && (
          <Button
            onClick={stopRecording}
            variant="destructive"
            className={cn("gap-2", compact ? "h-10 px-4" : "h-11 px-6")}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive-foreground opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive-foreground" />
            </span>
            <Square size={14} />
            {!compact && <span>Stop — {fmt(seconds)}</span>}
            {compact && <span>{fmt(seconds)}</span>}
          </Button>
        )}

        {state === "uploading" && (
          <Button disabled className={cn("gap-2", compact ? "h-10 px-4" : "h-11 px-6")}>
            <Loader2 size={15} className="animate-spin" />
            {!compact && "Processing…"}
          </Button>
        )}

        {state === "done" && (
          <Button disabled variant="outline" className={cn("gap-2 text-health-green border-health-green/40", compact ? "h-10 px-4" : "h-11 px-6")}>
            <CheckCircle size={15} />
            {!compact && "Uploaded!"}
          </Button>
        )}
      </div>

      {fileError && <p className="text-destructive text-sm">{fileError}</p>}
    </div>
  );
}