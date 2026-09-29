import { FinancialConfig, AutomationConfig, CalculationBreakdown } from '../types/campaign';
import { WorkloadEngineResult } from './workloadEngine';
import { getCountryById } from '../data/countries';

export const calculateFinancials = (
  workloadResult: WorkloadEngineResult,
  financial: FinancialConfig,
  automation: AutomationConfig
): CalculationBreakdown => {
  const onshoreCountry = getCountryById(financial.deliveryCountryId);
  const nearshoreCountry = getCountryById(financial.nearshoreCountryId);

  // Mezcla onshore / nearshore
  const nearshoreRatio = (financial.nearshoreSharePct || 0) / 100.0;
  const onshoreRatio = 1.0 - nearshoreRatio;

  const blendedLaborRate =
    onshoreCountry.loadedLaborCostPerMonthEur * onshoreRatio +
    nearshoreCountry.loadedLaborCostPerMonthEur * nearshoreRatio;

  const blendedFacilitiesRate =
    onshoreCountry.facilitiesPerFteEur * onshoreRatio +
    nearshoreCountry.facilitiesPerFteEur * nearshoreRatio;

  const blendedEffectiveHours =
    onshoreCountry.monthlyEffectiveHours * onshoreRatio +
    nearshoreCountry.monthlyEffectiveHours * nearshoreRatio;

  // Personal indirecto
  const directFte = workloadResult.totalDirectAgentsFte;
  const supervisorsFte = directFte > 0 ? Math.ceil(directFte / financial.supervisorRatio) : 0;
  const qaFte = directFte > 0 ? Math.ceil(directFte / financial.qaRatio) : 0;
  const wfmFte = directFte > 0 ? Math.ceil(directFte / financial.wfmRatio) : 0;
  const totalTeamHeadcount = directFte + supervisorsFte + qaFte + wfmFte;

  // Factor de coste salarial para perfiles de soporte
  const supervisorRate = blendedLaborRate * 1.25;
  const qaRate = blendedLaborRate * 1.15;
  const wfmRate = blendedLaborRate * 1.30;

  // Desglose de costes
  const directLaborCost = Math.round(directFte * blendedLaborRate);
  const supervisoryCost = Math.round(
    supervisorsFte * supervisorRate + qaFte * qaRate + wfmFte * wfmRate
  );
  const facilitiesCost = Math.round(totalTeamHeadcount * blendedFacilitiesRate);
  const ccaasTechCost = Math.round(totalTeamHeadcount * financial.ccaasLicensePerAgentEur);

  // Costes de tecnología de IA y Bots
  const aiBotCost = Math.round(
    workloadResult.totalDeflectedInteractions * automation.chatbotCostPerChat +
    directFte * automation.copilotCostPerAgentMonth
  );

  const totalDirectCost =
    directLaborCost + supervisoryCost + facilitiesCost + ccaasTechCost + aiBotCost;

  // Cálculo de ingresos basados en el margen objetivo (Guardrails)
  const targetMarginDecimal = Math.min(Math.max(financial.targetGrossMarginPct / 100.0, 0.05), 0.50);
  const monthlyRevenue = totalDirectCost > 0 ? Math.round(totalDirectCost / (1.0 - targetMarginDecimal)) : 0;
  const grossMarginAmount = monthlyRevenue - totalDirectCost;
  const grossMarginPct = monthlyRevenue > 0 ? Math.round((grossMarginAmount / monthlyRevenue) * 1000) / 10 : 0;
  const ebitdaPct = Math.max(0, Math.round((grossMarginPct - 6.5) * 10) / 10);

  // Tarifas unitarias comerciales
  const pricePerFteMonthEur = directFte > 0 ? Math.round(monthlyRevenue / directFte) : 0;
  const totalBillableHours = directFte * blendedEffectiveHours;
  const pricePerHourEur = totalBillableHours > 0 ? Math.round((monthlyRevenue / totalBillableHours) * 100) / 100 : 0;

  const totalInteractions = workloadResult.totalHumanInteractions > 0 ? workloadResult.totalHumanInteractions : 1;
  const pricePerVoiceCallEur = Math.round((pricePerHourEur * (workloadResult.effectiveVoiceAhtSec / 3600.0)) * 100) / 100;
  const pricePerChatEur = Math.round((monthlyRevenue * 0.35 / totalInteractions) * 100) / 100;

  // Semáforo de salud financiera
  const marginStatus: 'healthy' | 'warning' | 'critical' =
    grossMarginPct >= 18.0 ? 'healthy' : grossMarginPct >= 12.0 ? 'warning' : 'critical';

  return {
    totalInitialInteractions: workloadResult.totalInitialInteractions,
    totalDeflectedInteractions: workloadResult.totalDeflectedInteractions,
    totalHumanInteractions: workloadResult.totalHumanInteractions,
    effectiveVoiceCalls: workloadResult.effectiveVoiceCalls,
    effectiveVoiceAhtSec: workloadResult.effectiveVoiceAhtSec,
    effectiveChats: workloadResult.effectiveChats,
    voiceInboundFte: workloadResult.voiceInboundFte,
    voiceOutboundFte: workloadResult.voiceOutboundFte,
    chatFte: workloadResult.chatFte,
    backofficeFte: workloadResult.backofficeFte,
    totalDirectAgentsFte: directFte,
    supervisorsFte,
    qaFte,
    wfmFte,
    totalTeamHeadcount,
    baselineDirectAgentsFte: workloadResult.baselineDirectAgentsFte,
    fteSavedByAi: workloadResult.fteSavedByAi,
    directLaborCost,
    supervisoryCost,
    facilitiesCost,
    ccaasTechCost,
    aiBotCost,
    totalDirectCost,
    monthlyRevenue,
    grossMarginAmount,
    grossMarginPct,
    ebitdaPct,
    pricePerFteMonthEur,
    pricePerHourEur,
    pricePerVoiceCallEur,
    pricePerChatEur,
    marginStatus,
  };
};
