"use client";

export default function GlobalError() {
  return (
    <div className="h-screen bg-[#eeeceb] flex items-center justify-center text-center">
      <p className="font-['Playfair_Display'] text-5xl italic text-red-600 tracking-tight mb-10">
        Something went wrong
      </p>
    </div>
  );
}