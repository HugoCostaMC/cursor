import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Quartz Brief Prototype",
  description:
    "A conversational Quartz-style news app prototype with RSS directories and personalized comedy."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
