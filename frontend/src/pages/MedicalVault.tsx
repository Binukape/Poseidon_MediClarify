import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { FileUploader } from "@/components/FileUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderHeart, FileText, Image, Download, CalendarDays, Loader2 } from "lucide-react";

interface MedicalRecord {
  id: string;
  fileName: string;
  fileType: string;
  filePath: string;
  uploadedAt: string;
}

export default function MedicalVault() {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    if (!user?.id) return;
    try {
      const data = await api.getMedicalRecords(user.id);
      setRecords(Array.isArray(data) ? data : []);
    } catch { setRecords([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRecords(); }, [user?.id]);

  const handleUpload = async (file: File) => {
    if (!user?.id) return;
    await api.uploadMedicalDoc(file, user.id);
    fetchRecords();
  };

  const FileIcon = ({ type }: { type: string }) => {
    if (type?.includes("pdf")) return <FileText className="h-6 w-6 text-destructive/70" />;
    return <Image className="h-6 w-6 text-primary" />;
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center">
            <FolderHeart size={18} className="text-accent-foreground" />
          </span>
          Medical Vault
        </h1>
        <p className="text-sm text-muted-foreground mt-1 ml-12">
          Securely store and access your medical documents — lab results, prescriptions, scans.
        </p>
      </div>

      {/* Upload area */}
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Upload a Document</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploader patientId={user?.id ?? ""} onUpload={handleUpload} />
        </CardContent>
      </Card>

      {/* Documents grid */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">
          Stored Documents ({records.length})
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <FolderHeart size={36} className="mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">Your vault is empty. Upload your first document above.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((r) => (
              <Card key={r.id} className="shadow-card border-border hover:shadow-elevated transition-shadow duration-200 group">
                <CardContent className="p-4">
                  {/* Preview area */}
                  <div className="h-32 rounded-lg bg-muted flex items-center justify-center mb-3 group-hover:bg-muted/70 transition-colors">
                    {r.fileType?.includes("image") && r.filePath ? (
                      <img src={r.filePath} alt={r.fileName} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <FileIcon type={r.fileType} />
                    )}
                  </div>

                  <p className="text-sm font-medium text-foreground truncate mb-1">{r.fileName}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <CalendarDays size={11} />
                    {new Date(r.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>

                  {r.filePath && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 text-xs"
                      asChild
                    >
                      <a href={r.filePath} download={r.fileName} target="_blank" rel="noopener noreferrer">
                        <Download size={12} /> Download
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
