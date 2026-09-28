'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandMark } from "@/components/base/Hull";
import { authClient } from "@/lib/auth-client";

const LINKS = [
  { href: "/#sobre", label: "Sobre" },
  { href: "/blog", label: "Blog" },
  { href: "/#contato", label: "Contato" },
];

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const authLink = { href: session ? "/logout" : "/login", label: session ? "Sair" : "Entrar" };

  const links = LINKS.map((l) => (
    <Link
      key={l.href}
      href={l.href}
      aria-current={pathname.startsWith(l.href) ? "page" : undefined}
      className="hover:text-primary aria-[current=page]:text-foreground transition-colors"
    >
      {l.label}
    </Link>
  ));

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <BrandMark className="text-primary" />
          Hidrogênio Naval
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {links}
          <Button asChild size="sm">
            <Link href={authLink.href}>{authLink.label}</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="gap-0 p-6">
            <SheetTitle className="mb-6 flex items-center gap-2">
              <BrandMark className="text-primary" />
              Hidrogênio Naval
            </SheetTitle>
            <div className="flex flex-col gap-4 text-lg font-medium text-muted-foreground">
              {links.map((link) => <SheetClose asChild key={link.key}>{link}</SheetClose>)}
            </div>
            <Button asChild className="mt-8">
              <Link href={authLink.href}>{authLink.label}</Link>
            </Button>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
