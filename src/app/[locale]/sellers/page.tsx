import { FileText, CreditCard, Truck, BarChart3, Check, Megaphone, Coffee, Shirt, Gem } from 'lucide-react';
import { FaqItem } from '@/components/sellers/FaqItem';
import { UseVendedoresText } from '@/components/sellers/UseVendedoresText';
import { LoginCardPreview } from '@/components/sellers/LoginCardPreview';
import { AgendarDemoButton } from '@/components/sellers/AgendarDemoButton';
import { PdfDownloadButton } from '@/components/sellers/PdfDownloadButton';
import BillingCard from '@/components/sellers/billing/BillingCard';

const ADMIN_URL = process.env.NEXT_PUBLIC_VENDEDORES_ADMIN_URL || '#';

export default function VendedoresPage() {
  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#121414] bg-[radial-gradient(ellipse_at_top,rgba(33,0,81,0.4)_0%,#121414_100%)]">
        {/* ===== 1. HERO SECTION ===== */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,105,248,0.08)_0%,_transparent_70%)]" />
          <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(153,105,248,0.22),rgba(255,255,255,0))]" />
          <div className="relative container mx-auto px-4 py-20 lg:py-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
              {/* LEFT COLUMN */}
              <div className="space-y-8">
                <div className="inline-flex items-start gap-3 bg-[#12123F]/80 border border-[#9969F8]/30 rounded-full px-5 py-3">
                  <Megaphone className="w-5 h-5 text-[#9969F8] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#F1F1F1]/80 leading-relaxed">
                    <UseVendedoresText path={['hero', 'badge']} />
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F1F1F1] leading-tight">
                  <UseVendedoresText path={['hero', 'title', 'prefix']} />
                  <span className="bg-gradient-to-r from-[#6BB8FF] via-[#9969F8] to-[#9969F8] bg-clip-text text-transparent">
                    <UseVendedoresText path={['hero', 'title', 'highlight']} />
                  </span>
                </h1>
                <p className="text-lg text-[#F1F1F1]/70 max-w-xl leading-relaxed">
                  <UseVendedoresText path={['hero', 'description']} />
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={ADMIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#9969F8] text-[#F1F1F1] font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all"
                  >
                    <UseVendedoresText path={['hero', 'demoButton']} />
                  </a>
                  <AgendarDemoButton />
                </div>
              </div>
              {/* RIGHT COLUMN */}
              <div className="relative h-[500px] hidden lg:block">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 rounded-full bg-[#9969F8]/5 blur-3xl absolute" />
                  <div className="w-72 h-72 rounded-full bg-[#6BB8FF]/5 blur-3xl absolute -top-10 -right-10" />
                  <div className="absolute top-12 right-12 transform rotate-[-6deg]">
                    <div className="flex items-center gap-3 backdrop-blur-xl bg-[#12123F]/60 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full px-5 py-3 shadow-lg">
                      <div className="w-6 h-6 rounded-full bg-[#6BB8FF]/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-[#6BB8FF]" />
                      </div>
                      <span className="text-sm font-medium text-[#F1F1F1] whitespace-nowrap">
                        <UseVendedoresText path={['hero', 'floatingCard']} />
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-36 right-28 transform rotate-[4deg]">
                    <div className="flex items-center gap-3 backdrop-blur-xl bg-[#12123F]/60 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full px-5 py-3 shadow-lg">
                      <div className="w-6 h-6 rounded-full bg-[#6BB8FF]/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-[#6BB8FF]" />
                      </div>
                      <span className="text-sm font-medium text-[#F1F1F1] whitespace-nowrap">
                        <UseVendedoresText path={['hero', 'floatingCard']} />
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-20 right-6 transform rotate-[-3deg]">
                    <div className="flex items-center gap-3 backdrop-blur-xl bg-[#12123F]/60 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full px-5 py-3 shadow-lg">
                      <div className="w-6 h-6 rounded-full bg-[#6BB8FF]/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-[#6BB8FF]" />
                      </div>
                      <span className="text-sm font-medium text-[#F1F1F1] whitespace-nowrap">
                        <UseVendedoresText path={['hero', 'floatingCard']} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 2. VALOR OPERATIVO REAL ===== */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#F1F1F1] mb-4">
                <UseVendedoresText path={['valorOperativo', 'title']} />
              </h2>
              <p className="text-[#F1F1F1]/70 text-lg max-w-2xl mx-auto">
                <UseVendedoresText path={['valorOperativo', 'subtitle']} />
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {([
                { key: 'dian', icon: FileText, color: '#9969F8' },
                { key: 'wompi', icon: CreditCard, color: '#6BB8FF' },
                { key: 'logistica', icon: Truck, color: '#9969F8' },
                { key: 'panel', icon: BarChart3, color: '#6BB8FF' },
              ] as const).map(({ key, icon: Icon, color }) => (
                <div
                  key={key}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-md border border-white/[0.05] p-6 group"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#6BB8FF]/40 to-transparent group-hover:via-[#9969F8]/80 transition-all"
                  />
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${color}1A` }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#F1F1F1] mb-2">
                    <UseVendedoresText path={['valorOperativo', 'cards', key, 'title']} />
                  </h3>
                  <p className="text-sm text-[#F1F1F1]/70 leading-relaxed">
                    <UseVendedoresText path={['valorOperativo', 'cards', key, 'description']} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 3. TIENDA LISTA ===== */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-[#9969F8]">
                  Simplicidad
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#F1F1F1] mt-2 mb-6">
                  <UseVendedoresText path={['tienda', 'title']} />
                </h2>
                <p className="text-[#F1F1F1]/70 text-lg mb-6">
                  <UseVendedoresText path={['tienda', 'subtitle']} />
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#9969F8] to-[#6BB8FF] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#F1F1F1]" />
                    </div>
                    <span className="text-[#F1F1F1]/80 font-medium">
                      <UseVendedoresText path={['tienda', 'checklist', 'sinCodigo']} />
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#9969F8] to-[#6BB8FF] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#F1F1F1]" />
                    </div>
                    <span className="text-[#F1F1F1]/80 font-medium">
                      <UseVendedoresText path={['tienda', 'checklist', 'posicionamiento']} />
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#9969F8] to-[#6BB8FF] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#F1F1F1]" />
                    </div>
                    <span className="text-[#F1F1F1]/80 font-medium">
                      <UseVendedoresText path={['tienda', 'checklist', 'panel']} />
                    </span>
                  </li>
                </ul>
                <a
                  href={ADMIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9969F8] to-[#6BB8FF] text-[#F1F1F1] px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
                >
                  <UseVendedoresText path={['tienda', 'buttonText']} />
                </a>
              </div>
              <div className="bg-[#12123F]/60 backdrop-blur-md border border-[#F1F1F1]/10 rounded-2xl p-8">
                <LoginCardPreview />
              </div>
            </div>
          </div>
        </section>

        {/* ===== 4. ALIADOS ===== */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#F1F1F1]/50">
              <UseVendedoresText path={['aliados', 'title']} />
            </span>
            <div className="flex flex-wrap justify-center gap-14 mt-8">
              {(['dian', 'wompi', 'servientrega'] as const).map((key) => (
                <span key={key} className="text-xl font-bold text-[#F1F1F1]/40">
                  <UseVendedoresText path={['aliados', key]} />
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 5. ENFOQUE SECTORIAL REGIONAL ===== */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#F1F1F1] mb-4">
                  <UseVendedoresText path={['enfoqueSectorial', 'title']} />
                </h2>
                <p className="text-[#F1F1F1]/70 text-lg max-w-xl">
                  <UseVendedoresText path={['enfoqueSectorial', 'subtitle']} />
                </p>
              </div>
              <button className="border border-[#F1F1F1]/20 rounded-xl px-4 py-2 text-sm text-[#F1F1F1]/70 hover:border-[#9969F8]/40 hover:text-[#F1F1F1] transition-all flex-shrink-0">
                <UseVendedoresText path={['enfoqueSectorial', 'buttonText']} />
              </button>
            </div>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-7 rounded-2xl overflow-hidden relative min-h-[280px] group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#12123F] via-[#12123F] to-[#9969F8]/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                  <div>
                    <span className="inline-block text-xs font-semibold tracking-wider text-[#6BB8FF] bg-black/30 px-3 py-1 rounded-full mb-3">
                      <UseVendedoresText path={['enfoqueSectorial', 'items', 'cafe', 'badge']} />
                    </span>
                    <h3 className="text-2xl font-bold text-[#F1F1F1] mb-2">
                      <UseVendedoresText path={['enfoqueSectorial', 'items', 'cafe', 'title']} />
                    </h3>
                    <p className="text-[#F1F1F1]/70 text-sm max-w-lg">
                      <UseVendedoresText path={['enfoqueSectorial', 'items', 'cafe', 'description']} />
                    </p>
                  </div>
                  <div className="absolute bottom-6 right-6 opacity-20">
                    <Coffee size={80} className="text-[#6BB8FF]" />
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-5 rounded-2xl overflow-hidden relative min-h-[280px] group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#12123F] via-[#15152a] to-[#1a2040]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                  <div>
                    <span className="inline-block text-xs font-semibold tracking-wider text-[#9969F8] bg-black/30 px-3 py-1 rounded-full mb-3">
                      <UseVendedoresText path={['enfoqueSectorial', 'items', 'moda', 'badge']} />
                    </span>
                    <h3 className="text-2xl font-bold text-[#F1F1F1] mb-2">
                      <UseVendedoresText path={['enfoqueSectorial', 'items', 'moda', 'title']} />
                    </h3>
                    <p className="text-[#F1F1F1]/70 text-sm max-w-md">
                      <UseVendedoresText path={['enfoqueSectorial', 'items', 'moda', 'description']} />
                    </p>
                  </div>
                  <div className="absolute bottom-6 right-6 opacity-20">
                    <Shirt size={80} className="text-[#9969F8]" />
                  </div>
                </div>
              </div>
              <div className="col-span-12 rounded-2xl overflow-hidden relative min-h-[220px] group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#12123F] via-[#9969F8]/15 to-[#12123F]" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #9969F8 1px, transparent 1px), radial-gradient(circle at 75% 50%, #6BB8FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                <div className="relative z-10 p-8 flex flex-col h-full justify-center">
                  <span className="inline-block text-xs font-semibold tracking-wider text-[#6BB8FF] bg-black/30 px-3 py-1 rounded-full mb-3 w-fit">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'artesanias', 'badge']} />
                  </span>
                  <h3 className="text-2xl font-bold text-[#F1F1F1] mb-2">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'artesanias', 'title']} />
                  </h3>
                  <p className="text-[#F1F1F1]/70 text-sm max-w-2xl mb-4">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'artesanias', 'description']} />
                  </p>
                  <a className="text-[#9969F8] text-sm font-semibold hover:underline inline-flex items-center gap-1 w-fit">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'artesanias', 'link']} />
                  </a>
                </div>
                <div className="absolute bottom-6 right-6 opacity-10">
                  <Gem size={100} className="text-[#9969F8]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 6. PLANES ===== */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#F1F1F1] mb-4">
                <UseVendedoresText path={['planes', 'title']} />
              </h2>
              <p className="text-[#F1F1F1]/70 text-lg max-w-2xl mx-auto">
                <UseVendedoresText path={['planes', 'subtitle']} />
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
              {/* Free */}
              <div className="bg-[#12123F]/40 backdrop-blur-md border border-[#F1F1F1]/10 rounded-2xl p-8 flex flex-col transition-all hover:border-[#F1F1F1]/20">
                <h3 className="text-xl font-bold text-[#F1F1F1] mb-2">
                  <UseVendedoresText path={['planes', 'cards', 'free', 'name']} />
                </h3>
                <p className="text-3xl font-extrabold text-[#F1F1F1] mb-2">
                  <UseVendedoresText path={['planes', 'cards', 'free', 'price']} />
                </p>
                <p className="text-sm text-[#F1F1F1]/50 mb-6">
                  <UseVendedoresText path={['planes', 'cards', 'free', 'description']} />
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-[#F1F1F1]/70">
                    <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                    <UseVendedoresText path={['planes', 'cards', 'free', 'features', 'products']} />
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#F1F1F1]/70">
                    <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                    <UseVendedoresText path={['planes', 'cards', 'free', 'features', 'variations']} />
                  </li>
                </ul>
                <a
                  href={ADMIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center border border-[#F1F1F1]/20 text-[#F1F1F1] px-6 py-3 rounded-xl font-semibold hover:bg-[#F1F1F1]/10 transition-all"
                >
                  <UseVendedoresText path={['planes', 'cards', 'free', 'buttonText']} />
                </a>
              </div>
              {/* Tienda - Destacado */}
              <div className="relative bg-gradient-to-b from-[#9969F8]/15 via-[#12123F]/90 to-[#12123F] border-2 border-[#9969F8]/70 rounded-2xl p-8 flex flex-col shadow-[0_0_50px_-12px_rgba(153,105,248,0.3)] transition-all hover:shadow-[0_0_40px_rgba(153,105,248,0.3)] scale-[1.02]">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#9969F8] text-[#F1F1F1] text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                  <UseVendedoresText path={['planes', 'popular']} />
                </div>
                <h3 className="text-xl font-bold text-[#F1F1F1] mb-2">
                  <UseVendedoresText path={['planes', 'cards', 'tienda', 'name']} />
                </h3>
                <p className="text-3xl font-extrabold text-[#F1F1F1] mb-2">
                  <UseVendedoresText path={['planes', 'cards', 'tienda', 'price']} />
                </p>
                <p className="text-sm text-[#F1F1F1]/50 mb-6">
                  <UseVendedoresText path={['planes', 'cards', 'tienda', 'description']} />
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-[#F1F1F1]/70">
                    <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                    <UseVendedoresText path={['planes', 'cards', 'tienda', 'features', 'products']} />
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#F1F1F1]/70">
                    <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                    <UseVendedoresText path={['planes', 'cards', 'tienda', 'features', 'variations']} />
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#F1F1F1]/70">
                    <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                    <UseVendedoresText path={['planes', 'cards', 'tienda', 'features', 'simetria']} />
                  </li>
                </ul>
                <a
                  href={ADMIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-gradient-to-r from-[#9969F8] to-[#7E42E5] text-[#F1F1F1] px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(153,105,248,0.4)]"
                >
                  <UseVendedoresText path={['planes', 'cards', 'tienda', 'buttonText']} />
                </a>
              </div>
              {/* Omnichannel */}
              <div className="bg-[#12123F]/40 backdrop-blur-md border border-[#F1F1F1]/10 rounded-2xl p-8 flex flex-col transition-all hover:border-[#F1F1F1]/20">
                <h3 className="text-xl font-bold text-[#F1F1F1] mb-2">
                  <UseVendedoresText path={['planes', 'cards', 'omnichannel', 'name']} />
                </h3>
                <p className="text-3xl font-extrabold text-[#F1F1F1] mb-2">
                  <UseVendedoresText path={['planes', 'cards', 'omnichannel', 'price']} />
                </p>
                <p className="text-sm text-[#F1F1F1]/50 mb-6">
                  <UseVendedoresText path={['planes', 'cards', 'omnichannel', 'description']} />
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-[#F1F1F1]/70">
                    <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                    <UseVendedoresText path={['planes', 'cards', 'omnichannel', 'features', 'products']} />
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#F1F1F1]/70">
                    <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                    <UseVendedoresText path={['planes', 'cards', 'omnichannel', 'features', 'variations']} />
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#F1F1F1]/70">
                    <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                    <UseVendedoresText path={['planes', 'cards', 'omnichannel', 'features', 'simetria']} />
                  </li>
                </ul>
                <a
                  href={ADMIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center border border-[#F1F1F1]/20 text-[#F1F1F1] px-6 py-3 rounded-xl font-semibold hover:bg-[#F1F1F1]/10 transition-all"
                >
                  <UseVendedoresText path={['planes', 'cards', 'omnichannel', 'buttonText']} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 7. FAQ ===== */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#F1F1F1] mb-4">
                Preguntas Frecuentes
              </h2>
              <p className="text-[#F1F1F1]/70 text-lg max-w-2xl mx-auto">
                Resolvemos tus dudas operativas para que escales con confianza.
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              <FaqItem
                question="¿Realmente es gratis usar la plataforma?"
                answer="Sí. El único costo son las comisiones de la pasarela de pagos (Wompi): 7.9% por transacción, que cubre tarjetas, PSE y corresponsales. Si deseas funcionalidades adicionales, puedes revisar nuestros paquetes."
                defaultOpen
              />
              <FaqItem
                question="¿Necesito conocimientos técnicos para usar la plataforma?"
                answer="Para nada. Si sabés usar WhatsApp o Instagram, sabés usar Ecommer. Subir un producto es tan fácil como publicar una foto en redes sociales."
              />
              <FaqItem
                question="¿Cómo y cuándo recibo el dinero de mis ventas?"
                answer="Recibes el dinero cada 15 días. Si usas Nequi, Bancolombia o un banco con llave BRE-B registrada, no hay costos adicionales. Si eliges otro banco sin llave, los costos de la transacción los asume la tienda."
              />
              <FaqItem
                question="¿Cómo funcionan los envíos en Popayán?"
                answer="Tenemos alianza con MESSENGER. Cuando recibes un pedido, el sistema les notifica automáticamente para que recojan el paquete en tu local y lo entreguen al cliente. El costo del envío lo asume el comprador y se calcula según la distancia."
              />
              <FaqItem
                question="¿Es obligatorio facturar electrónicamente?"
                answer="No para comenzar. Si eres persona natural en régimen no responsable de IVA, puedes vender sin facturación electrónica. Las personas jurídicas sí están obligadas por ley. Para ellas, ofrecemos el servicio de facturación electrónica con Certificado Digital DIAN desde $199.900/año."
              />
              <FaqItem
                question="¿Ecommer me ayuda con la contabilidad?"
                answer="Sí. La plataforma registra todas tus ventas y genera reportes listos para descargar, para que tu contador no tenga que hacer trabajo extra. Cumplimos los estándares para que estés al día con la DIAN sin esfuerzo."
              />
              <FaqItem
                question="¿Cómo protegen mi dinero ante reclamos o contracargos?"
                answer="Wompi monitorea los pagos 24/7 y el dinero solo se retira con una segunda clave. Ante reclamos en ventas de productos físicos, te notifican y tienes 7 días para demostrar la entrega. Se recomienda guardar toda la documentación de ventas por al menos un año."
              />
              <FaqItem
                question="¿Existe un número de atención al cliente?"
                answer="Sí, contamos con un número de atención al cliente. Puedes comunicarte al 314 851 8961, donde con gusto te brindaremos asistencia, inicialmente el soporte te conecta con un Bot de IA el cual te redirecciona a un asistente real si es necesario."
              />
            </div>
          </div>
        </section>

        {/* ===== 8. BILLING ===== */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <BillingCard />
          </div>
        </section>

        {/* ===== 9. CTA FINAL ===== */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,105,248,0.06)_0%,_transparent_70%)]" />
          <div className="container mx-auto px-4 text-center relative">
            <div className="bg-[#12123F]/60 backdrop-blur-md border border-[#F1F1F1]/10 rounded-3xl p-12 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[#F1F1F1] mb-4 leading-tight">
                <UseVendedoresText path={['cta', 'title']} />
              </h2>
              <p className="text-[#F1F1F1]/70 text-lg mb-8">
                <UseVendedoresText path={['cta', 'subtitle']} />
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AgendarDemoButton />
                <a
                  href={ADMIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#F1F1F1]/20 text-[#F1F1F1] px-8 py-3 rounded-xl font-semibold hover:bg-[#F1F1F1]/10 transition-all"
                >
                  <UseVendedoresText path={['cta', 'storeButton']} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PdfDownloadButton />
    </>
  );
}
