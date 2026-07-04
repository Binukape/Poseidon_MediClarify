import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4 animate-fade-in">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">404</p>
        <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you requested does not exist or was moved.
        </p>
        <Button asChild className="gradient-hero text-primary-foreground hover:opacity-90">
          <Link to="/">Return to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}