import { SectorTemplate } from '../types/campaign';

export const SECTORS: SectorTemplate[] = [
  {
    id: 'banking',
    name: 'Banca & Finanzas / Fintech',
    icon: 'Building2',
    description: 'Alta seguridad, verificación de identidad, tramitaciones transaccionales y cobranza temprana.',
    defaultAhtVoiceSec: 320,
    defaultSlaSeconds: 20,
    defaultSlaPct: 85,
    defaultChatAhtSec: 420,
    defaultChatConcurrency: 2.2,
    defaultShrinkage: 0.30,
    recommendedDeflection: 35,
  },
  {
    id: 'telco',
    name: 'Telecomunicaciones & Media',
    icon: 'Radio',
    description: 'Elevado volumen masivo, soporte técnico de fibra/móvil, retención y altas/bajas de servicios.',
    defaultAhtVoiceSec: 240,
    defaultSlaSeconds: 20,
    defaultSlaPct: 80,
    defaultChatAhtSec: 360,
    defaultChatConcurrency: 2.8,
    defaultShrinkage: 0.33,
    recommendedDeflection: 40,
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    icon: 'ShoppingBag',
    description: 'Estacionalidad fuerte (Black Friday / Rebajas), estado de pedidos WISMO, devoluciones y WhatsApp.',
    defaultAhtVoiceSec: 210,
    defaultSlaSeconds: 30,
    defaultSlaPct: 80,
    defaultChatAhtSec: 300,
    defaultChatConcurrency: 3.0,
    defaultShrinkage: 0.28,
    recommendedDeflection: 45,
  },
  {
    id: 'insurance',
    name: 'Salud & Seguros',
    icon: 'ShieldCheck',
    description: 'Autorizaciones médicas, gestión de siniestros, peritajes y atención sensible de alta empatía.',
    defaultAhtVoiceSec: 360,
    defaultSlaSeconds: 20,
    defaultSlaPct: 90,
    defaultChatAhtSec: 480,
    defaultChatConcurrency: 2.0,
    defaultShrinkage: 0.29,
    recommendedDeflection: 25,
  },
  {
    id: 'utilities',
    name: 'Energía & Utilities',
    icon: 'Zap',
    description: 'Consultas de facturación, altas de suministro, lectura de contadores y gestión de averías.',
    defaultAhtVoiceSec: 270,
    defaultSlaSeconds: 25,
    defaultSlaPct: 80,
    defaultChatAhtSec: 380,
    defaultChatConcurrency: 2.5,
    defaultShrinkage: 0.31,
    recommendedDeflection: 38,
  },
];

export const getSectorById = (id: string): SectorTemplate => {
  const found = SECTORS.find((s) => s.id === id);
  return found || SECTORS[0];
};
