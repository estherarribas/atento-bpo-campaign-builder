import React from 'react';
import { useCampaign } from '../../context/CampaignContext';
import { getCountryById } from '../../data/countries';
import {
  Receipt,
  Users,
  Sparkles,
  Clock,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const LiveQuotationSidebar: React.FC = () => {
  const { calculation, financial, isClientPresentationMode, setCurrentStep } = useCampaign();
  const country = getCountryById(financial.deliveryCountryId);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const laborPct = calculation.totalDirectCost > 0
    ? Math.round((calculation.directLaborCost / calculation.totalDirectCost) * 100)
    : 70;
  const techPct = calculation.totalDirectCost > 0
    ? Math.round((calculation.ccaasTechCost / calculation.totalDirectCost) * 100)
    : 12;
  const superPct = calculation.totalDirectCost > 0
    ? Math.round((calculation.supervisoryCost / calculation.totalDirectCost) * 100)
    : 10;
  const botPct = calculation.totalDirectCost > 0
    ? Math.max(1, 100 - laborPct - techPct - superPct)
    : 8;

  return (
    <div className="bg-white rounded-xl border-2 border-atento-navy/20 shadow-card p-5 sticky top-[125px] flex flex-col gap-4 no-print">
      {/* Title & Mode */}
      <div className="flex items-center justify-between pb-3 border-b border-atento-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-atento-navy flex items-center justify-center text-atento-cyan">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-atento-navy">Resumen Económico</h3>
            <p className="text-[11px] text-slate-500">Cotización en tiempo real</p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-atento-cyan/15 text-atento-cyan-dark">
          {country.code} {financial.nearshoreSharePct > 0 ? `+ ${financial.nearshoreSharePct}% Near` : '100% Onshore'}
        </span>
      </div>

      {/* TCV (Total Contract Value) Display */}
      <div className="bg-gradient-to-br from-atento-navy to-atento-navy-dark text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-10 pointer-events-none">
          <Receipt className="w-24 h-24 text-white" />
        </div>
        <span className="text-[11px] uppercase tracking-wider text-atento-cyan font-semibold">
          Presupuesto Mensual Estimado (TCV)
        </span>
        <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
          {formatCurrency(calculation.monthlyRevenue)}
          <span className="text-xs font-normal text-slate-300 ml-1">/ mes</span>
        </div>
        <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          {formatCurrency(calculation.monthlyRevenue * 12)} / anual recurrente
        </p>
      </div>

      {/* Key Pricing Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <div className="text-slate-500 text-[11px] flex items-center gap-1">
            <Clock className="w-3 h-3 text-atento-cyan-dark" /> Tarifa Hora
          </div>
          <div className="text-base font-bold text-atento-navy mt-0.5">
            €{calculation.pricePerHourEur.toFixed(2)}
            <span className="text-[10px] text-slate-500 font-normal"> / h</span>
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <div className="text-slate-500 text-[11px] flex items-center gap-1">
            <Users className="w-3 h-3 text-atento-cyan-dark" /> Tarifa por FTE
          </div>
          <div className="text-base font-bold text-atento-navy mt-0.5">
            €{calculation.pricePerFteMonthEur.toLocaleString()}
            <span className="text-[10px] text-slate-500 font-normal"> / fte</span>
          </div>
        </div>
      </div>

      {/* Operational Headcount Summary */}
      <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-200 text-xs">
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold text-atento-navy flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-atento-blue" /> Dimensionamiento Total
          </span>
          <span className="font-extrabold text-sm text-atento-navy">
            {calculation.totalTeamHeadcount} FTEs
          </span>
        </div>
        <div className="text-[11px] text-slate-600 flex justify-between">
          <span>{calculation.totalDirectAgentsFte} Agentes de atención</span>
          <span className="text-slate-400">|</span>
          <span>+{calculation.supervisorsFte + calculation.qaFte + calculation.wfmFte} Estructura (Sup/QA/WFM)</span>
        </div>

        {calculation.fteSavedByAi > 0 && (
          <div className="mt-2 pt-2 border-t border-blue-200/60 flex items-center justify-between text-emerald-700 font-medium text-[11px]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Ahorro neto por IA:
            </span>
            <span className="font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
              -{calculation.fteSavedByAi} FTEs ({Math.round((calculation.fteSavedByAi / (calculation.baselineDirectAgentsFte || 1)) * 100)}%)
            </span>
          </div>
        )}
      </div>

      {/* Confidential Margins Section (Masked in Client Mode) */}
      <div className="p-3 rounded-lg border border-slate-200 text-xs bg-slate-50">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
            Rentabilidad Interna (P&L)
          </span>
          {isClientPresentationMode ? (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Enmascarado en Modo Cliente
            </span>
          ) : (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                calculation.marginStatus === 'healthy'
                  ? 'bg-emerald-100 text-emerald-800'
                  : calculation.marginStatus === 'warning'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {calculation.marginStatus === 'healthy' ? (
                <CheckCircle2 className="w-2.5 h-2.5" />
              ) : (
                <AlertCircle className="w-2.5 h-2.5" />
              )}
              {calculation.marginStatus === 'healthy'
                ? 'Margen Aprobado'
                : calculation.marginStatus === 'warning'
                ? 'Margen Ajustado'
                : 'Requiere Autorización'}
            </span>
          )}
        </div>

        {isClientPresentationMode ? (
          <div className="py-2 text-center text-slate-400 italic text-[11px]">
            Los datos de coste interno y margen bruto están protegidos durante presentaciones externas.
          </div>
        ) : (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Coste Directo Operativo:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(calculation.totalDirectCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Margen Bruto de Contribución:</span>
              <span className="font-bold text-emerald-600">
                {calculation.grossMarginPct.toFixed(1)}% ({formatCurrency(calculation.grossMarginAmount)})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">EBITDA Estimado:</span>
              <span className="font-semibold text-atento-navy">{calculation.ebitdaPct.toFixed(1)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Cost Structure Progress Breakdown */}
      {!isClientPresentationMode && (
        <div className="text-xs space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Composición de Coste:</span>
            <span>Labor {laborPct}% | CCaaS {techPct}% | IA {botPct}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full flex overflow-hidden">
            <div style={{ width: `${laborPct}%` }} className="bg-atento-navy" title={`Mano de Obra: ${laborPct}%`} />
            <div style={{ width: `${superPct}%` }} className="bg-atento-blue" title={`Supervisión/QA: ${superPct}%`} />
            <div style={{ width: `${techPct}%` }} className="bg-atento-cyan" title={`Licencias CCaaS: ${techPct}%`} />
            <div style={{ width: `${botPct}%` }} className="bg-emerald-500" title={`Consumo Bots IA: ${botPct}%`} />
          </div>
        </div>
      )}

      {/* Primary Action Button */}
      <button
        onClick={() => setCurrentStep(6)}
        className="w-full py-2.5 px-4 bg-atento-navy hover:bg-atento-navy-dark text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group active:scale-98"
      >
        <span>Ver Propuesta Formal</span>
        <ArrowRight className="w-3.5 h-3.5 text-atento-cyan group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
