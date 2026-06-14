import type { Metadata } from "next";
import { Anton, Archivo, Space_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CABLELINE — the cable park wakeboard circuit",
  description:
    "Every cable wakeboard park on one map. Follow the contest circuit. Share your sessions. CABLELINE is the home of cable park wakeboarding.",
  metadataBase: new URL("https://cableline.example"),
  openGraph: {
    title: "CABLELINE",
    description:
      "Every cable wakeboard park on one map. Follow the circuit. Share your sessions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivo.variable} ${spaceMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-deepwater text-spray">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
