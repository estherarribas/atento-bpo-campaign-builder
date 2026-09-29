export type DeliveryModel = 'onshore' | 'nearshore' | 'blended';

export type OperatingWindow = '8x5' | '12x6' | '16x7' | '24x7';

export type PricingModel = 'per_fte' | 'per_hour' | 'per_interaction' | 'hybrid';

export interface CountryConfig {
  id: string;
  name: string;
  code: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  exchangeRateToEur: number; // 1 EUR = X local currency
  baseSalaryMonth: number; // in local currency
  socialSecurityPct: number; // e.g. 0.33 for 33%
  loadedLaborCostPerMonthEur: number;
  facilitiesPerFteEur: number;
  defaultShrinkage: number; // e.g. 0.30 (30%)
  monthlyEffectiveHours: number; // e.g. 140-150 hrs
  nearshoreEligible: boolean;
}

export interface SectorTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultAhtVoiceSec: number;
  defaultSlaSeconds: number;
  defaultSlaPct: number;
  defaultChatAhtSec: number;
  defaultChatConcurrency: number;
  defaultShrinkage: number;
  recommendedDeflection: number;
}

export interface OmnichannelWorkload {
  // Voice Inbound
  voiceInboundActive: boolean;
  voiceMonthlyCalls: number;
  voiceAhtSec: number;
  voiceSlaSec: number;
  voiceSlaTargetPct: number;
  voicePeakHourCallsPct: number;
  voiceOccupancyTarget: number;

  // Voice Outbound
  voiceOutboundActive: boolean;
  voiceOutboundContacts: number;
  voiceOutboundConnectRatePct: number;
  voiceOutboundAhtSec: number;

  // WhatsApp & Digital Webchat
  chatActive: boolean;
  chatMonthlyConversations: number;
  chatAhtSec: number;
  chatConcurrency: number; // e.g. 2.5 concurrent chats per agent

  // Email / Backoffice Ticketing
  backofficeActive: boolean;
  backofficeMonthlyTickets: number;
  backofficeMinutesPerTicket: number;
}

export interface AutomationConfig {
  voicebotDeflectionPct: number; // 0 - 60%
  chatbotDeflectionPct: number; // 0 - 75%
  copilotAhtReductionPct: number; // 0 - 35%
  voicebotCostPerCall: number; // EUR
  chatbotCostPerChat: number; // EUR
  copilotCostPerAgentMonth: number; // EUR
}

export interface FinancialConfig {
  deliveryCountryId: string;
  nearshoreCountryId: string;
  nearshoreSharePct: number; // 0 - 100%
  operatingWindow: OperatingWindow;
  pricingModel: PricingModel;
  targetGrossMarginPct: number; // e.g. 22%
  ccaasLicensePerAgentEur: number;
  supervisorRatio: number; // e.g. 15 agents per 1 supervisor
  qaRatio: number; // e.g. 35 agents per 1 QA
  wfmRatio: number; // e.g. 60 agents per 1 WFM
}

export interface CalculationBreakdown {
  // Volume & Deflection
  totalInitialInteractions: number;
  totalDeflectedInteractions: number;
  totalHumanInteractions: number;
  effectiveVoiceCalls: number;
  effectiveVoiceAhtSec: number;
  effectiveChats: number;

  // Headcount (FTEs)
  voiceInboundFte: number;
  voiceOutboundFte: number;
  chatFte: number;
  backofficeFte: number;
  totalDirectAgentsFte: number;
  supervisorsFte: number;
  qaFte: number;
  wfmFte: number;
  totalTeamHeadcount: number;

  // Baseline comparison (without AI)
  baselineDirectAgentsFte: number;
  fteSavedByAi: number;

  // Cost structure (Monthly in EUR)
  directLaborCost: number;
  supervisoryCost: number;
  facilitiesCost: number;
  ccaasTechCost: number;
  aiBotCost: number;
  totalDirectCost: number;

  // Revenue & Margins (Monthly in EUR)
  monthlyRevenue: number;
  grossMarginAmount: number;
  grossMarginPct: number;
  ebitdaPct: number;

  // Pricing Unit Outputs
  pricePerFteMonthEur: number;
  pricePerHourEur: number;
  pricePerVoiceCallEur: number;
  pricePerChatEur: number;

  // Financial Health Status
  marginStatus: 'healthy' | 'warning' | 'critical';
}

export interface ScenarioComparison {
  id: string;
  title: string;
  tag: string;
  description: string;
  country: string;
  deflectionPct: number;
  totalFte: number;
  monthlyRevenue: number;
  pricePerHour: number;
  grossMarginPct: number;
  savingsVsBaselinePct: number;
  isRecommended?: boolean;
}
