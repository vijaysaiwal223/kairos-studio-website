"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function WhyKairosEmblem() {
  const emblemRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const emblem = emblemRef.current;
    if (!emblem) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.35) return;
        setEntered(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(emblem);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={emblemRef} className="relative aspect-square w-[400px] max-w-full">
      <Image
        src="/home/why-kairos/central-137-2759.svg"
        alt="kai.ros emblem inside an architectural measurement frame"
        width={400}
        height={400}
        className="block size-full"
      />
      <span
        aria-hidden="true"
        className={`why-kairos-emblem-mark pointer-events-none absolute inset-[10%] block size-[80%] ${entered ? "why-kairos-emblem-mark--lit" : ""}`}
      />
    </div>
  );
}
