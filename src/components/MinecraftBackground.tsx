import { ReactNode } from "react";

const MinecraftBackground = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative text-white"
      style={{
        backgroundImage: "url('/bg/minecraft-main.png')",
      }}
    >
      {/* dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* content */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default MinecraftBackground;
