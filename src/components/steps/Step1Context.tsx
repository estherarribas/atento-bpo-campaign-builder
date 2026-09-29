import React from 'react';
import { useCampaign } from '../../context/CampaignContext';
import { COUNTRIES } from '../../data/countries';
import { SECTORS } from '../../data/sectors';
import { OperatingWindow } from '../../types/campaign';
import {
  Building2,
  Radio,
  ShoppingBag,
  ShieldCheck,
  Zap,
  Clock,
  Globe2,
  Check,
  ChevronRight,
} from 'lucide-react';

const SECTOR_ICONS: Record<string, React.ElementType> = {
  banking: Building2,
  telco: Radio,
  retail: ShoppingBag,
  insurance: ShieldCheck,
  utilities: Zap,
};

export const Step1Context: React.FC = () => {
  const {
    clientName,
    setClientName,
    campaignName,
    setCampaignName,
    sectorId,
    setSectorId,
    financial,
    updateFinancial,
    setCurrentStep,
  } = useCampaign();

  const operatingWindows: { id: OperatingWindow; label: string; desc: string }[] = [
    { id: '8x5', label: '8x5 L-V', desc: 'Horario comercial estándar' },
    { id: '12x6', label: '12x6 L-S', desc: 'Cobertura extendida habitual BPO' },
    { id: '16x7', label: '16x7 L-D', desc: 'Soporte omnicanal de 08:00 a 00:00' },
    { id: '24x7', label: '24x7 Continuo', desc: 'Servicios críticos y emergencias' },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm">
        <h2 className="text-xl font-bold text-atento-navy flex items-center gap-2">
          <span>1. Contexto de la Operación & Parámetros Sectoriales</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Define el cliente objetivo, el sector de actividad económica para precargar benchmarks operacionales y la geografía de entrega.
        </p>

        {/* Client & Campaign Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Cliente / Cuenta Corporativa
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-atento-cyan focus:border-atento-cyan font-medium text-slate-900"
              placeholder="Ej. Banco Santander, Telefónica, Zara..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nombre de la Campaña u Operación
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-atento-cyan focus:border-atento-cyan font-medium text-slate-900"
              placeholder="Ej. Atención al Cliente N1 & Soporte Técnico"
            />
          </div>
        </div>
      </div>

      {/* Sector Selection (Templates) */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm">
        <h3 className="text-base font-bold text-atento-navy mb-1">
          Sector de Actividad (Benchmarks Operativos)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Al seleccionar un sector, se precargan los estándares de mercado para TMO/AHT, nivel de servicio (SLA) y potencial de automatización.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {SECTORS.map((sector) => {
            const Icon = SECTOR_ICONS[sector.id] || Building2;
            const isSelected = sectorId === sector.id;

            return (
              <button
                key={sector.id}
                onClick={() => setSectorId(sector.id)}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-atento-cyan bg-atento-cyan/5 ring-2 ring-atento-cyan/30 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${
                      isSelected ? 'bg-atento-cyan text-atento-navy' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-atento-navy">{sector.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{sector.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>AHT Voz:</span>
                    <span className="font-semibold text-slate-800">{sector.defaultAhtVoiceSec}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SLA:</span>
                    <span className="font-semibold text-slate-800">
                      {sector.defaultSlaPct}% / {sector.defaultSlaSeconds}s
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-atento-cyan text-atento-navy flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Geography & Delivery Model */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm">
        <h3 className="text-base font-bold text-atento-navy mb-1 flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-atento-blue" />
          País de Entrega Principal & Modelo Nearshore
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Selecciona el país base de contratación y ajusta opcionalmente el porcentaje de entrega deslocalizada (Nearshore) para optimización de costes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {COUNTRIES.map((country) => {
            const isSelected = financial.deliveryCountryId === country.id;

            return (
              <button
                key={country.id}
                onClick={() => updateFinancial({ deliveryCountryId: country.id })}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-atento-navy bg-atento-navy/5 ring-2 ring-atento-navy/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {country.code}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-atento-navy">{country.name}</h4>
                <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                  <div>Coste FTE: <strong className="text-slate-800">€{country.loadedLaborCostPerMonthEur}</strong></div>
                  <div>Shrinkage: <strong className="text-slate-800">{Math.round(country.defaultShrinkage * 100)}%</strong></div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-atento-navy text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Nearshore Blending Slider */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div>
              <span className="text-xs font-bold text-atento-navy uppercase tracking-wider">
                Distribución Nearshore (Colombia / Perú)
              </span>
              <p className="text-[11px] text-slate-500">
                Porcentaje de agentes asignados al hub nearshore en Colombia vs. hub onshore local.
              </p>
            </div>
            <span className="text-sm font-extrabold text-atento-navy bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
              {financial.nearshoreSharePct}% Nearshore ({100 - financial.nearshoreSharePct}% Onshore)
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={financial.nearshoreSharePct}
            onChange={(e) => updateFinancial({ nearshoreSharePct: Number(e.target.value) })}
            className="w-full accent-atento-cyan cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
            <span>0% (100% Onshore Puro)</span>
            <span>30% Blend</span>
            <span>60% Nearshore Óptimo</span>
            <span>100% (Nearshore Dedicado)</span>
          </div>
        </div>
      </div>

      {/* Operating Window */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm">
        <h3 className="text-base font-bold text-atento-navy mb-1 flex items-center gap-2">
          <Clock className="w-4 h-4 text-atento-blue" />
          Ventana de Atención Operativa
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Determina la cobertura requerida en turnos para los agentes de contact center.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {operatingWindows.map((win) => {
            const isSelected = financial.operatingWindow === win.id;

            return (
              <button
                key={win.id}
                onClick={() => updateFinancial({ operatingWindow: win.id })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-atento-cyan bg-atento-cyan/5 ring-2 ring-atento-cyan/30'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-sm text-atento-navy">{win.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{win.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Step Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setCurrentStep(2)}
          className="bg-atento-navy hover:bg-atento-navy-dark text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
        >
          <span>Siguiente: Dimensionador Omnicanal</span>
          <ChevronRight className="w-4 h-4 text-atento-cyan" />
        </button>
      </div>
    </div>
  );
};
