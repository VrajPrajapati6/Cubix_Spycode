import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Team = {
  _id: string;
  teamName: string;
  skulls: number;
};

const API = `${import.meta.env.VITE_API_URL}/final-result`;

function PodiumColumn({
  label,
  trophy,
  trophyColor,
  name,
  prize,
  prizeColor,
  boxBorder,
  boxBg,
  blockHeight,
}: {
  label: string;
  trophy: string;
  trophyColor: string;
  name: string;
  prize: string;
  prizeColor: string;
  boxBorder: string;
  boxBg: string;
  blockHeight: string;
}) {
  return (
    <div className="flex-1 max-w-[180px] md:max-w-[220px] flex flex-col items-center">
      <div className="flex items-center justify-center my-1">
        <span className="text-4xl md:text-6xl drop-shadow-lg">{trophy}</span>
      </div>

      <div
        className={`w-full mt-2 rounded border-2 ${boxBorder} ${boxBg}
        px-2 py-3 text-center font-pixel min-h-[4rem]
        flex flex-col items-center justify-center gap-0.5`}
      >
        <span className={`text-[10px] sm:text-xs ${trophyColor}`}>{label}</span>
        <span className="text-xs md:text-sm text-white/90">{name}</span>
      </div>

      <div
        className={`w-full ${blockHeight} rounded border-2 border-[#4a4a4a]
        bg-[#1a1a1a]/80 mt-1 flex items-center justify-center
        font-pixel text-sm md:text-base ${prizeColor}`}
      >
        {prize}
      </div>
    </div>
  );
}

export default function FinalResult() {
  const [published, setPublished] = useState(false);
  const [top3, setTop3] = useState<Team[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch(API);
        const data = await res.json();
        setPublished(data.published ?? false);
        setTop3(data.top3 ?? null);
      } catch (err) {
        console.error("Failed to fetch final result", err);
      } finally {
        setLoading(false);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 10000);
    return () => clearInterval(interval);
  }, []);

  const name1 = published && top3?.[0] ? top3[0].teamName : "Declared Soon";
  const name2 = published && top3?.[1] ? top3[1].teamName : "Declared Soon";
  const name3 = published && top3?.[2] ? top3[2].teamName : "Declared Soon";

  return (
    <div
      className="relative min-h-screen text-white"
      style={{
        backgroundImage: "url('/bg/minecraft-bg3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* BACKGROUND OVERLAY */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col max-w-5xl mx-auto p-4 md:p-8">
        {/* HEADER */}
        <div className="flex-shrink-0 flex items-center justify-start mb-4">
          <Link
            to="/scoreboard"
            className="mc-btn px-3 py-2 text-[10px] font-pixel pointer-events-auto z-50"
          >
            ← SCOREBOARD
          </Link>
        </div>

        {/* CENTER CONTENT — IGNORE POINTER EVENTS */}
        <div
          className="flex-1 flex flex-col items-center justify-center
                        -translate-y-6 md:-translate-y-10 pointer-events-none"
        >
          {loading ? (
            <p className="font-pixel text-orange-200">Loading...</p>
          ) : (
            <>
              <h1
                className="font-pixel text-xl md:text-2xl text-[#ff8c1a]
                             drop-shadow-[0_0_10px_rgba(255,140,26,0.6)]
                             text-center mb-12"
              >
                FINAL RESULT
              </h1>

              <div className="w-full flex items-end justify-center gap-2 md:gap-6">
                <PodiumColumn
                  label="2ND"
                  trophy="🥈"
                  trophyColor="text-slate-300"
                  name={name2}
                  prize="1500 RS"
                  prizeColor="text-[#c0c0c0]"
                  boxBorder="border-[#808080]"
                  boxBg="bg-[#2a2a2a]/90"
                  blockHeight="h-24 md:h-32"
                />
                <PodiumColumn
                  label="1ST"
                  trophy="🥇"
                  trophyColor="text-[#ffd36a]"
                  name={name1}
                  prize="2500 RS"
                  prizeColor="text-[#ffd36a]"
                  boxBorder="border-[#8b6914]"
                  boxBg="bg-[#2a1a0a]/90"
                  blockHeight="h-32 md:h-40"
                />
                <PodiumColumn
                  label="3RD"
                  trophy="🥉"
                  trophyColor="text-[#cd7f32]"
                  name={name3}
                  prize="1000 RS"
                  prizeColor="text-[#cd7f32]"
                  boxBorder="border-[#6b3410]"
                  boxBg="bg-[#2a2010]/90"
                  blockHeight="h-20 md:h-28"
                />
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <p className="flex-shrink-0 text-center mt-4 font-pixel text-[12px] text-orange-300/60 pointer-events-none">
          Built With Love By Team CSI
          <br /> {/* Self-closing tag, no wrapping content */}
          {/* Contributor –{" "}
          <a
            href="https://www.linkedin.com/in/vraj-prajapati-47694832a"
            target="_blank"
            rel="noopener noreferrer"
            // Added pointer-events-auto so the link works despite parent having pointer-events-none
            className="text-orange-300 underline hover:text-orange-400 pointer-events-auto"
          >
            Vraj Prajapati
          </a> */}
        </p>
      </div>
    </div>
  );
}
