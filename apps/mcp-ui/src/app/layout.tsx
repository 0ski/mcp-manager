import type { Metadata } from "next";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { Providers } from "../context";
import { ClientHeader } from "../components/clientHeader";

export const metadata: Metadata = {
  title: "MCP Manager UI",
  description: "Spin up your own MCP with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0}}>
        <Providers>
          <Theme appearance="dark" accentColor="iris" grayColor="slate" style={{ minHeight: "100%" }}>
            <ClientHeader />
            {children}
          </Theme>
        </Providers>
      </body>
    </html>
  );
}
