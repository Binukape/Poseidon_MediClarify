import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AudioRecorder } from "@/components/AudioRecorder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mic2, CalendarDays, BookOpen, ListChecks, Loader2 } from "lucide-react";

interface Consultation {
  id: string;
  createdAt: string;
  simplifiedText: string;
  keyInstructions: string;
  audioUrl?: string;
}

export default function Consultations() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConsultations = async () => {
    if (!user?.id) return;
    try {
      const data = await api.getConsultationHistory(user.id);
      setConsultations(Array.isArray(data) ? data : []);
    } catch { setConsultations([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchConsultations(); }, [user?.id]);

  const handleAudioUpload = async (blob: Blob) => {
    if (!user?.id) return;
    await api.uploadAudio(blob, user.id);
    fetchConsultations();
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="h-9 w-9 rounded-xl gradient-hero flex items-center justify-center">
            <Mic2 size={18} className="text-primary-foreground" />
          </span>
          Consultations
        </h1>
        <p className="text-sm text-muted-foreground mt-1 ml-12">
          Record doctor visits and get AI-generated plain-language summaries.
        </p>
      </div>

      {/* Recorder Card */}
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-base">New Consultation Recording</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Record directly in your browser, or upload an existing <code>.mp3</code> / <code>.webm</code> / <code>.wav</code> file.
            Our AI will transcribe and simplify it for you.
          </p>
          <AudioRecorder patientId={user?.id ?? ""} onUpload={handleAudioUpload} />
        </CardContent>
      </Card>

      {/* History */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">Past Consultations ({consultations.length})</h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : consultations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <Mic2 size={36} className="mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">No recordings yet. Start your first consultation above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((c, i) => (
              <Card key={c.id} className="shadow-card border-border hover:shadow-elevated transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays size={14} />
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric",
                      })}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Consultation #{consultations.length - i}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Audio player */}
                  {c.audioUrl && (
                    <audio controls className="w-full h-9 rounded-lg" src={c.audioUrl} />
                  )}

                  {/* Summary */}
                  <div className="bg-primary/5 rounded-xl p-4 space-y-1">
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-wide flex items-center gap-1.5">
                      <BookOpen size={12} /> Patient-Friendly Summary
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      {c.simplifiedText || <span className="text-muted-foreground italic">Summary pending…</span>}
                    </p>
                  </div>

                  {/* Key Instructions */}
                  {c.keyInstructions && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        <h3 className="text-xs font-semibold text-accent uppercase tracking-wide flex items-center gap-1.5">
                          <ListChecks size={12} /> Key Instructions
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">{c.keyInstructions}</p>
                      </div>
                    </>
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