import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ThemeProvider from "@/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

const ALLOWED_ADMIN_EMAIL = process.env.ALLOWED_ADMIN_EMAIL;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Restrict dashboard access to the allowed admin email
  if (ALLOWED_ADMIN_EMAIL) {
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    if (!user || userEmail !== ALLOWED_ADMIN_EMAIL) {
      redirect("/");
    }
  }
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
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
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
