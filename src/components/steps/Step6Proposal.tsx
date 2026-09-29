import React from 'react';
import { useCampaign } from '../../context/CampaignContext';
import { getCountryById } from '../../data/countries';
import { getSectorById } from '../../data/sectors';
import {
  Printer,
  CheckCircle,
  Clock,
  Users,
  ShieldCheck,
  FileText,
  ChevronLeft,
} from 'lucide-react';

export const Step6Proposal: React.FC = () => {
  const {
    clientName,
    campaignName,
    sectorId,
    financial,
    workload,
    calculation,
    setCurrentStep,
  } = useCampaign();

  const country = getCountryById(financial.deliveryCountryId);
  const sector = getSectorById(sectorId);
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const quoteId = `ATN-PROP-${new Date().getFullYear()}-8492`;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header (Hidden in Print) */}
      <div className="bg-white p-5 rounded-xl border border-atento-border shadow-sm flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-atento-navy flex items-center gap-2">
            <FileText className="w-5 h-5 text-atento-cyan" />
            <span>6. Propuesta Ejecutiva & Resumen Comercial</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Documento formal para presentar al cliente. Puedes exportarlo directamente a PDF o imprimirlo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentStep(5)}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Editar Parámetros</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-atento-navy hover:bg-atento-navy-dark text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-atento-cyan" />
            <span>Imprimir / Guardar en PDF</span>
          </button>
        </div>
      </div>

      {/* DOCUMENTO FORMAL IMPRIMIBLE */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-8 md:p-12 max-w-4xl mx-auto text-slate-800 space-y-8 print:p-0 print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="border-b-2 border-atento-navy pb-6 flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-lg bg-atento-navy flex items-center justify-center text-atento-cyan font-black text-xl">
                A
              </div>
              <span className="text-2xl font-black tracking-tight text-atento-navy">ATENTO</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Customer Experience & Business Process Outsourcing</p>
            <p className="text-xs text-slate-400">Dirección de Desarrollo de Negocio & Soluciones Digitales</p>
          </div>

          <div className="text-right text-xs space-y-1">
            <div className="font-extrabold text-atento-navy text-sm font-mono">{quoteId}</div>
            <div className="text-slate-500">Fecha: {currentDate}</div>
            <div className="text-slate-500">Validez: 30 días naturales</div>
            <span className="inline-block bg-slate-100 font-semibold text-slate-700 px-2 py-0.5 rounded text-[11px] mt-1">
              Sector: {sector.name}
            </span>
          </div>
        </div>

        {/* Client & Executive Title */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-atento-cyan-dark">
            PROPUESTA TÉCNICO-ECONÓMICA PARA:
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-atento-navy mt-1">
            {clientName}
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Proyecto: <strong>{campaignName}</strong>
          </p>
        </div>

        {/* 1. Resumen Ejecutivo */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-atento-navy uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span>1. Resumen Ejecutivo del Servicio</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed text-justify">
            Atento presenta su solución integral de Contact Center Omnicanal asistida por Inteligencia Artificial de última generación. El modelo combina un equipo de agentes altamente cualificados con un ecosistema de Voicebots y Chatbots de contención autónoma, garantizando la máxima satisfacción del cliente ({sector.name}), cumplimiento estricto de SLAs y una reducción sustancial de los costes operativos globales frente a modelos convencionales.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Volumen Total Mes</span>
              <div className="text-lg font-extrabold text-atento-navy mt-0.5">
                {calculation.totalInitialInteractions.toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Contención por IA</span>
              <div className="text-lg font-extrabold text-emerald-600 mt-0.5">
                {Math.round((calculation.totalDeflectedInteractions / (calculation.totalInitialInteractions || 1)) * 100)}%
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Equipo de Agentes</span>
              <div className="text-lg font-extrabold text-atento-navy mt-0.5">
                {calculation.totalTeamHeadcount} FTEs
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Nivel de Servicio</span>
              <div className="text-lg font-extrabold text-atento-blue mt-0.5">
                {workload.voiceSlaTargetPct}% / {workload.voiceSlaSec}s
              </div>
            </div>
          </div>
        </div>

        {/* 2. Compromisos Operativos y SLAs */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-atento-navy uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span>2. Modelo Operativo & SLAs Comprometidos</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 border-b">Canal de Atención</th>
                  <th className="p-2.5 border-b">Volumen Previsto</th>
                  <th className="p-2.5 border-b">TMO / AHT Objetivo</th>
                  <th className="p-2.5 border-b">Nivel de Servicio (SLA)</th>
                  <th className="p-2.5 border-b text-right">Agentes Asignados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {workload.voiceInboundActive && (
                  <tr>
                    <td className="p-2.5 font-bold text-atento-navy">Voz Inbound (Llamadas)</td>
                    <td className="p-2.5">{calculation.effectiveVoiceCalls.toLocaleString()} atendidas (humano)</td>
                    <td className="p-2.5">{calculation.effectiveVoiceAhtSec} seg (con Copilot)</td>
                    <td className="p-2.5">{workload.voiceSlaTargetPct}% antes de {workload.voiceSlaSec} seg</td>
                    <td className="p-2.5 text-right font-bold">{calculation.voiceInboundFte} FTEs</td>
                  </tr>
                )}
                {workload.chatActive && (
                  <tr>
                    <td className="p-2.5 font-bold text-atento-navy">WhatsApp & Webchat Digital</td>
                    <td className="p-2.5">{calculation.effectiveChats.toLocaleString()} atendidas</td>
                    <td className="p-2.5">{workload.chatAhtSec} seg</td>
                    <td className="p-2.5">&lt; 30 seg primer tiempo respuesta</td>
                    <td className="p-2.5 text-right font-bold">{calculation.chatFte} FTEs</td>
                  </tr>
                )}
                {workload.voiceOutboundActive && (
                  <tr>
                    <td className="p-2.5 font-bold text-atento-navy">Voz Outbound (Marcación)</td>
                    <td className="p-2.5">{workload.voiceOutboundContacts.toLocaleString()} contactos</td>
                    <td className="p-2.5">{workload.voiceOutboundAhtSec} seg</td>
                    <td className="p-2.5">Contactabilidad &gt; {workload.voiceOutboundConnectRatePct}%</td>
                    <td className="p-2.5 text-right font-bold">{calculation.voiceOutboundFte} FTEs</td>
                  </tr>
                )}
                {workload.backofficeActive && (
                  <tr>
                    <td className="p-2.5 font-bold text-atento-navy">Backoffice & Gestión Tickets</td>
                    <td className="p-2.5">{workload.backofficeMonthlyTickets.toLocaleString()} casos</td>
                    <td className="p-2.5">{workload.backofficeMinutesPerTicket} min / ticket</td>
                    <td className="p-2.5">Resolución &lt; 24h</td>
                    <td className="p-2.5 text-right font-bold">{calculation.backofficeFte} FTEs</td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={4} className="p-2.5 text-atento-navy">
                    Estructura Indirecta de Gestión (Supervisión {financial.supervisorRatio}:1, Calidad QA {financial.qaRatio}:1, WFM {financial.wfmRatio}:1)
                  </td>
                  <td className="p-2.5 text-right font-bold">
                    {calculation.supervisorsFte + calculation.qaFte + calculation.wfmFte} FTEs
                  </td>
                </tr>
                <tr className="bg-blue-50 font-extrabold text-atento-navy text-sm">
                  <td colSpan={4} className="p-3">TOTAL DIMENSIONAMIENTO EQUIPO BPO ATENTO</td>
                  <td className="p-3 text-right">{calculation.totalTeamHeadcount} FTEs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Propuesta Económica */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-atento-navy uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span>3. Condiciones Económicas & Tarifas</span>
          </h2>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-bold">Presupuesto Mensual Estimado (TCV)</span>
              <div className="text-3xl font-extrabold text-atento-navy mt-1">
                {formatCurrency(calculation.monthlyRevenue)}
                <span className="text-xs text-slate-500 font-normal"> / mes</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Total anual presupuestado: <strong>{formatCurrency(calculation.monthlyRevenue * 12)}</strong>
              </p>
            </div>

            <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Tarifa por Hora Productiva:</span>
                <strong className="text-slate-900 font-mono">€{calculation.pricePerHourEur.toFixed(2)} / hora</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cuota Mensual por FTE Dedicado:</span>
                <strong className="text-slate-900 font-mono">€{calculation.pricePerFteMonthEur.toLocaleString()} / mes</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hub Principal de Entrega:</span>
                <strong className="text-slate-900">{country.name}</strong>
              </div>
              {financial.nearshoreSharePct > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Modelo Nearshore Blended:</span>
                  <span>{financial.nearshoreSharePct}% Colombia / {100 - financial.nearshoreSharePct}% Onshore</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. Plan de Transición e Implantación (8 semanas) */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-atento-navy uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span>4. Calendario de Puesta en Marcha (Ramp-up)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-atento-navy flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-atento-cyan-dark" /> Semanas 1 - 2
              </div>
              <div className="font-semibold text-slate-700 mt-1">Diseño & Setup Técnico</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Integración CTI, APIs de Bots y parametrización de CRM.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-atento-navy flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-atento-cyan-dark" /> Semanas 3 - 4
              </div>
              <div className="font-semibold text-slate-700 mt-1">Reclutamiento & Formación</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Capacitación en producto, procesos de negocio y Copilot.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-atento-navy flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-atento-cyan-dark" /> Semanas 5 - 6
              </div>
              <div className="font-semibold text-slate-700 mt-1">Piloto / Soft Launch</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Atención del 25% del tráfico en entorno real de pruebas.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-atento-navy flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Semanas 7 - 8
              </div>
              <div className="font-semibold text-slate-700 mt-1">Go-Live 100% Producción</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Operación a pleno rendimiento y monitorización continua.</p>
            </div>
          </div>
        </div>

        {/* Firmas Comerciales */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="font-bold text-atento-navy uppercase tracking-wider mb-8">Por ATENTO TELES SERVICIOS:</div>
            <div className="border-b border-slate-400 w-48 mb-1"></div>
            <div className="font-semibold text-slate-800">Dirección Comercial BPO</div>
            <div className="text-slate-500">Atento España / Latam</div>
          </div>

          <div>
            <div className="font-bold text-slate-700 uppercase tracking-wider mb-8">Conforme por el CLIENTE ({clientName}):</div>
            <div className="border-b border-slate-400 w-48 mb-1"></div>
            <div className="font-semibold text-slate-800">Representante Legal / Compras</div>
            <div className="text-slate-500">Fecha y Sello</div>
          </div>
        </div>
      </div>
    </div>
  );
};
