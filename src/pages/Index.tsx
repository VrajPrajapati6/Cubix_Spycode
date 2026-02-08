import { Link } from "react-router-dom";
import PixelParticles from "@/components/PixelParticles";

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <PixelParticles count={30} />

      <div className="relative z-10 text-center max-w-3xl mx-auto mt-16 md:mt-20">
        {/* Event branding */}
        <div className="mb-2">
          <span className="font-pixel text-sm text-muted-foreground tracking-wider">
            TEAM CSI PRESENTS
          </span>
        </div>

        <h1 className="font-pixel text-4xl md:text-6xl text-mc-gold mb-2 drop-shadow-lg">
          CUBIX
        </h1>

        <div className="mb-8">
          <span className="font-pixel text-lg md:text-2xl text-mc-green">
            ⚔ SPYCODE ⚔
          </span>
        </div>

        <p className="font-silk text-muted-foreground text-base md:text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          A battle of wits, code, and strategy. Earn Skulls, build Shields, and
          survive the Grand Finale.
        </p>

        {/* SINGLE SCOREBOARD BUTTON */}
        <div className="flex justify-center">
          <Link
            to="/scoreboard"
            className="
            mc-btn
            px-5 py-5
            text-xs md:text-sm
            font-pixel
            w-72
            text-center
            text-mc-gold
            bg-[#1a1a1a]
            border-2 border-[#2e2e2e]
            hover:text-[#ffd36a]
            hover:shadow-[0_0_12px_rgba(255,211,106,0.25)]
            transition-all
          "
          >
            VIEW LIVE SCOREBOARD
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
