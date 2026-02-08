import { Link } from "react-router-dom";
import PixelParticles from "@/components/PixelParticles";

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <PixelParticles count={30} />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Event branding */}
        <div className="mb-2">
          <span className="font-pixel text-xs text-muted-foreground tracking-widest">TEAM CSI PRESENTS</span>
        </div>

        <h1 className="font-pixel text-4xl md:text-6xl text-mc-gold mb-2 drop-shadow-lg">
          CUBIX
        </h1>

        <div className="mb-8">
          <span className="font-pixel text-lg md:text-2xl text-mc-green">
            ⚔ SPYCODE ⚔
          </span>
        </div>

        <p className="font-silk text-muted-foreground text-sm md:text-base mb-12 max-w-lg mx-auto">
          A battle of wits, code, and strategy. Earn Skulls, build Shields, and survive the Grand Finale.
        </p>

        {/* Round buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/round1" className="mc-btn px-6 py-4 text-xs font-pixel text-foreground w-64 text-center">
            🟢 ROUND 1<br />
            <span className="text-muted-foreground text-[10px] mt-1 block">Spy Game</span>
          </Link>

          <Link to="/round2" className="mc-btn px-6 py-4 text-xs font-pixel text-foreground w-64 text-center">
            🟡 ROUND 2<br />
            <span className="text-muted-foreground text-[10px] mt-1 block">Packet Purchase</span>
          </Link>

          <Link to="/round3" className="mc-btn px-6 py-4 text-xs font-pixel text-mc-red w-64 text-center">
            🔴 GRAND FINALE<br />
            <span className="text-muted-foreground text-[10px] mt-1 block">Champion Rush</span>
          </Link>
        </div>

        {/* Admin link */}
        <div className="mt-12">
          <Link to="/admin" className="font-silk text-xs text-muted-foreground hover:text-foreground transition-colors">
            Admin Panel →
          </Link>
        </div>
      </div>

      {/* Ground blocks */}
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-mc-dirt border-t-4 border-mc-stone z-0" />
    </div>
  );
};

export default Index;
