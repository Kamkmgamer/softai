import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { IBM_Plex_Mono, Inter, Noto_Naskh_Arabic } from "next/font/google";
import { Providers } from "@/components/providers";
import { DEFAULT_LOCALE, getDirection, isLocale } from "@/lib/i18n";
import "@uploadthing/react/styles.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Soft-Magic AI – AI Ad Video Studio",
    template: "%s – Soft-Magic AI",
  },
  description:
    "Turn product briefs, brand assets, and scripts into short-form ad video campaigns. Built for SMB operators.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const headerLocale = headerList.get("x-softai-locale");
  const locale = isLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE;
  const direction = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${inter.variable} ${ibmPlexMono.variable} ${notoNaskhArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('softai-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark');else if(t==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-bg"
        >
          Skip to content
        </a>
        <ClerkProvider ui={ui}>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
