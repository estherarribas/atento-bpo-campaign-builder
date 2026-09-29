import React from 'react';
import { useCampaign } from '../../context/CampaignContext';
import {
  PhoneCall,
  PhoneForwarded,
  MessageSquare,
  MailCheck,
  Activity,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const Step2Channels: React.FC = () => {
  const { workload, updateWorkload, calculation, setCurrentStep } = useCampaign();

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm">
        <h2 className="text-xl font-bold text-atento-navy flex items-center gap-2">
          <span>2. Dimensionador de Canales Omnicanal</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Ajusta los volúmenes mensuales y tiempos de atención. El motor Erlang-C y de concurrencia calcula en tiempo real los agentes requeridos para garantizar los SLAs comprometidos.
        </p>
      </div>

      {/* 1. VOZ INBOUND (Erlang-C) */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-atento-navy flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-atento-blue" />
            </div>
            <div>
              <h3 className="font-bold text-base text-atento-navy">Voz Inbound (Atención Entrante)</h3>
              <p className="text-xs text-slate-500">Modelado matemático de colas Erlang-C para hora punta</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={workload.voiceInboundActive}
              onChange={(e) => updateWorkload({ voiceInboundActive: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-atento-navy"></div>
          </label>
        </div>

        {workload.voiceInboundActive ? (
          <div className="space-y-5 pt-2">
            {/* Slider 1: Monthly Calls */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Volumen Mensual de Llamadas
                </span>
                <span className="text-sm font-extrabold text-atento-navy bg-slate-100 px-2.5 py-0.5 rounded">
                  {workload.voiceMonthlyCalls.toLocaleString()} llamadas
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={workload.voiceMonthlyCalls}
                onChange={(e) => updateWorkload({ voiceMonthlyCalls: Number(e.target.value) })}
                className="w-full accent-atento-cyan cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>5.000</span>
                <span>100.000</span>
                <span>250.000</span>
                <span>500.000</span>
              </div>
            </div>

            {/* Slider 2: AHT (TMO) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tiempo Medio de Operación (AHT / TMO)
                  </span>
                  <span className="text-sm font-extrabold text-atento-navy bg-slate-100 px-2.5 py-0.5 rounded">
                    {workload.voiceAhtSec} seg ({Math.floor(workload.voiceAhtSec / 60)}m {workload.voiceAhtSec % 60}s)
                  </span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="600"
                  step="10"
                  value={workload.voiceAhtSec}
                  onChange={(e) => updateWorkload({ voiceAhtSec: Number(e.target.value) })}
                  className="w-full accent-atento-cyan cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>90s (1.5m)</span>
                  <span>300s (5m)</span>
                  <span>600s (10m)</span>
                </div>
              </div>

              {/* Slider 3: Peak Hour % */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Concentración en Hora Punta
                  </span>
                  <span className="text-sm font-extrabold text-atento-navy bg-slate-100 px-2.5 py-0.5 rounded">
                    {workload.voicePeakHourCallsPct}% del día
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="0.5"
                  value={workload.voicePeakHourCallsPct}
                  onChange={(e) => updateWorkload({ voicePeakHourCallsPct: Number(e.target.value) })}
                  className="w-full accent-atento-cyan cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>5% (Tráfico plano)</span>
                  <span>9% (Típico BPO)</span>
                  <span>15% (Pico agudo)</span>
                </div>
              </div>
            </div>

            {/* SLA targets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Objetivo Nivel de Servicio (SLA %)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="60"
                    max="99"
                    value={workload.voiceSlaTargetPct}
                    onChange={(e) => updateWorkload({ voiceSlaTargetPct: Number(e.target.value) })}
                    className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold"
                  />
                  <span className="text-xs text-slate-500">% atendidas antes de:</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiempo Umbral de Espera (Segundos)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="5"
                    max="120"
                    step="5"
                    value={workload.voiceSlaSec}
                    onChange={(e) => updateWorkload({ voiceSlaSec: Number(e.target.value) })}
                    className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold"
                  />
                  <span className="text-xs text-slate-500">segundos (ej. 80/20 o 85/20)</span>
                </div>
              </div>
            </div>

            {/* Live Erlang-C Stats Card */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-atento-blue" />
                <div>
                  <div className="text-xs font-bold text-atento-navy uppercase tracking-wider">
                    Cálculo Erlang-C Activo
                  </div>
                  <div className="text-[11px] text-slate-600">
                    SLA alcanzado: <strong>{workload.voiceSlaTargetPct}%</strong> en hora punta
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">FTEs Inbound (con Shrinkage)</div>
                  <div className="text-lg font-extrabold text-atento-navy">{calculation.voiceInboundFte} FTEs</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-400 italic">
            Canal de Voz Inbound desactivado para esta campaña.
          </div>
        )}
      </div>

      {/* 2. WHATSAPP & DIGITAL CHAT */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-base text-atento-navy">WhatsApp & Webchat Digital</h3>
              <p className="text-xs text-slate-500">Interacciones simultáneas y mensajería asíncrona</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={workload.chatActive}
              onChange={(e) => updateWorkload({ chatActive: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-atento-navy"></div>
          </label>
        </div>

        {workload.chatActive ? (
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Conversaciones Mensuales de WhatsApp / Chat
                </span>
                <span className="text-sm font-extrabold text-atento-navy bg-slate-100 px-2.5 py-0.5 rounded">
                  {workload.chatMonthlyConversations.toLocaleString()} convs
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="300000"
                step="2000"
                value={workload.chatMonthlyConversations}
                onChange={(e) => updateWorkload({ chatMonthlyConversations: Number(e.target.value) })}
                className="w-full accent-atento-cyan cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    AHT Medio del Chat
                  </span>
                  <span className="text-sm font-extrabold text-atento-navy bg-slate-100 px-2.5 py-0.5 rounded">
                    {workload.chatAhtSec} seg ({Math.floor(workload.chatAhtSec / 60)} min)
                  </span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="720"
                  step="30"
                  value={workload.chatAhtSec}
                  onChange={(e) => updateWorkload({ chatAhtSec: Number(e.target.value) })}
                  className="w-full accent-atento-cyan cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Concurrencia Simultánea por Agente
                  </span>
                  <span className="text-sm font-extrabold text-atento-navy bg-slate-100 px-2.5 py-0.5 rounded">
                    {workload.chatConcurrency} chats simultáneos
                  </span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="3.5"
                  step="0.1"
                  value={workload.chatConcurrency}
                  onChange={(e) => updateWorkload({ chatConcurrency: Number(e.target.value) })}
                  className="w-full accent-atento-cyan cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>1.2 (VIP/Complejo)</span>
                  <span>2.2 (Estándar)</span>
                  <span>3.5 (Transaccional)</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
              <span className="text-emerald-900 font-medium">FTEs Digitales Requeridos para Chat:</span>
              <strong className="text-base text-emerald-900">{calculation.chatFte} FTEs</strong>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-400 italic">
            Canal de WhatsApp / Chat desactivado.
          </div>
        )}
      </div>

      {/* 3. VOZ OUTBOUND (Campañas Salientes) */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <PhoneForwarded className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-base text-atento-navy">Voz Outbound (Marcación Predictiva)</h3>
              <p className="text-xs text-slate-500">Telemarketing, concertación de citas y recobro</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={workload.voiceOutboundActive}
              onChange={(e) => updateWorkload({ voiceOutboundActive: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-atento-navy"></div>
          </label>
        </div>

        {workload.voiceOutboundActive && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contactos Mes a Emitir</label>
              <input
                type="number"
                step="5000"
                value={workload.voiceOutboundContacts}
                onChange={(e) => updateWorkload({ voiceOutboundContacts: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tasa de Contactabilidad (Connect %)</label>
              <input
                type="number"
                min="10"
                max="90"
                value={workload.voiceOutboundConnectRatePct}
                onChange={(e) => updateWorkload({ voiceOutboundConnectRatePct: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">AHT Contacto Útil (Seg)</label>
              <input
                type="number"
                step="10"
                value={workload.voiceOutboundAhtSec}
                onChange={(e) => updateWorkload({ voiceOutboundAhtSec: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. BACKOFFICE & EMAILS */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <MailCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-base text-atento-navy">Backoffice & Gestión de Emails / Tickets</h3>
              <p className="text-xs text-slate-500">Procesamiento documental, reclamaciones y tramitaciones</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={workload.backofficeActive}
              onChange={(e) => updateWorkload({ backofficeActive: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-atento-navy"></div>
          </label>
        </div>

        {workload.backofficeActive && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tickets / Casos Mensuales</label>
              <input
                type="number"
                step="1000"
                value={workload.backofficeMonthlyTickets}
                onChange={(e) => updateWorkload({ backofficeMonthlyTickets: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tiempo Medio por Ticket (Minutos)</label>
              <input
                type="number"
                step="1"
                value={workload.backofficeMinutesPerTicket}
                onChange={(e) => updateWorkload({ backofficeMinutesPerTicket: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-2">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior: Contexto</span>
        </button>

        <button
          onClick={() => setCurrentStep(3)}
          className="bg-atento-navy hover:bg-atento-navy-dark text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
        >
          <span>Siguiente: IA & Automatización</span>
          <ChevronRight className="w-4 h-4 text-atento-cyan" />
        </button>
      </div>
    </div>
  );
};
