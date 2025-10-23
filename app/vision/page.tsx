"use client";

import React, { useEffect } from "react";
import VisionApp from "./_components/App";
import "./vision.css";

export default function VisionPage() {
  useEffect(() => {
    const previousBackground = document.body.style.background;
    const previousBackgroundColor = document.body.style.backgroundColor;

    document.body.style.background = "#000000";
    document.body.style.backgroundColor = "#000000";

    return () => {
      document.body.style.background = previousBackground;
      document.body.style.backgroundColor = previousBackgroundColor;
    };
  }, []);

  return <VisionApp />;
}

