import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [secret, setSecret] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("cubix_admin_auth") === "true") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

    if (!ADMIN_SECRET) {
      toast({
        title: "CONFIG ERROR",
        description: "Admin secret not configured.",
        variant: "destructive",
      });
      return;
    }

    if (secret === ADMIN_SECRET) {
      localStorage.setItem("cubix_admin_auth", "true");
      toast({
        title: "ACCESS GRANTED",
        description: "Welcome back, Commander.",
        className: "font-pixel bg-mc-stone text-white border-2 border-black",
      });
      navigate("/admin/dashboard");
    } else {
      toast({
        title: "ACCESS DENIED",
        description: "Invalid security key.",
        variant: "destructive",
        className: "font-pixel border-2 border-black",
      });
      setSecret("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black/80">
      <div className="mc-panel p-8 w-full max-w-md border-4 border-mc-stone shadow-[8px_8px_0_0_#000]">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 mb-4 text-4xl animate-bounce">🗝️</div>
          <h1 className="font-pixel text-xl text-mc-gold tracking-widest">
            RESTRICTED AREA
          </h1>
          <p className="font-silk text-xs text-muted-foreground mt-2">
            Enter the admin security key.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter secret key"
            className="bg-black/50 border-2 border-mc-stone text-center text-lg font-pixel text-white h-14 focus:border-mc-green transition-colors"
            autoFocus
          />

          <button
            type="submit"
            className="mc-btn w-full py-4 text-sm font-pixel text-foreground active:translate-y-1"
          >
            UNLOCK CONSOLE
          </button>
        </form>

        <div className="mt-8 text-center border-t-2 border-dashed border-white/10 pt-4">
          <a
            href="/"
            className="font-silk text-xs text-muted-foreground hover:text-mc-gold transition-colors"
          >
            ← Return to Public Scoreboard
          </a>
        </div>
      </div>
    </div>
  );
}
