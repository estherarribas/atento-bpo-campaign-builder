import { OmnichannelWorkload, AutomationConfig, FinancialConfig, ScenarioComparison } from '../types/campaign';
import { calculateOmnichannelWorkload } from './workloadEngine';
import { calculateFinancials } from './financialEngine';
import { getCountryById } from '../data/countries';

export const generateScenarios = (
  workload: OmnichannelWorkload,
  automation: AutomationConfig,
  financial: FinancialConfig
): ScenarioComparison[] => {
  const currentCountry = getCountryById(financial.deliveryCountryId);

  // 1. Escenario A: 100% Humano Tradicional (Sin Bots, 100% Onshore)
  const noAutomation: AutomationConfig = {
    voicebotDeflectionPct: 0,
    chatbotDeflectionPct: 0,
    copilotAhtReductionPct: 0,
    voicebotCostPerCall: 0,
    chatbotCostPerChat: 0,
    copilotCostPerAgentMonth: 0,
  };
  const onshoreFinancial: FinancialConfig = {
    ...financial,
    nearshoreSharePct: 0,
  };
  const workloadA = calculateOmnichannelWorkload(workload, noAutomation, currentCountry);
  const finA = calculateFinancials(workloadA, onshoreFinancial, noAutomation);

  // 2. Escenario B: Híbrido IA Recomendado (Configuración Actual)
  const workloadB = calculateOmnichannelWorkload(workload, automation, currentCountry);
  const finB = calculateFinancials(workloadB, financial, automation);

  // 3. Escenario C: Nearshore Blended (60% Nearshore Colombia, IA activa)
  const nearshoreFinancial: FinancialConfig = {
    ...financial,
    nearshoreCountryId: 'co',
    nearshoreSharePct: 60,
  };
  const workloadC = calculateOmnichannelWorkload(workload, automation, currentCountry);
  const finC = calculateFinancials(workloadC, nearshoreFinancial, automation);

  const baselineCost = finA.monthlyRevenue > 0 ? finA.monthlyRevenue : 1;
  const savingsB = Math.max(0, Math.round(((baselineCost - finB.monthlyRevenue) / baselineCost) * 1000) / 10);
  const savingsC = Math.max(0, Math.round(((baselineCost - finC.monthlyRevenue) / baselineCost) * 1000) / 10);

  return [
    {
      id: 'scenario_traditional',
      title: 'Tradicional 100% Humano',
      tag: 'Línea Base',
      description: 'Atención presencial/telefónica íntegramente operada por agentes sin capa de automatización de IA.',
      country: currentCountry.name,
      deflectionPct: 0,
      totalFte: finA.totalTeamHeadcount,
      monthlyRevenue: finA.monthlyRevenue,
      pricePerHour: finA.pricePerHourEur,
      grossMarginPct: finA.grossMarginPct,
      savingsVsBaselinePct: 0,
      isRecommended: false,
    },
    {
      id: 'scenario_hybrid',
      title: 'Híbrido IA Omnicanal',
      tag: 'Recomendado',
      description: 'Contención de consultas frecuentes mediante Voicebots y Chatbots GenAI, asistiendo a agentes con Copilot.',
      country: currentCountry.name,
      deflectionPct: Math.round((automation.voicebotDeflectionPct + automation.chatbotDeflectionPct) / 2),
      totalFte: finB.totalTeamHeadcount,
      monthlyRevenue: finB.monthlyRevenue,
      pricePerHour: finB.pricePerHourEur,
      grossMarginPct: finB.grossMarginPct,
      savingsVsBaselinePct: savingsB,
      isRecommended: true,
    },
    {
      id: 'scenario_nearshore',
      title: 'Nearshore Blended Efficiency',
      tag: 'Máximo Ahorro',
      description: 'Modelo híbrido con IA y entrega distribuida: 40% Onshore + 60% Nearshore (Colombia) optimizando costes laborales.',
      country: `${currentCountry.code} (40%) + COL (60%)`,
      deflectionPct: Math.round((automation.voicebotDeflectionPct + automation.chatbotDeflectionPct) / 2),
      totalFte: finC.totalTeamHeadcount,
      monthlyRevenue: finC.monthlyRevenue,
      pricePerHour: finC.pricePerHourEur,
      grossMarginPct: finC.grossMarginPct,
      savingsVsBaselinePct: savingsC,
      isRecommended: false,
    },
  ];
};
