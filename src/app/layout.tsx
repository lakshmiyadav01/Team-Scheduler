import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/app/components/Sidebar";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { GroupsProvider } from "@/app/context/GroupsContext";
import { TopFilterProvider } from "@/app/context/TopFilterContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shift Management",
  description: "Company shift scheduling system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex`}>
        <GroupsProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Sidebar />
          <TopFilterProvider>
          <div className="flex-1 flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            {children}
          </div>
         </TopFilterProvider>
        </ThemeProvider>
        </GroupsProvider>
      </body>
    </html>
  );
}





    
     
  
