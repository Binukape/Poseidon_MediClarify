import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2, CheckCircle, Sparkles } from "lucide-react";

export default function Report() {
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!user?.id) return;
    setError(null);
    setGenerating(true);
    try {
      const content = await api.generateReport(user.id);
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `health-report-${new Date().toISOString().split("T")[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch {
      setError("Failed to generate report. Please try again.");
    }
    setGenerating(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="h-9 w-9 rounded-xl gradient-hero flex items-center justify-center">
            <FileDown size={18} className="text-primary-foreground" />
          </span>
          Generate Report
        </h1>
        <p className="text-sm text-muted-foreground mt-1 ml-12">
          Compile all your health data into a comprehensive downloadable report.
        </p>
      </div>

      <Card className="shadow-elevated border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            Master Health Summary
          </CardTitle>
          <CardDescription>
            This report includes your vitals, all consultation summaries, and a list of your stored medical documents — formatted for your doctor or personal records.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-muted/60 p-4 space-y-2 text-sm text-muted-foreground">
            <p>✅ Personal vitals (weight, height, blood type, allergies)</p>
            <p>✅ All AI-simplified consultation summaries</p>
            <p>✅ Key doctor instructions per visit</p>
            <p>✅ List of uploaded medical documents</p>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <Button
            onClick={handleGenerate}
            disabled={generating || done}
            className="gap-2 gradient-hero text-primary-foreground hover:opacity-90 h-11 px-6"
          >
            {generating && <Loader2 size={15} className="animate-spin" />}
            {done && <CheckCircle size={15} />}
            <FileDown size={15} />
            {generating ? "Generating…" : done ? "Downloaded!" : "Download Health Report"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}