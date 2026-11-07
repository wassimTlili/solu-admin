import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

/** Poppins, as in the Solu app. */
const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "Solu Admin", template: "%s · Solu Admin" },
  description: "Solu's admin dashboard: analytics, members, content and notifications.",
  robots: { index: false, follow: false },
  icons: { icon: "/solu-mark.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
