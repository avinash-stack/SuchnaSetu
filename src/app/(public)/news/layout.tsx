import { Metadata } from "next";
import { NewsPwaRegister } from "@/components/shared/news-pwa-register";

export const metadata: Metadata = {
  title: {
    template: "%s | SuchnaSetu News",
    default: "SuchnaSetu News – Official Government, Education & Public Recruitment Updates",
  },
  description:
    "Real-time, verified public sector news, exam announcements, education alerts, and state government bulletins from across India.",
  manifest: "/news/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SuchnaSetu News",
  },
  icons: {
    icon: [
      { url: "/icons/news/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/news/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/news/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NewsPwaRegister />
      {children}
    </>
  );
}
