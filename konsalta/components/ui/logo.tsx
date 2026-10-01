import React from "react";
import Image from "next/image";
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
  const rightChevronColor = isLight ? "#ffffff" : "#0b2d53";
  const textColor = isLight ? "text-white" : "text-[#0b2d53]";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <Image
        src="/logo.ico"
        alt="Konsalta Logo"
        width={iconSize}
        height={iconSize}
        className="w-auto h-auto"
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
