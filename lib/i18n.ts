import siteKo from "@/app/content/site.ko.json";
import siteEn from "@/app/content/site.en.json";

export type Lang = "ko" | "en";

const content = {
  ko: siteKo,
  en: siteEn,
};

/**
 * Get language from URL search params
 */
export function getLangFromSearchParams(searchParams: URLSearchParams): Lang {
  const langParam = searchParams.get("lang");
  if (langParam === "en") return "en";
  return "ko"; // Default
}

/**
 * Get content for a specific language
 */
export function getContent(lang: Lang) {
  return content[lang];
}

/**
 * Get browser language preference
 */
export function getBrowserLang(): Lang {
  if (typeof window === "undefined") return "ko";

  const browserLang = navigator.language.toLowerCase();

  // Check if browser language is English
  if (browserLang.startsWith("en")) return "en";

  // Default to Korean
  return "ko";
}
