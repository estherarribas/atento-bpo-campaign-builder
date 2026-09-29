import { solveAgentsForSla, applyShrinkageToFte } from '../engines/erlangEngine.ts';
import { calculateOmnichannelWorkload } from '../engines/workloadEngine.ts';
import { calculateFinancials } from '../engines/financialEngine.ts';
import { generateScenarios } from '../engines/scenarioEngine.ts';
import { getCountryById } from '../data/countries.ts';
import { OmnichannelWorkload, AutomationConfig, FinancialConfig } from '../types/campaign.ts';

const runTests = () => {
  console.log('=== INICIANDO VALIDACIÓN DE MOTORES DE CÁLCULO ATENTO BPO ===\n');

  // Test 1: Erlang-C
  console.log('Test 1: Erlang-C Engine Stability & SLA');
  const erlangRes = solveAgentsForSla(500, 300, 80, 20, 85);
  console.log(`  Llamadas pico: 500, AHT: 300s -> Tráfico: ${erlangRes.erlangs} Erlangs`);
  console.log(`  Agentes requeridos pico: ${erlangRes.rawAgentsPeak}`);
  console.log(`  SLA alcanzado: ${erlangRes.serviceLevelPct}% (objetivo 80%)`);
  console.log(`  Ocupación: ${erlangRes.occupancy}%`);
  console.log(`  ASA (Espera media): ${erlangRes.averageSpeedOfAnswerSec}s`);
  if (erlangRes.serviceLevelPct < 80) throw new Error('SLA no alcanzado en Erlang-C');
  if (erlangRes.rawAgentsPeak <= erlangRes.erlangs) throw new Error('Agentes deben ser mayores al tráfico Erlang');

  // Test 2: Shrinkage
  console.log('\nTest 2: Shrinkage Adjustment');
  const fteWithShrinkage = applyShrinkageToFte(erlangRes.rawAgentsPeak, 0.32);
  console.log(`  Agentes pico: ${erlangRes.rawAgentsPeak} + 32% shrinkage -> ${fteWithShrinkage} FTEs`);
  if (fteWithShrinkage <= erlangRes.rawAgentsPeak) throw new Error('FTEs con shrinkage deben ser mayores a agentes pico');

  // Test 3: Workload Engine Omnicanal + IA
  console.log('\nTest 3: Workload Engine (Voz + WhatsApp + IA Deflection)');
  const workload: OmnichannelWorkload = {
    voiceInboundActive: true,
    voiceMonthlyCalls: 100000,
    voiceAhtSec: 300,
    voiceSlaSec: 20,
    voiceSlaTargetPct: 80,
    voicePeakHourCallsPct: 9.0,
    voiceOccupancyTarget: 85,
    voiceOutboundActive: false,
    voiceOutboundContacts: 0,
    voiceOutboundConnectRatePct: 40,
    voiceOutboundAhtSec: 180,
    chatActive: true,
    chatMonthlyConversations: 50000,
    chatAhtSec: 360,
    chatConcurrency: 2.5,
    backofficeActive: false,
    backofficeMonthlyTickets: 0,
    backofficeMinutesPerTicket: 10,
  };

  const automation: AutomationConfig = {
    voicebotDeflectionPct: 30,
    chatbotDeflectionPct: 40,
    copilotAhtReductionPct: 20,
    voicebotCostPerCall: 0.12,
    chatbotCostPerChat: 0.08,
    copilotCostPerAgentMonth: 45,
  };

  const spain = getCountryById('es');
  const workloadRes = calculateOmnichannelWorkload(workload, automation, spain);
  console.log(`  Volumen inicial: ${workloadRes.totalInitialInteractions}`);
  console.log(`  Desviado a Bots de IA: ${workloadRes.totalDeflectedInteractions} (${Math.round((workloadRes.totalDeflectedInteractions / workloadRes.totalInitialInteractions) * 100)}%)`);
  console.log(`  Agentes requeridos con IA: ${workloadRes.totalDirectAgentsFte} FTEs`);
  console.log(`  Línea base sin IA: ${workloadRes.baselineDirectAgentsFte} FTEs`);
  console.log(`  Ahorro neto por IA: ${workloadRes.fteSavedByAi} FTEs (${workloadRes.pctFteSaved}%)`);
  if (workloadRes.fteSavedByAi <= 0) throw new Error('La capa de IA debe generar ahorro de FTEs');

  // Test 4: Financial Engine & Margins
  console.log('\nTest 4: Financial Engine & Pricing Guardrails');
  const financial: FinancialConfig = {
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

  const finRes = calculateFinancials(workloadRes, financial, automation);
  console.log(`  Coste directo total: €${finRes.totalDirectCost.toLocaleString()}`);
  console.log(`  Ingresos presupuestados (TCV): €${finRes.monthlyRevenue.toLocaleString()}`);
  console.log(`  Margen bruto: ${finRes.grossMarginPct}% (€${finRes.grossMarginAmount.toLocaleString()})`);
  console.log(`  Tarifa por hora: €${finRes.pricePerHourEur}/h`);
  console.log(`  Tarifa por FTE: €${finRes.pricePerFteMonthEur}/fte`);
  console.log(`  Semáforo margen: ${finRes.marginStatus}`);
  if (finRes.grossMarginPct < 21.5 || finRes.grossMarginPct > 22.5) {
    throw new Error(`Margen bruto inesperado: ${finRes.grossMarginPct}%`);
  }

  // Test 5: Scenarios What-If
  console.log('\nTest 5: Scenario Engine (Traditional vs Hybrid vs Nearshore)');
  const scenarios = generateScenarios(workload, automation, financial);
  scenarios.forEach((sc) => {
    console.log(`  [${sc.tag}] ${sc.title}: ${sc.totalFte} FTEs | TCV: €${sc.monthlyRevenue.toLocaleString()} | Tarifa: €${sc.pricePerHour}/h | Ahorro: ${sc.savingsVsBaselinePct}%`);
  });
  if (scenarios.length !== 3) throw new Error('Se esperaban 3 escenarios comparativos');
  if (scenarios[2].monthlyRevenue >= scenarios[0].monthlyRevenue) {
    throw new Error('El escenario Nearshore debe ser más económico que el Tradicional');
  }

  console.log('\n✅ ¡TODOS LOS TESTS DE VALIDACIÓN MATEMÁTICA Y FINANCIERA PASARON CON ÉXITO!');
};

runTests();
