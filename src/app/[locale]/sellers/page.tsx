import { HeroSection } from '@/components/sellers/HeroSection';
import { ValorOperativoSection } from '@/components/sellers/ValorOperativoSection';
import { TiendaListaSection } from '@/components/sellers/TiendaListaSection';
import { AliadosSection } from '@/components/sellers/AliadosSection';
import { EnfoqueSectorialSection } from '@/components/sellers/EnfoqueSectorialSection';
import { PlanesSection } from '@/components/sellers/PlanesSection';
import { FaqSection } from '@/components/sellers/FaqSection';
import { CtaSection } from '@/components/sellers/CtaSection';
import { InteractiveBackground } from '@/components/sellers/InteractiveBackground';
import { ScrollProgressBar } from '@/components/sellers/ScrollProgressBar';
import { ParallaxOverlay } from '@/components/sellers/ParallaxOverlay';
import { PdfDownloadButton } from '@/components/sellers/PdfDownloadButton';

export default function VendedoresPage() {
  return (
    <div className="sellers-page">
      <ScrollProgressBar />
      <InteractiveBackground />
      <ParallaxOverlay />
      <main data-pdf-content className="relative min-h-screen overflow-hidden bg-transparent">
        <HeroSection />
        <ValorOperativoSection />
        <TiendaListaSection />
        <AliadosSection />
        <EnfoqueSectorialSection />
        <PlanesSection />
        <FaqSection />
        <CtaSection />
      </main>
      <PdfDownloadButton />
    </div>
  );
}
