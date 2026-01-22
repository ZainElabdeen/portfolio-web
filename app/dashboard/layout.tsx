// import type { Metadata } from "next";
// import localFont from "next/font/local";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  // BreadcrumbPage,
  // BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// import "./globals.css";
// import Header from "@/components/header";
// import ActiveSectionProvider from "@/providers/active-section-provider";
import ThemeProvider from "@/providers/theme-provider";
// import Footer from "@/components/footer";
// import ThemeControl from "@/components/theme-control";
import { ClerkProvider } from "@clerk/nextjs";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });

// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Zainelabdeen Portfolio",
//   description:
//     "Zainelabdeen is a Full Stack Developer with 7 years of experience.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          footer: "hidden",
        },
      }}
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="w-full flex items-center justify-between gap-2 px-4 ">
              <SidebarTrigger className="-ml-1 flex-none" />

              <Breadcrumb className="flex-auto">
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {/* <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem> */}
                </BreadcrumbList>
              </Breadcrumb>

              <SignedOut>
                <SignInButton mode="modal">
                  <button>Login</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <ThemeProvider>
            <div className="m-4">{children}</div>
          </ThemeProvider>
        </SidebarInset>
      </SidebarProvider>
    </ClerkProvider>
  );
}
