import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme_provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ecommerce Price Informer",
  description: "Informs about price changes from a ecommerce store.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
