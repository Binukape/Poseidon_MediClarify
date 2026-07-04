import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, User, Mail, Scale, Ruler, Droplets, ShieldAlert } from "lucide-react";

type VitalsState = {
  weightKg: string;
  heightCm: string;
  bloodType: string;
  knownAllergies: string;
};

export default function Profile() {
  const { user } = useAuth();
  const [vitals, setVitals] = useState<VitalsState>({
    weightKg: "",
    heightCm: "",
    bloodType: "",
    knownAllergies: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    let active = true;
    void api.getVitals(user.id)
      .then((data) => {
        if (!active) return;
        setVitals({
          weightKg: data?.weightKg?.toString?.() ?? "",
          heightCm: data?.heightCm?.toString?.() ?? "",
          bloodType: data?.bloodType ?? "",
          knownAllergies: data?.knownAllergies ?? "",
        });
      })
      .catch(() => {
        if (active) {
          setVitals({ weightKg: "", heightCm: "", bloodType: "", knownAllergies: "" });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.id]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    setMessage(null);
    try {
      await api.updateVitals(user.id, vitals);
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("Could not save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="h-9 w-9 rounded-xl gradient-hero flex items-center justify-center">
            <User size={18} className="text-primary-foreground" />
          </span>
          Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1 ml-12">
          Review your account details and keep your medical vitals up to date.
        </p>
      </div>

      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-muted/40 p-4 flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground break-all">{user?.email ?? "Not available"}</p>
            </div>
          </div>
          <div className="rounded-xl bg-muted/40 p-4 flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Patient ID</p>
              <p className="text-sm font-medium text-foreground break-all">{user?.id ?? "Not available"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Medical Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={28} />
            </div>
          ) : (
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSave}>
              <div className="space-y-1.5">
                <Label htmlFor="weightKg" className="flex items-center gap-2"><Scale size={14} /> Weight (kg)</Label>
                <Input id="weightKg" value={vitals.weightKg} onChange={(e) => setVitals((current) => ({ ...current, weightKg: e.target.value }))} placeholder="e.g. 72" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="heightCm" className="flex items-center gap-2"><Ruler size={14} /> Height (cm)</Label>
                <Input id="heightCm" value={vitals.heightCm} onChange={(e) => setVitals((current) => ({ ...current, heightCm: e.target.value }))} placeholder="e.g. 168" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bloodType" className="flex items-center gap-2"><Droplets size={14} /> Blood Type</Label>
                <Input id="bloodType" value={vitals.bloodType} onChange={(e) => setVitals((current) => ({ ...current, bloodType: e.target.value }))} placeholder="e.g. O+" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="knownAllergies" className="flex items-center gap-2"><ShieldAlert size={14} /> Known Allergies</Label>
                <Textarea id="knownAllergies" value={vitals.knownAllergies} onChange={(e) => setVitals((current) => ({ ...current, knownAllergies: e.target.value }))} placeholder="List allergies or medication sensitivities" rows={4} />
              </div>

              {message && (
                <p className="sm:col-span-2 text-sm text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">{message}</p>
              )}

              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit" disabled={saving} className="gradient-hero text-primary-foreground hover:opacity-90">
                  {saving && <Loader2 size={15} className="animate-spin mr-2" />}
                  Save Profile
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}