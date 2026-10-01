import React from "react";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  iconSize?: number;
}

export default function Logo({
  variant = "dark",
  className = "",
  iconSize = 30,
}: LogoProps) {
  const isLight = variant === "light";
  const textColor = isLight ? "text-white" : "text-[#0b2d53]";

  return (
    <div className={`flex items-center gap-0.5 select-none ${className}`}>
      <img
        src="/logo.png"
        alt="Konsalta Logo"
        style={{ height: iconSize, width: "auto" }}
        className="shrink-0 object-contain"
      />
      <span
        className={`text-2xl font-bold tracking-tight ${textColor}`}
        style={{ letterSpacing: "-0.02em" }}
      >
        onsalta
      </span>
    </div>
  );
}
