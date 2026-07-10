import {
    Grid3x3,
    Tag as TagIcon,
    Users,
    UtensilsCrossed,
    Layers,
    type LucideIcon,
} from 'lucide-react';

export interface FacetStyle {
    icon: LucideIcon;
    color: string;          // hex — icono y acentos
    colorLight: string;     // fondo suave seleccionado (10% opacidad)
    colorLighter: string;   // fondo hover seleccionado (15% opacidad)
    tagSelected: string;    // clases Tailwind para tag seleccionado
    tagUnselected: string;  // clases Tailwind para tag no seleccionado
    checkBorder: string;    // borde del checkbox seleccionado
    checkBg: string;        // fondo del indicador del checkbox
    rowSelected: string;    // fondo de la fila seleccionada
}

// Un color sólido distinto para cada grupo
const FACET_STYLES: Record<string, FacetStyle> = {
    // Categoría — azul
    'categoría': {
        icon: Grid3x3,
        color: '#6BB8FF',
        colorLight: 'rgba(107,184,255,0.12)',
        colorLighter: 'rgba(107,184,255,0.2)',
        tagSelected:   'bg-[#6BB8FF] text-white border-transparent font-medium shadow-sm',
        tagUnselected: 'bg-[#6BB8FF]/10 text-[#6BB8FF] dark:text-[#6BB8FF] border border-[#6BB8FF]/30 hover:bg-[#6BB8FF]/20',
        checkBorder: 'border-[#6BB8FF]',
        checkBg:    'bg-[#6BB8FF]',
        rowSelected: 'bg-[#6BB8FF]/10 hover:bg-[#6BB8FF]/15',
    },
    // Marcas — morado
    'marcas': {
        icon: TagIcon,
        color: '#9969F8',
        colorLight: 'rgba(153,105,248,0.12)',
        colorLighter: 'rgba(153,105,248,0.2)',
        tagSelected:   'bg-[#9969F8] text-white border-transparent font-medium shadow-sm',
        tagUnselected: 'bg-[#9969F8]/10 text-[#9969F8] dark:text-[#9969F8] border border-[#9969F8]/30 hover:bg-[#9969F8]/20',
        checkBorder: 'border-[#9969F8]',
        checkBg:    'bg-[#9969F8]',
        rowSelected: 'bg-[#9969F8]/10 hover:bg-[#9969F8]/15',
    },
    // Género — rosa
    'género': {
        icon: Users,
        color: '#F472B6',
        colorLight: 'rgba(244,114,182,0.12)',
        colorLighter: 'rgba(244,114,182,0.2)',
        tagSelected:   'bg-[#F472B6] text-white border-transparent font-medium shadow-sm',
        tagUnselected: 'bg-[#F472B6]/10 text-[#F472B6] dark:text-[#F472B6] border border-[#F472B6]/30 hover:bg-[#F472B6]/20',
        checkBorder: 'border-[#F472B6]',
        checkBg:    'bg-[#F472B6]',
        rowSelected: 'bg-[#F472B6]/10 hover:bg-[#F472B6]/15',
    },
    // Alimentos — verde
    'alimentos': {
        icon: UtensilsCrossed,
        color: '#34D399',
        colorLight: 'rgba(52,211,153,0.12)',
        colorLighter: 'rgba(52,211,153,0.2)',
        tagSelected:   'bg-[#34D399] text-white border-transparent font-medium shadow-sm',
        tagUnselected: 'bg-[#34D399]/10 text-[#34D399] dark:text-[#34D399] border border-[#34D399]/30 hover:bg-[#34D399]/20',
        checkBorder: 'border-[#34D399]',
        checkBg:    'bg-[#34D399]',
        rowSelected: 'bg-[#34D399]/10 hover:bg-[#34D399]/15',
    },
    // Colección — naranja
    'colección': {
        icon: Layers,
        color: '#FB923C',
        colorLight: 'rgba(251,146,60,0.12)',
        colorLighter: 'rgba(251,146,60,0.2)',
        tagSelected:   'bg-[#FB923C] text-white border-transparent font-medium shadow-sm',
        tagUnselected: 'bg-[#FB923C]/10 text-[#FB923C] dark:text-[#FB923C] border border-[#FB923C]/30 hover:bg-[#FB923C]/20',
        checkBorder: 'border-[#FB923C]',
        checkBg:    'bg-[#FB923C]',
        rowSelected: 'bg-[#FB923C]/10 hover:bg-[#FB923C]/15',
    },
};

// Versiones sin tilde (alias)
FACET_STYLES['categoria']  = FACET_STYLES['categoría'];
FACET_STYLES['marca']      = FACET_STYLES['marcas'];
FACET_STYLES['genero']     = FACET_STYLES['género'];
FACET_STYLES['coleccion']  = FACET_STYLES['colección'];

// Fallback — gris azulado
const FALLBACK_STYLE: FacetStyle = {
    icon: Grid3x3,
    color: '#94A3B8',
    colorLight: 'rgba(148,163,184,0.12)',
    colorLighter: 'rgba(148,163,184,0.2)',
    tagSelected:   'bg-[#94A3B8] text-white border-transparent font-medium shadow-sm',
    tagUnselected: 'bg-[#94A3B8]/10 text-[#64748B] dark:text-[#94A3B8] border border-[#94A3B8]/30 hover:bg-[#94A3B8]/20',
    checkBorder: 'border-[#94A3B8]',
    checkBg:    'bg-[#94A3B8]',
    rowSelected: 'bg-[#94A3B8]/10 hover:bg-[#94A3B8]/15',
};

export function getFacetStyle(facetName: string): FacetStyle {
    const key = facetName.toLowerCase().trim();
    return FACET_STYLES[key] ?? FALLBACK_STYLE;
}
