import { ClerkProvider } from "@clerk/nextjs";
import { Oswald } from "next/font/google";
import { Toaster } from "react-hot-toast";
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
    <ClerkProvider>
      <html lang="en">
        <body className={oswald.className}>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
