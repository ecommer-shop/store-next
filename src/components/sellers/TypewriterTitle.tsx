'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';

export function TypewriterTitle() {
  const t = useTranslations('Vendedores');

  const keyPrefix = I18N.Vendedores.hero.title.prefix;
  const keyHighlight = I18N.Vendedores.hero.title.highlight;

  const prefixText = t(keyPrefix);
  const highlightText = t(keyHighlight);
  const fullText = prefixText + highlightText;
  const prefixLen = prefixText.length;

  const [count, setCount] = useState(0);
  const [cursor, setCursor] = useState(true);
  const done = count >= fullText.length;

  useEffect(() => {
    if (done) return;
    const timer = setTimeout(() => setCount((c) => c + 1), 45);
    return () => clearTimeout(timer);
  }, [count, done, fullText.length]);

  useEffect(() => {
    if (!done) return;
    const id = setInterval(() => setCursor((v) => !v), 530);
    return () => clearInterval(id);
  }, [done]);

  const prefixVisible = fullText.slice(0, Math.min(count, prefixLen));
  const highlightVisible = count > prefixLen ? fullText.slice(prefixLen, count) : '';

  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#12123F] dark:text-[#F1F1F1] leading-tight">
      <span>{prefixVisible}</span>
      {highlightVisible && (
        <span className="bg-gradient-to-r from-[#6BB8FF] via-[#9969F8] to-[#9969F8] bg-clip-text text-transparent">
          {highlightVisible}
        </span>
      )}
      {cursor && (
        <span className="ml-0.5 text-[#6BB8FF] dark:text-[#9969F8] animate-pulse">|</span>
      )}
    </h1>
  );
}
