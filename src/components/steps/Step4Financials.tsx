import React from 'react';
import { useCampaign } from '../../context/CampaignContext';
import { PricingModel } from '../../types/campaign';
import {
  Coins,
  ShieldAlert,
  Lock,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const Step4Financials: React.FC = () => {
  const {
    financial,
    updateFinancial,
    calculation,
    isClientPresentationMode,
    setCurrentStep,
  } = useCampaign();

  const pricingModels: { id: PricingModel; title: string; desc: string; rateDisplay: string }[] = [
    {
      id: 'per_hour',
      title: 'Precio por Hora Productiva',
      desc: 'Facturación por horas de conexión efectiva de agente',
      rateDisplay: `€${calculation.pricePerHourEur.toFixed(2)} / h`,
    },
    {
      id: 'per_fte',
      title: 'Precio por FTE Dedicado',
      desc: 'Cuota mensual fija por agente asignado en exclusiva',
      rateDisplay: `€${calculation.pricePerFteMonthEur.toLocaleString()} / mes`,
    },
    {
      id: 'per_interaction',
      title: 'Precio por Contacto / Transacción',
      desc: 'Pago por volumen real de llamadas y chats resueltos',
      rateDisplay: `€${calculation.pricePerVoiceCallEur.toFixed(2)} / llamada`,
    },
    {
      id: 'hybrid',
      title: 'Modelo Híbrido (Base + Éxito)',
      desc: 'Base de costes fijos + bonus por cumplimiento de NPS/FCR',
      rateDisplay: 'Fijo + Variable',
    },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm">
        <h2 className="text-xl font-bold text-atento-navy flex items-center gap-2">
          <Coins className="w-6 h-6 text-atento-cyan" />
          <span>4. Modelo Financiero, Ratios de Estructura & Pricing</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configura el modelo contractual de facturación al cliente y ajusta los guardrails de margen bruto y EBITDA corporativo de Atento.
        </p>
      </div>

      {/* Pricing Model Selector */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm">
        <h3 className="text-base font-bold text-atento-navy mb-1">
          Modalidad de Facturación Comercial
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Selecciona el esquema tarifario que se incluirá en la propuesta formal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pricingModels.map((model) => {
            const isSelected = financial.pricingModel === model.id;

            return (
              <button
                key={model.id}
                onClick={() => updateFinancial({ pricingModel: model.id })}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-atento-cyan bg-atento-cyan/5 ring-2 ring-atento-cyan/30 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-atento-navy">{model.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{model.desc}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Tarifa cotizada:</span>
                  <span className="text-xs font-extrabold text-atento-navy bg-slate-100 px-2 py-0.5 rounded">
                    {model.rateDisplay}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Margins & Guardrails */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-atento-navy">
              Objetivo de Margen Bruto & Guardrails Comerciales
            </h3>
            <p className="text-xs text-slate-500">
              Determina el mark-up sobre costes operativos directos. Umbral mínimo recomendado Atento: <strong>18.0%</strong>.
            </p>
          </div>

          <span
            className={`text-sm font-extrabold px-3 py-1 rounded-lg ${
              financial.targetGrossMarginPct >= 18
                ? 'bg-emerald-100 text-emerald-800'
                : financial.targetGrossMarginPct >= 12
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            Margen Objetivo: {financial.targetGrossMarginPct}%
          </span>
        </div>

        <input
          type="range"
          min="8"
          max="35"
          step="0.5"
          value={financial.targetGrossMarginPct}
          onChange={(e) => updateFinancial({ targetGrossMarginPct: Number(e.target.value) })}
          className="w-full accent-atento-cyan cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>8% (Crítico / No recomendado)</span>
          <span>15% (Ajustado)</span>
          <span>22% (Estándar Atento)</span>
          <span>35% (Premium Especializado)</span>
        </div>

        {financial.targetGrossMarginPct < 15 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Alerta de Gobernanza:</strong> Un margen inferior al 15% requiere aprobación especial de la Dirección Comercial de Atento.
            </span>
          </div>
        )}
      </div>

      {/* Indirect Structure Staffing Ratios */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm">
        <h3 className="text-base font-bold text-atento-navy mb-1">
          Ratios de Supervisión & Estructura Operativa
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Determinan el número de coordinadores, auditores de calidad (QA) y analistas de WFM asignados a la campaña.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Supervisores (1 cada X agentes)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="8"
                max="25"
                value={financial.supervisorRatio}
                onChange={(e) => updateFinancial({ supervisorRatio: Number(e.target.value) })}
                className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold"
              />
              <span className="text-xs text-slate-500">= {calculation.supervisorsFte} Supervisores</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Calidad / QA (1 cada X agentes)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="15"
                max="50"
                value={financial.qaRatio}
                onChange={(e) => updateFinancial({ qaRatio: Number(e.target.value) })}
                className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold"
              />
              <span className="text-xs text-slate-500">= {calculation.qaFte} Auditores QA</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Licencia CCaaS / Agente (€/mes)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="50"
                max="250"
                step="10"
                value={financial.ccaasLicensePerAgentEur}
                onChange={(e) => updateFinancial({ ccaasLicensePerAgentEur: Number(e.target.value) })}
                className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold"
              />
              <span className="text-xs text-slate-500">€/usuario/mes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete P&L Statement (Masked in Client Mode) */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-atento-navy">Cuenta de Explotación Prevista (P&L Mensual)</h3>
            <p className="text-xs text-slate-500">Desglose integral de ingresos, costes directos y margen operativo</p>
          </div>

          {isClientPresentationMode && (
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> P&L Protegido (Modo Cliente)
            </span>
          )}
        </div>

        {isClientPresentationMode ? (
          <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Lock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-700">Información Financiera Confidencial</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Los costes laborales y márgenes internos han sido enmascarados para preservar la confidencialidad durante la sesión con el cliente.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="pb-2">Partida Contable</th>
                  <th className="pb-2 text-right">Importe Mensual (€)</th>
                  <th className="pb-2 text-right">% s/ Ingresos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                <tr>
                  <td className="py-2.5">Coste Laboral Directo ({calculation.totalDirectAgentsFte} FTEs)</td>
                  <td className="py-2.5 text-right font-mono">{formatCurrency(calculation.directLaborCost)}</td>
                  <td className="py-2.5 text-right text-slate-500">
                    {Math.round((calculation.directLaborCost / (calculation.monthlyRevenue || 1)) * 100)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5">Supervisión, Calidad & WFM ({calculation.supervisorsFte + calculation.qaFte + calculation.wfmFte} FTEs)</td>
                  <td className="py-2.5 text-right font-mono">{formatCurrency(calculation.supervisoryCost)}</td>
                  <td className="py-2.5 text-right text-slate-500">
                    {Math.round((calculation.supervisoryCost / (calculation.monthlyRevenue || 1)) * 100)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5">Infraestructura, Puestos & Conectividad</td>
                  <td className="py-2.5 text-right font-mono">{formatCurrency(calculation.facilitiesCost)}</td>
                  <td className="py-2.5 text-right text-slate-500">
                    {Math.round((calculation.facilitiesCost / (calculation.monthlyRevenue || 1)) * 100)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5">Plataforma Tecnológica CCaaS & Grabación</td>
                  <td className="py-2.5 text-right font-mono">{formatCurrency(calculation.ccaasTechCost)}</td>
                  <td className="py-2.5 text-right text-slate-500">
                    {Math.round((calculation.ccaasTechCost / (calculation.monthlyRevenue || 1)) * 100)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5">Servicios de IA, Bots & Copilot</td>
                  <td className="py-2.5 text-right font-mono">{formatCurrency(calculation.aiBotCost)}</td>
                  <td className="py-2.5 text-right text-slate-500">
                    {Math.round((calculation.aiBotCost / (calculation.monthlyRevenue || 1)) * 100)}%
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900 border-t border-b border-slate-300">
                  <td className="py-3">COSTE TOTAL OPERATIVO (COGS)</td>
                  <td className="py-3 text-right font-mono">{formatCurrency(calculation.totalDirectCost)}</td>
                  <td className="py-3 text-right">
                    {Math.round((calculation.totalDirectCost / (calculation.monthlyRevenue || 1)) * 100)}%
                  </td>
                </tr>
                <tr className="bg-blue-50/70 font-extrabold text-atento-navy">
                  <td className="py-3 text-sm">INGRESOS FACTURADOS (TCV MENSUAL)</td>
                  <td className="py-3 text-right text-sm font-mono">{formatCurrency(calculation.monthlyRevenue)}</td>
                  <td className="py-3 text-right text-sm">100.0%</td>
                </tr>
                <tr className="font-bold text-emerald-700">
                  <td className="py-2.5">MARGEN BRUTO DE CONTRIBUCIÓN</td>
                  <td className="py-2.5 text-right font-mono">{formatCurrency(calculation.grossMarginAmount)}</td>
                  <td className="py-2.5 text-right">{calculation.grossMarginPct.toFixed(1)}%</td>
                </tr>
                <tr className="font-bold text-atento-blue">
                  <td className="py-2.5">EBITDA ESTIMADO (después de SG&A ~6.5%)</td>
                  <td className="py-2.5 text-right font-mono">
                    {formatCurrency(calculation.monthlyRevenue * (calculation.ebitdaPct / 100))}
                  </td>
                  <td className="py-2.5 text-right">{calculation.ebitdaPct.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-2">
        <button
          onClick={() => setCurrentStep(3)}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior: IA</span>
        </button>

        <button
          onClick={() => setCurrentStep(5)}
          className="bg-atento-navy hover:bg-atento-navy-dark text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
        >
          <span>Siguiente: Comparativa Escenarios</span>
          <ChevronRight className="w-4 h-4 text-atento-cyan" />
        </button>
      </div>
    </div>
  );
};
