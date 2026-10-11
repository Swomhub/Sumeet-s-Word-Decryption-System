import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sumeet's Word Decryption System",
  description:
    "Decode the meaning behind every word. Understand slang, phrases and everyday conversations across English, Hinglish, Hindi and Marathi.",
  keywords: [
    "word decoder",
    "Hindi translation",
    "Marathi translation",
    "Hinglish",
    "slang decoder",
    "language decoder",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
