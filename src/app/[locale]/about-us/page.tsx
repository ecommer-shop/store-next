import { HeroSection } from './HeroSection';
import { HistorySection } from './HistorySection';
import { MissionVisionSection } from './MissionVisionSection';
import { AudienceSection } from './AudienceSection';
import { TeamSection } from './TeamSection';
import { LocationSection } from './LocationSection';
import { DifferentiatorsSection } from './DifferentiatorsSection';
import { FaqSection } from './FaqSection';
import { LegalInfoCards } from './LegalInfoCards';
import { CtaSection } from './CtaSection';

export default function QuienesSomosPage() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <HistorySection />
      <MissionVisionSection />
      <AudienceSection />
      <TeamSection />
      <LocationSection />
      <DifferentiatorsSection />
      <FaqSection />
      <LegalInfoCards />
      <CtaSection />
    </main>
  );
}
