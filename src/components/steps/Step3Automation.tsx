import React from 'react';
import { useCampaign } from '../../context/CampaignContext';
import {
  Bot,
  Sparkles,
  Zap,
  Cpu,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const Step3Automation: React.FC = () => {
  const { automation, updateAutomation, calculation, setCurrentStep } = useCampaign();

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm">
        <h2 className="text-xl font-bold text-atento-navy flex items-center gap-2">
          <Bot className="w-6 h-6 text-atento-cyan" />
          <span>3. Capa de Inteligencia Artificial & Automatización</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configura el nivel de contención de Voicebots conversacionales y Chatbots en WhatsApp, así como la asistencia en tiempo real mediante Atento Agent Copilot para reducir el AHT humano.
        </p>
      </div>

      {/* Main Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Slider 1: Voicebot Deflection */}
        <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-atento-navy flex items-center justify-center mb-3">
              <Bot className="w-5 h-5 text-atento-blue" />
            </div>
            <h3 className="font-bold text-base text-atento-navy">Voicebot GenAI</h3>
            <p className="text-xs text-slate-500 mt-1">
              Contención y resolución autónoma de llamadas telefónicas de primer nivel (preguntas frecuentes, transacciones simples).
            </p>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase">Tasa de Contención (Deflection)</span>
                <span className="text-sm font-extrabold text-atento-blue bg-blue-50 px-2.5 py-0.5 rounded">
                  {automation.voicebotDeflectionPct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={automation.voicebotDeflectionPct}
                onChange={(e) => updateAutomation({ voicebotDeflectionPct: Number(e.target.value) })}
                className="w-full accent-atento-cyan cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% (Sin bot)</span>
                <span>30% (Recomendado)</span>
                <span>60% (Máx)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Coste por llamada bot:</span>
            <span className="font-semibold text-slate-800">€{automation.voicebotCostPerCall.toFixed(2)}</span>
          </div>
        </div>

        {/* Slider 2: Chatbot Deflection */}
        <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-base text-atento-navy">Chatbot WhatsApp & Web</h3>
            <p className="text-xs text-slate-500 mt-1">
              Resolución autónoma en canales digitales mediante modelos conversacionales conectados a las APIs del cliente.
            </p>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase">Tasa de Contención (Deflection)</span>
                <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                  {automation.chatbotDeflectionPct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="75"
                step="5"
                value={automation.chatbotDeflectionPct}
                onChange={(e) => updateAutomation({ chatbotDeflectionPct: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0%</span>
                <span>40% (Recomendado)</span>
                <span>75%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Coste por sesión bot:</span>
            <span className="font-semibold text-slate-800">€{automation.chatbotCostPerChat.toFixed(2)}</span>
          </div>
        </div>

        {/* Slider 3: Copilot AHT Reduction */}
        <div className="bg-white p-6 rounded-xl border border-atento-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-bold text-base text-atento-navy">Agent Copilot (Asistente en Vivo)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Resumen automático de llamadas (ACW), sugerencia de respuestas y búsqueda en bases de conocimiento para el agente humano.
            </p>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase">Reducción de TMO / AHT</span>
                <span className="text-sm font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded">
                  -{automation.copilotAhtReductionPct}% AHT
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="5"
                value={automation.copilotAhtReductionPct}
                onChange={(e) => updateAutomation({ copilotAhtReductionPct: Number(e.target.value) })}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0%</span>
                <span>20% (Estándar Atento)</span>
                <span>35%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Licencia Copilot / agente:</span>
            <span className="font-semibold text-slate-800">€{automation.copilotCostPerAgentMonth} / mes</span>
          </div>
        </div>
      </div>

      {/* Impact & Savings Analysis Bento Grid */}
      <div className="bg-gradient-to-r from-slate-900 to-atento-navy text-white p-6 rounded-xl shadow-card">
        <h3 className="text-sm font-bold uppercase tracking-wider text-atento-cyan flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4" />
          Balance de Impacto Operativo por Inteligencia Artificial
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="text-[11px] text-slate-300 uppercase">Interacciones Desviadas a IA</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {calculation.totalDeflectedInteractions.toLocaleString()}
            </div>
            <div className="text-xs text-atento-cyan mt-1">
              {Math.round((calculation.totalDeflectedInteractions / (calculation.totalInitialInteractions || 1)) * 100)}% del volumen total
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="text-[11px] text-slate-300 uppercase">Ahorro Neto de FTEs</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              -{calculation.fteSavedByAi} FTEs
            </div>
            <div className="text-xs text-slate-300 mt-1">
              vs. operación tradicional 100% humana
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="text-[11px] text-slate-300 uppercase">TMO Humano Optimizado</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {calculation.effectiveVoiceAhtSec} seg
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Reducción neta por Atento Copilot
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="text-[11px] text-slate-300 uppercase">Coste Mensual IA / Bots</span>
            <div className="text-2xl font-extrabold text-atento-cyan mt-1">
              €{calculation.aiBotCost.toLocaleString()}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Infraestructura y tokens de inferencia
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-2">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior: Canales</span>
        </button>

        <button
          onClick={() => setCurrentStep(4)}
          className="bg-atento-navy hover:bg-atento-navy-dark text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
        >
          <span>Siguiente: Costes & Pricing</span>
          <ChevronRight className="w-4 h-4 text-atento-cyan" />
        </button>
      </div>
    </div>
  );
};
