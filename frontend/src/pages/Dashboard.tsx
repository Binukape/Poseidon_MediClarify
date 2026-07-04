import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, FileText, FolderHeart, Mic2, ArrowRight, ShieldCheck } from "lucide-react";

type Vitals = {
  name?: string;
  email?: string;
  weightKg?: number | string | null;
  heightCm?: number | string | null;
  bloodType?: string | null;
  knownAllergies?: string | null;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [vitals, setVitals] = useState<Vitals | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setVitals(null);
      return;
    }

    let active = true;
    void api.getVitals(user.id).then((data) => {
      if (!active) return;
      const patient = data && typeof data === "object" ? data : null;
      setVitals(patient ?? null);
    }).catch(() => {
      if (active) setVitals(null);
    });

    return () => {
      active = false;
    };
  }, [user?.id]);

  const quickActions = [
    { title: "Consultations", description: "Record visits and review plain-language summaries.", href: "/consultations", icon: Mic2 },
    { title: "Medical Vault", description: "Store reports, scans, and prescriptions in one place.", href: "/medical-vault", icon: FolderHeart },
    { title: "Generate Report", description: "Download a consolidated health summary for your doctor.", href: "/report", icon: FileText },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="secondary" className="mb-3 gap-1.5">
            <ShieldCheck size={12} /> Secure care workspace
          </Badge>
          <h1 className="text-2xl font-bold text-foreground">Welcome{vitals?.name ? `, ${vitals.name}` : ""}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Keep your consultations, documents, and patient profile in sync from one dashboard.
          </p>
        </div>
        <Button asChild className="gradient-hero text-primary-foreground hover:opacity-90 gap-2">
          <Link to="/consultations">
            Start a consultation <ArrowRight size={15} />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quickActions.map((item) => (
          <Card key={item.title} className="shadow-card border-border">
            <CardHeader className="space-y-3">
              <div className="h-11 w-11 rounded-xl gradient-hero flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <Button asChild variant="outline" className="w-full justify-between">
                <Link to={item.href}>
                  Open
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Profile Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
              <p className="mt-1 text-sm font-medium text-foreground break-all">{user?.email ?? "Not available"}</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Blood Type</p>
              <p className="mt-1 text-sm font-medium text-foreground">{vitals?.bloodType || "Not set"}</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Weight</p>
              <p className="mt-1 text-sm font-medium text-foreground">{vitals?.weightKg ? `${vitals.weightKg} kg` : "Not set"}</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Height</p>
              <p className="mt-1 text-sm font-medium text-foreground">{vitals?.heightCm ? `${vitals.heightCm} cm` : "Not set"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Health Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-xl bg-primary/5 p-4">
              <p className="text-xs uppercase tracking-wide text-primary font-semibold">Allergies</p>
              <p className="mt-1 text-foreground">{vitals?.knownAllergies || "No allergies recorded."}</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4 flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-primary" />
              <p className="text-muted-foreground">Your latest consultations and documents are available from the sidebar.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}