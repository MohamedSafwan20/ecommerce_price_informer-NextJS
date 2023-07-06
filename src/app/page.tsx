"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme } = useTheme();

  return (
    <main>
      <Button
        onClick={() => {
          setTheme("light");
        }}
      >
        Light
      </Button>
      <Button
        onClick={() => {
          setTheme("dark");
        }}
      >
        Dark
      </Button>
    </main>
  );
}
