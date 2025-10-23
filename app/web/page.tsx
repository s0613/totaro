"use client";

import React, { useEffect } from "react";
import WebApp from "./_components/App";
import "./web.css";

export default function WebPage() {
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

  return <WebApp />;
}
