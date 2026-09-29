import React from 'react';
import { useCampaign } from '../../context/CampaignContext';
import {
  GitCompare,
  TrendingDown,
  Users,
  Clock,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const Step5Scenarios: React.FC = () => {
  const { scenarios, applyScenario, setCurrentStep, isClientPresentationMode } = useCampaign();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const chartData = scenarios.map((sc) => ({
    name: sc.title.split(' ')[0],
    fullName: sc.title,
    FTEs: sc.totalFte,
    TCV_Miles: Math.round(sc.monthlyRevenue / 1000),
    TarifaHora: sc.pricePerHour,
  }));

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm">
        <h2 className="text-xl font-bold text-atento-navy flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-atento-cyan" />
          <span>5. Comparativa de Escenarios What-If</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Analiza el retorno de inversión y el ahorro acumulado comparando la operación tradicional frente a los modelos asistidos por IA y entrega nearshore.
        </p>
      </div>

      {/* 3 Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {scenarios.map((sc) => {
          const isHybrid = sc.id === 'scenario_hybrid';

          return (
            <div
              key={sc.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all relative ${
                isHybrid
                  ? 'border-2 border-atento-cyan bg-white shadow-card ring-2 ring-atento-cyan/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
              }`}
            >
              {isHybrid && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-atento-navy text-atento-cyan text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm border border-atento-cyan/30">
                  Propuesta Recomendada Atento
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                      sc.id === 'scenario_traditional'
                        ? 'bg-slate-100 text-slate-700'
                        : sc.id === 'scenario_hybrid'
                        ? 'bg-atento-cyan/15 text-atento-navy font-bold'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {sc.tag}
                  </span>
                  <span className="text-[11px] text-slate-400">{sc.country}</span>
                </div>

                <h3 className="font-bold text-base text-atento-navy mt-1">{sc.title}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{sc.description}</p>

                {/* Metrics Breakdown */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-atento-blue" /> Headcount Total:
                    </span>
                    <span className="font-extrabold text-slate-800">{sc.totalFte} FTEs</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-atento-cyan-dark" /> Tarifa por Hora:
                    </span>
                    <span className="font-extrabold text-slate-800">€{sc.pricePerHour.toFixed(2)} / h</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Presupuesto Mensual:</span>
                    <span className="font-extrabold text-atento-navy text-sm">
                      {formatCurrency(sc.monthlyRevenue)}
                    </span>
                  </div>

                  {sc.savingsVsBaselinePct > 0 && (
                    <div className="flex justify-between items-center pt-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">
                      <span className="flex items-center gap-1 text-[11px]">
                        <TrendingDown className="w-3.5 h-3.5" /> Ahorro vs. Línea Base:
                      </span>
                      <span>-{sc.savingsVsBaselinePct}% TCV</span>
                    </div>
                  )}

                  {!isClientPresentationMode && (
                    <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                      <span>Margen Bruto Atento:</span>
                      <span className="font-semibold text-slate-700">{sc.grossMarginPct.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => applyScenario(sc.id)}
                className={`mt-5 w-full py-2.5 rounded-lg text-xs font-bold transition-all text-center ${
                  isHybrid
                    ? 'bg-atento-navy hover:bg-atento-navy-dark text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                {isHybrid ? 'Configuración Activa' : 'Aplicar este Escenario'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Recharts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: FTE Comparison */}
        <div className="bg-white p-5 rounded-xl border border-atento-border shadow-sm">
          <h3 className="font-bold text-sm text-atento-navy mb-1">
            Comparativa de Headcount Requerido (FTEs)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Evolución de agentes necesarios según el nivel de contención con IA.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: number) => [`${val} FTEs`, 'Personal Total']}
                  labelFormatter={(name) => `Escenario: ${name}`}
                />
                <Bar dataKey="FTEs" fill="#002B49" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: TCV Monthly Cost Comparison */}
        <div className="bg-white p-5 rounded-xl border border-atento-border shadow-sm">
          <h3 className="font-bold text-sm text-atento-navy mb-1">
            Coste Mensual Estimado (Miles de Euros / mes)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Optimización del Total Contract Value (TCV) entre escenarios.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: number) => [`€${val * 1000} / mes`, 'Presupuesto']}
                  labelFormatter={(name) => `Escenario: ${name}`}
                />
                <Bar dataKey="TCV_Miles" fill="#00A3E0" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-2">
        <button
          onClick={() => setCurrentStep(4)}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior: Costes & Pricing</span>
        </button>

        <button
          onClick={() => setCurrentStep(6)}
          className="bg-atento-cyan hover:bg-atento-cyan-light text-atento-navy font-bold text-sm px-6 py-3 rounded-xl shadow-glow transition-all flex items-center gap-2"
        >
          <span>Generar Propuesta Ejecutiva</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
