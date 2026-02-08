import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Scoreboard from "./pages/Scoreboard";
import FinalResult from "./pages/FinalResult";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

import MinecraftBackground from "./components/MinecraftBackground";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* HOME PAGE with Minecraft Background */}
          <Route
            path="/"
            element={
              <MinecraftBackground>
                <Index />
              </MinecraftBackground>
            }
          />

          {/* SINGLE SCOREBOARD PAGE */}
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/final-result" element={<FinalResult />} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* FALLBACK */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
