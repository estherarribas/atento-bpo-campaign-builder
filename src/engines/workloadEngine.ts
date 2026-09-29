import { OmnichannelWorkload, AutomationConfig, CountryConfig } from '../types/campaign';
import { solveAgentsForSla, applyShrinkageToFte } from './erlangEngine';

export interface WorkloadEngineResult {
  // Volume stats
  totalInitialInteractions: number;
  totalDeflectedInteractions: number;
  totalHumanInteractions: number;
  effectiveVoiceCalls: number;
  effectiveVoiceAhtSec: number;
  effectiveChats: number;

  // Headcount breakdown
  voiceInboundFte: number;
  voiceOutboundFte: number;
  chatFte: number;
  backofficeFte: number;
  totalDirectAgentsFte: number;

  // Baseline comparison (without AI)
  baselineDirectAgentsFte: number;
  fteSavedByAi: number;
  pctFteSaved: number;

  // Peak metrics
  voiceErlangs: number;
  voicePeakAgents: number;
  voiceSlaAchievedPct: number;
}

export const calculateOmnichannelWorkload = (
  workload: OmnichannelWorkload,
  automation: AutomationConfig,
  country: CountryConfig,
  workingDaysPerMonth: number = 22
): WorkloadEngineResult => {
  const shrinkage = country.defaultShrinkage;

  // 1. VOZ INBOUND
  const rawVoiceCalls = workload.voiceInboundActive ? workload.voiceMonthlyCalls : 0;
  const voiceDeflectionDecimal = workload.voiceInboundActive ? automation.voicebotDeflectionPct / 100.0 : 0;
  const copilotReductionDecimal = automation.copilotAhtReductionPct / 100.0;

  const deflectedVoiceCalls = Math.round(rawVoiceCalls * voiceDeflectionDecimal);
  const effectiveVoiceCalls = rawVoiceCalls - deflectedVoiceCalls;

  // Copilot reduce el AHT (especialmente el tiempo de After Call Work / ACW)
  const effectiveVoiceAhtSec = Math.round(workload.voiceAhtSec * (1.0 - copilotReductionDecimal));

  // Estimación de llamadas en hora punta (típicamente 8%-10% del volumen diario)
  const dailyVoiceCalls = effectiveVoiceCalls / workingDaysPerMonth;
  const peakHourCalls = dailyVoiceCalls * (workload.voicePeakHourCallsPct / 100.0);

  const erlangResult = solveAgentsForSla(
    peakHourCalls,
    effectiveVoiceAhtSec,
    workload.voiceSlaTargetPct,
    workload.voiceSlaSec,
    workload.voiceOccupancyTarget
  );

  const voiceInboundFte = workload.voiceInboundActive
    ? applyShrinkageToFte(erlangResult.rawAgentsPeak, shrinkage)
    : 0;

  // Cálculo de línea base para voz (sin IA)
  const baselinePeakHourCalls = (rawVoiceCalls / workingDaysPerMonth) * (workload.voicePeakHourCallsPct / 100.0);
  const baselineErlang = solveAgentsForSla(
    baselinePeakHourCalls,
    workload.voiceAhtSec,
    workload.voiceSlaTargetPct,
    workload.voiceSlaSec,
    workload.voiceOccupancyTarget
  );
  const baselineVoiceFte = workload.voiceInboundActive
    ? applyShrinkageToFte(baselineErlang.rawAgentsPeak, shrinkage)
    : 0;

  // 2. VOZ OUTBOUND (Marcador predictivo)
  const rawOutboundContacts = workload.voiceOutboundActive ? workload.voiceOutboundContacts : 0;
  const connectRate = workload.voiceOutboundConnectRatePct / 100.0;
  // Tiempo medio por contacto emitido: contactos efectivos * AHT + contactos no atendidos * 15s de timbrado
  const effectiveOutboundTimeSec = connectRate * workload.voiceOutboundAhtSec + (1.0 - connectRate) * 15.0;
  const totalOutboundHours = (rawOutboundContacts * effectiveOutboundTimeSec) / 3600.0;
  const monthlyEffectiveHours = country.monthlyEffectiveHours;

  const voiceOutboundFte = workload.voiceOutboundActive && monthlyEffectiveHours > 0
    ? Math.ceil((totalOutboundHours / (monthlyEffectiveHours * (1.0 - shrinkage))) * 10) / 10
    : 0;

  const baselineOutboundFte = voiceOutboundFte;

  // 3. WHATSAPP & DIGITAL WEBCHAT
  const rawChats = workload.chatActive ? workload.chatMonthlyConversations : 0;
  const chatDeflectionDecimal = workload.chatActive ? automation.chatbotDeflectionPct / 100.0 : 0;
  const deflectedChats = Math.round(rawChats * chatDeflectionDecimal);
  const effectiveChats = rawChats - deflectedChats;

  // Concurrencia (ej. 2.5 chats en paralelo por agente) y reducción por Copilot
  const effectiveChatAhtSec = Math.round(workload.chatAhtSec * (1.0 - copilotReductionDecimal * 0.7));
  const concurrency = Math.max(workload.chatConcurrency, 1.0);

  // Horas totales requeridas de agente humano
  const totalChatHours = (effectiveChats * effectiveChatAhtSec) / 3600.0;
  const effectiveChatHoursPerAgent = monthlyEffectiveHours * concurrency * (1.0 - shrinkage);

  const chatFte = workload.chatActive && effectiveChatHoursPerAgent > 0
    ? Math.ceil((totalChatHours / effectiveChatHoursPerAgent) * 10) / 10
    : 0;

  // Línea base chat (sin bot)
  const baselineChatHours = (rawChats * workload.chatAhtSec) / 3600.0;
  const baselineChatFte = workload.chatActive && effectiveChatHoursPerAgent > 0
    ? Math.ceil((baselineChatHours / effectiveChatHoursPerAgent) * 10) / 10
    : 0;

  // 4. BACKOFFICE & EMAIL TICKETING
  const rawTickets = workload.backofficeActive ? workload.backofficeMonthlyTickets : 0;
  const totalBackofficeHours = (rawTickets * workload.backofficeMinutesPerTicket) / 60.0;
  const effectiveBackofficeHoursPerAgent = monthlyEffectiveHours * (1.0 - shrinkage);

  const backofficeFte = workload.backofficeActive && effectiveBackofficeHoursPerAgent > 0
    ? Math.ceil((totalBackofficeHours / effectiveBackofficeHoursPerAgent) * 10) / 10
    : 0;

  const baselineBackofficeFte = backofficeFte;

  // TOTALES
  const totalDirectAgentsFte = Math.round((voiceInboundFte + voiceOutboundFte + chatFte + backofficeFte) * 10) / 10;
  const baselineDirectAgentsFte = Math.round(
    (baselineVoiceFte + baselineOutboundFte + baselineChatFte + baselineBackofficeFte) * 10
  ) / 10;

  const fteSavedByAi = Math.max(0, Math.round((baselineDirectAgentsFte - totalDirectAgentsFte) * 10) / 10);
  const pctFteSaved = baselineDirectAgentsFte > 0
    ? Math.round((fteSavedByAi / baselineDirectAgentsFte) * 1000) / 10
    : 0;

  const totalInitialInteractions = rawVoiceCalls + rawOutboundContacts + rawChats + rawTickets;
  const totalDeflectedInteractions = deflectedVoiceCalls + deflectedChats;
  const totalHumanInteractions = totalInitialInteractions - totalDeflectedInteractions;

  return {
    totalInitialInteractions,
    totalDeflectedInteractions,
    totalHumanInteractions,
    effectiveVoiceCalls,
    effectiveVoiceAhtSec,
    effectiveChats,
    voiceInboundFte,
    voiceOutboundFte,
    chatFte,
    backofficeFte,
    totalDirectAgentsFte,
    baselineDirectAgentsFte,
    fteSavedByAi,
    pctFteSaved,
    voiceErlangs: erlangResult.erlangs,
    voicePeakAgents: erlangResult.rawAgentsPeak,
    voiceSlaAchievedPct: erlangResult.serviceLevelPct,
  };
};
