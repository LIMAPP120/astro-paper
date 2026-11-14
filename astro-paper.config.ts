import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://prepvivo.com", 
    title: "PrepViVo Blog",
    description: "PrepViVo Blog is a personal blog about Singapore education, technology, and personal development.",
    author: "PrepViVo",
    lang: "en",
    timezone: "Asia/Singapore",
  },
  posts: {
    perPage: 10,
    perIndex: 5,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
  },
  // ✅ Kept ONLY the email, removed GitHub, X, and LinkedIn
  socials: [
    { name: "mail", url: "mailto:contact@prepvivo.com" },
  ],
  // ✅ Emptied the array to remove the share buttons at the bottom of posts
  shareLinks: [],
});