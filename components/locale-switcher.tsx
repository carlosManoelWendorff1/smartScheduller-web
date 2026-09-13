// components/locale-switcher.tsx
"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LOCALES = [
  { code: "pt-BR", label: "Português" },
  { code: "en-US", label: "English" },
];

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  function setLocale(code: string) {
    document.cookie = `locale=${code}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon">
            <Languages className="h-4 w-4" />
            <span className="sr-only">Idioma</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLocale(l.code)}
            disabled={l.code === locale}
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
