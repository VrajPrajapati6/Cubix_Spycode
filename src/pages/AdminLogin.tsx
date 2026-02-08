import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({ title: "Login failed", description: error.message, variant: "destructive" });
        } else {
          navigate("/admin/dashboard");
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          toast({ title: "Signup failed", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Check your email", description: "Confirm your email to continue." });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="mc-panel p-8 w-full max-w-md">
        <h1 className="font-pixel text-xl text-mc-gold text-center mb-6">
          ⚙️ ADMIN
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-pixel text-[10px] text-muted-foreground mb-1 block">EMAIL</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-mc-stone font-silk"
              required
            />
          </div>
          <div>
            <label className="font-pixel text-[10px] text-muted-foreground mb-1 block">PASSWORD</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary border-mc-stone font-silk"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mc-btn w-full py-3 text-xs font-pixel text-foreground disabled:opacity-50"
          >
            {submitting ? "..." : isLogin ? "LOGIN" : "SIGN UP"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 w-full text-center font-silk text-xs text-muted-foreground hover:text-foreground"
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>

        <div className="mt-6 text-center">
          <a href="/" className="font-silk text-xs text-muted-foreground hover:text-foreground">
            ← Back to scoreboard
          </a>
        </div>
      </div>
    </div>
  );
}
