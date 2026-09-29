import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  OmnichannelWorkload,
  AutomationConfig,
  FinancialConfig,
  CalculationBreakdown,
  ScenarioComparison,
} from '../types/campaign';
import { getSectorById } from '../data/sectors';
import { getCountryById } from '../data/countries';
import { calculateOmnichannelWorkload } from '../engines/workloadEngine';
import { calculateFinancials } from '../engines/financialEngine';
import { generateScenarios } from '../engines/scenarioEngine';

interface CampaignContextType {
  clientName: string;
  campaignName: string;
  sectorId: string;
  isClientPresentationMode: boolean;
  currentStep: number;
  workload: OmnichannelWorkload;
  automation: AutomationConfig;
  financial: FinancialConfig;
  calculation: CalculationBreakdown;
  scenarios: ScenarioComparison[];
  setClientName: (name: string) => void;
  setCampaignName: (name: string) => void;
  setSectorId: (id: string) => void;
  setIsClientPresentationMode: (active: boolean) => void;
  setCurrentStep: (step: number) => void;
  updateWorkload: (patch: Partial<OmnichannelWorkload>) => void;
  updateAutomation: (patch: Partial<AutomationConfig>) => void;
  updateFinancial: (patch: Partial<FinancialConfig>) => void;
  applyScenario: (scenarioId: string) => void;
  resetDefaults: () => void;
}

const DEFAULT_WORKLOAD: OmnichannelWorkload = {
  voiceInboundActive: true,
  voiceMonthlyCalls: 120000,
  voiceAhtSec: 320,
  voiceSlaSec: 20,
  voiceSlaTargetPct: 85,
  voicePeakHourCallsPct: 9.0,
  voiceOccupancyTarget: 85,

  voiceOutboundActive: false,
  voiceOutboundContacts: 25000,
  voiceOutboundConnectRatePct: 45,
  voiceOutboundAhtSec: 180,

  chatActive: true,
  chatMonthlyConversations: 45000,
  chatAhtSec: 420,
  chatConcurrency: 2.2,

  backofficeActive: false,
  backofficeMonthlyTickets: 10000,
  backofficeMinutesPerTicket: 12,
};

const DEFAULT_AUTOMATION: AutomationConfig = {
  voicebotDeflectionPct: 30,
  chatbotDeflectionPct: 40,
  copilotAhtReductionPct: 20,
  voicebotCostPerCall: 0.12,
  chatbotCostPerChat: 0.08,
  copilotCostPerAgentMonth: 45,
};

const DEFAULT_FINANCIAL: FinancialConfig = {
  deliveryCountryId: 'es',
  nearshoreCountryId: 'co',
  nearshoreSharePct: 0,
  operatingWindow: '12x6',
  pricingModel: 'per_hour',
  targetGrossMarginPct: 22,
  ccaasLicensePerAgentEur: 110,
  supervisorRatio: 15,
  qaRatio: 35,
  wfmRatio: 60,
};

const CampaignContext = createContext<CampaignContextType | null>(null);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientName, setClientName] = useState('Banco Santander');
  const [campaignName, setCampaignName] = useState('Atención al Cliente & Retención Omnicanal');
  const [sectorId, setSectorIdState] = useState('banking');
  const [isClientPresentationMode, setIsClientPresentationMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [workload, setWorkload] = useState<OmnichannelWorkload>(DEFAULT_WORKLOAD);
  const [automation, setAutomation] = useState<AutomationConfig>(DEFAULT_AUTOMATION);
  const [financial, setFinancial] = useState<FinancialConfig>(DEFAULT_FINANCIAL);

  const setSectorId = (newSectorId: string) => {
    setSectorIdState(newSectorId);
    const sector = getSectorById(newSectorId);
    setWorkload((prev) => ({
      ...prev,
      voiceAhtSec: sector.defaultAhtVoiceSec,
      voiceSlaSec: sector.defaultSlaSeconds,
      voiceSlaTargetPct: sector.defaultSlaPct,
      chatAhtSec: sector.defaultChatAhtSec,
      chatConcurrency: sector.defaultChatConcurrency,
    }));
    setAutomation((prev) => ({
      ...prev,
      voicebotDeflectionPct: Math.min(60, sector.recommendedDeflection - 5),
      chatbotDeflectionPct: sector.recommendedDeflection,
    }));
  };

  const updateWorkload = (patch: Partial<OmnichannelWorkload>) => {
    setWorkload((prev) => ({ ...prev, ...patch }));
  };

  const updateAutomation = (patch: Partial<AutomationConfig>) => {
    setAutomation((prev) => ({ ...prev, ...patch }));
  };

  const updateFinancial = (patch: Partial<FinancialConfig>) => {
    setFinancial((prev) => ({ ...prev, ...patch }));
  };

  const resetDefaults = () => {
    setWorkload(DEFAULT_WORKLOAD);
    setAutomation(DEFAULT_AUTOMATION);
    setFinancial(DEFAULT_FINANCIAL);
  };

  const applyScenario = (scenarioId: string) => {
    if (scenarioId === 'scenario_traditional') {
      setAutomation({
        ...automation,
        voicebotDeflectionPct: 0,
        chatbotDeflectionPct: 0,
        copilotAhtReductionPct: 0,
      });
      setFinancial((prev) => ({ ...prev, nearshoreSharePct: 0 }));
    } else if (scenarioId === 'scenario_hybrid') {
      const sector = getSectorById(sectorId);
      setAutomation({
        ...automation,
        voicebotDeflectionPct: sector.recommendedDeflection - 5,
        chatbotDeflectionPct: sector.recommendedDeflection,
        copilotAhtReductionPct: 20,
      });
      setFinancial((prev) => ({ ...prev, nearshoreSharePct: 0 }));
    } else if (scenarioId === 'scenario_nearshore') {
      const sector = getSectorById(sectorId);
      setAutomation({
        ...automation,
        voicebotDeflectionPct: sector.recommendedDeflection - 5,
        chatbotDeflectionPct: sector.recommendedDeflection,
        copilotAhtReductionPct: 20,
      });
      setFinancial((prev) => ({
        ...prev,
        nearshoreCountryId: 'co',
        nearshoreSharePct: 60,
      }));
    }
  };

  // Cálculos instantáneos memorizados (<5ms)
  const calculation = useMemo(() => {
    const currentCountry = getCountryById(financial.deliveryCountryId);
    const workloadResult = calculateOmnichannelWorkload(workload, automation, currentCountry);
    return calculateFinancials(workloadResult, financial, automation);
  }, [workload, automation, financial]);

  const scenarios = useMemo(() => {
    return generateScenarios(workload, automation, financial);
  }, [workload, automation, financial]);

  const value = {
    clientName,
    campaignName,
    sectorId,
    isClientPresentationMode,
    currentStep,
    workload,
    automation,
    financial,
    calculation,
    scenarios,
    setClientName,
    setCampaignName,
    setSectorId,
    setIsClientPresentationMode,
    setCurrentStep,
    updateWorkload,
    updateAutomation,
    updateFinancial,
    applyScenario,
    resetDefaults,
  };

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
};

export const useCampaign = (): CampaignContextType => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
