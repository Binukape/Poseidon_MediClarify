import { useCallback, useState } from "react";
import { Upload, FileText, Image, Loader2, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  patientId: string;
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  compact?: boolean;
}

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

export function FileUploader({ patientId: _patientId, onUpload, accept = ".pdf,.jpg,.jpeg,.png", compact = false }: FileUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Unsupported file type. Please upload PDF, JPG, or PNG.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File too large. Maximum size is 20 MB.");
      return;
    }
    setError(null);
    setFileName(file.name);
    setUploading(true);
    try {
      await onUpload(file);
      setDone(true);
      setTimeout(() => { setDone(false); setFileName(null); }, 3000);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const FileIcon = ({ type }: { type: string }) => {
    if (type?.includes("pdf")) return <FileText className="h-10 w-10 text-destructive/70" />;
    if (type?.includes("image")) return <Image className="h-10 w-10 text-primary/70" />;
    return <Upload className="h-10 w-10 text-muted-foreground" />;
  };

  if (compact) {
    return (
      <label className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200",
        dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-primary/5",
        uploading && "opacity-60 pointer-events-none"
      )}>
        {uploading ? <Loader2 size={16} className="animate-spin text-primary" /> : <Upload size={16} className="text-muted-foreground" />}
        <span className="text-sm text-muted-foreground">
          {uploading ? "Uploading…" : done ? "Uploaded!" : "Drop or click to upload"}
        </span>
        <input type="file" accept={accept} className="hidden" onChange={onInputChange} />
      </label>
    );
  }

  return (
    <div className="space-y-2">
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-3 w-full rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all duration-200",
          dragging ? "border-primary bg-primary/8 scale-[1.01]" : "border-border hover:border-primary/60 hover:bg-primary/4",
          uploading && "opacity-60 pointer-events-none",
          done && "border-health-green bg-health-green/5"
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading <strong>{fileName}</strong>…</p>
          </>
        ) : done ? (
          <>
            <CheckCircle className="h-10 w-10 text-health-green" />
            <p className="text-sm text-health-green font-medium">{fileName} uploaded!</p>
          </>
        ) : (
          <>
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Drag & drop your file here</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG — up to 20 MB</p>
            </div>
            <span className="text-xs text-primary font-medium underline underline-offset-2">or click to browse</span>
          </>
        )}
        <input type="file" accept={accept} className="hidden" onChange={onInputChange} />
      </label>
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/8 px-3 py-2 rounded-lg">
          <X size={14} />
          {error}
        </div>
      )}
    </div>
  );
}
