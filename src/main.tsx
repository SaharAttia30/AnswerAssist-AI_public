import { createRoot } from 'react-dom/client'
import React, { useEffect } from "react";
import App from './App.tsx'
import './index.css'
import "./i18n";
import i18n from "./i18n";
import { BrowserRouter  } from "react-router-dom";

const Root = () => {
  useEffect(() => {
    const dir = i18n.language === "he" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
    i18n.on("languageChanged", (lng) => {
      document.documentElement.dir = lng === "he" ? "rtl" : "ltr";
      document.documentElement.lang = lng;
    });
  }, []);

  return (
  <BrowserRouter >
    <App />
  </BrowserRouter >
  );
};
createRoot(document.getElementById("root")!).render(<Root />);
