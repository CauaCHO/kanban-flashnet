import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlashNet Kanban",
  description: "Sistema Kanban",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}