"use client";

import dynamic from "next/dynamic";

const PricingTable = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.PricingTable),
  { ssr: false },
);

export { PricingTable };
