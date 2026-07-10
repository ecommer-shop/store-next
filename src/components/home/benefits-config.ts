import {
    CreditCard,
    Headphones,
    ShieldCheck,
    Star,
    Store,
    Truck,
    type LucideIcon,
} from 'lucide-react';
import { getSellersLandingUrl } from '@/lib/sellers-landing-url';

export interface BenefitConfig {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    popoverTitle: string;
    description: string;
    action: string;
    href: string;
    color: string;
}

const sellersUrl = getSellersLandingUrl();

export const benefits: BenefitConfig[] = [
    {
        icon: Truck,
        title: 'Envíos',
        subtitle: 'Locales y Nacionales',
        popoverTitle: 'Envíos Locales y Nacionales',
        description:
            'Realizamos entregas en Popayán con MESSENGER y a todo el país a través de Envia.com. Rápido, seguro y con seguimiento en tiempo real.',
        action: 'Ver productos',
        href: '/search',
        color: '#6BB8FF',
    },
    {
        icon: ShieldCheck,
        title: 'Compra Segura',
        subtitle: 'Tus datos protegidos',
        popoverTitle: 'Compra 100% segura',
        description:
            'Tus datos personales y de pago están protegidos con encriptación y pasarelas certificadas.',
        action: 'Conocer más',
        href: '/users#payments',
        color: '#9969F8',
    },
    {
        icon: CreditCard,
        title: 'Medios de Pago',
        subtitle: 'Contamos con todos los medios que necesitas',
        popoverTitle: 'Múltiples formas de pago',
        description:
            'Paga con tarjetas de crédito, débito, PSE, Nequi, Daviplata y más. Contamos con todos los medios de pago que necesitas.',
        action: 'Conocer más',
        href: '/users#payments',
        color: '#6BB8FF',
    },
    {
        icon: Store,
        title: 'Vende Aquí',
        subtitle: 'Llega a todo el país',
        popoverTitle: 'Vende en Ecommer',
        description:
            'Publica tus productos, llega a compradores en todo Colombia y haz crecer tu negocio online.',
        action: 'Empezar a vender',
        href: sellersUrl,
        color: '#9969F8',
    },
    {
        icon: Headphones,
        title: 'Ayuda 24/7',
        subtitle: 'Soporte personalizado',
        popoverTitle: 'Soporte siempre disponible',
        description:
            'Nuestro equipo está listo para ayudarte con pedidos, pagos y cualquier consulta, a toda hora.',
        action: 'Conoce más',
        href: '/users#support',
        color: '#9969F8',
    },
];
