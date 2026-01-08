'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export default function LocaleSwitcher() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      // Remove the current locale from pathname
      const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
      router.replace(newPath);
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => switchLocale('en')}
        disabled={locale === 'en' || isPending}
        className={`rounded px-3 py-1 text-sm ${
          locale === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        } disabled:opacity-50`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('el')}
        disabled={locale === 'el' || isPending}
        className={`rounded px-3 py-1 text-sm ${
          locale === 'el'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        } disabled:opacity-50`}
      >
        EL
      </button>
    </div>
  );
}
