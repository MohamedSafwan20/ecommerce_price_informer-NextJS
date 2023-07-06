import { Oswald } from "next/font/google";
import { ThemeProvider } from "../components/theme_provider";
import "./globals.css";

const oswald = Oswald({ subsets: ["latin"] });

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
      <body className={oswald.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
