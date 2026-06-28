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
import { SectionIndex } from '@/components/sellers/SectionIndex';

export default function VendedoresPage() {
  return (
    <>
      <div data-pdf-content className="sellers-page">
        <ScrollProgressBar />
        <InteractiveBackground />
        <ParallaxOverlay />
        <main className="relative min-h-screen overflow-hidden bg-transparent">
          <div className="relative">
            <HeroSection />
          </div>
          <div className="relative">
            <SectionIndex number="01" side="left" />
            <ValorOperativoSection />
          </div>
          <div className="relative">
            <SectionIndex number="02" side="right" />
            <TiendaListaSection />
          </div>
          <div className="relative">
            <SectionIndex number="03" side="left" />
            <AliadosSection />
          </div>
          <div className="relative">
            <SectionIndex number="04" side="right" />
            <EnfoqueSectorialSection />
          </div>
          <div className="relative">
            <SectionIndex number="05" side="left" />
            <PlanesSection />
          </div>
          <div className="relative">
            <SectionIndex number="06" side="right" />
            <FaqSection />
          </div>
          <div className="relative">
            <SectionIndex number="07" side="left" />
            <CtaSection />
          </div>
        </main>
      </div>
      <PdfDownloadButton />
    </>
  );
}
