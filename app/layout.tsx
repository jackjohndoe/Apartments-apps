import type { Metadata } from "next";
import { Poppins, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { SessionProvider } from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "Nigerian Apartments - Find Your Perfect Home",
  description: "Discover amazing apartments for rent across Nigeria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${bebasNeue.variable} font-poppins antialiased bg-white dark:bg-gray-900 text-black dark:text-white transition-colors`}>
        <ThemeProvider>
          <SessionProvider>
            <Navigation />
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

