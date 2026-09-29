/**
 * Motor Erlang-C numéricamente estable para Contact Centers.
 * Utiliza la relación recursiva con Erlang-B para evitar desbordamiento factorial.
 */

export interface ErlangResult {
  erlangs: number;
  rawAgentsPeak: number;
  occupancy: number;
  serviceLevelPct: number;
  waitingProbabilityPct: number;
  averageSpeedOfAnswerSec: number;
}

/**
 * Calcula Erlang-B de forma recursiva y estable:
 * B(0, A) = 1
 * B(k, A) = (A * B(k-1, A)) / (k + A * B(k-1, A))
 */
export const calculateErlangB = (servers: number, traffic: number): number => {
  if (servers <= 0 || traffic <= 0) return 1.0;

  // Calculamos recursivamente mediante reducción de array inmutable
  return Array.from({ length: servers }, (_, i) => i + 1).reduce(
    (bPrev, k) => (traffic * bPrev) / (k + traffic * bPrev),
    1.0
  );
};

/**
 * Calcula Erlang-C a partir de Erlang-B:
 * C(m, A) = (m * B(m, A)) / (m - A * (1 - B(m, A)))
 */
export const calculateErlangC = (servers: number, traffic: number): number => {
  if (servers <= traffic) return 1.0;

  const b = calculateErlangB(servers, traffic);
  const denominator = servers - traffic * (1.0 - b);

  if (denominator <= 0) return 1.0;
  const c = (servers * b) / denominator;
  return Math.min(Math.max(c, 0.0), 1.0);
};

/**
 * Calcula el Nivel de Servicio (SLA) para un número dado de agentes:
 * SLA = 1 - C(m, A) * e^(-(m - A) * (targetTimeSec / ahtSec))
 */
export const calculateSla = (
  servers: number,
  traffic: number,
  ahtSec: number,
  targetTimeSec: number
): number => {
  if (servers <= traffic) return 0.0;
  if (ahtSec <= 0) return 1.0;

  const erlangC = calculateErlangC(servers, traffic);
  const exponent = -1.0 * (servers - traffic) * (targetTimeSec / ahtSec);
  const sla = 1.0 - erlangC * Math.exp(exponent);

  return Math.min(Math.max(sla, 0.0), 1.0);
};

/**
 * Encuentra el número mínimo de agentes necesarios en hora punta para cumplir SLA y Ocupación.
 */
export const solveAgentsForSla = (
  callsInPeakHour: number,
  ahtSec: number,
  targetSlaPct: number, // ej: 80 para 80%
  targetTimeSec: number, // ej: 20 segundos
  maxOccupancyPct: number = 85 // ej: 85%
): ErlangResult => {
  if (callsInPeakHour <= 0 || ahtSec <= 0) {
    return {
      erlangs: 0,
      rawAgentsPeak: 0,
      occupancy: 0,
      serviceLevelPct: 100,
      waitingProbabilityPct: 0,
      averageSpeedOfAnswerSec: 0,
    };
  }

  const traffic = (callsInPeakHour * ahtSec) / 3600.0;
  const minAgentsForTraffic = Math.floor(traffic) + 1;
  const minAgentsForOccupancy = Math.ceil(traffic / (maxOccupancyPct / 100.0));
  const startAgents = Math.max(minAgentsForTraffic, minAgentsForOccupancy);

  const targetSlaDecimal = targetSlaPct / 100.0;
  const maxSearchRange = 500;

  // Búsqueda del primer número de agentes que satisfaga el SLA
  const searchRange = Array.from({ length: maxSearchRange }, (_, idx) => startAgents + idx);
  const foundAgents = searchRange.find((agents) => {
    const sla = calculateSla(agents, traffic, ahtSec, targetTimeSec);
    return sla >= targetSlaDecimal;
  });

  const optimalAgents = foundAgents ?? startAgents + maxSearchRange;
  const finalErlangC = calculateErlangC(optimalAgents, traffic);
  const finalSla = calculateSla(optimalAgents, traffic, ahtSec, targetTimeSec);
  const occupancy = traffic / optimalAgents;

  // Tiempo Medio de Espera (ASA - Average Speed of Answer)
  // ASA = (C * AHT) / (m - A)
  const asaSec = optimalAgents > traffic ? (finalErlangC * ahtSec) / (optimalAgents - traffic) : 0;

  return {
    erlangs: Math.round(traffic * 100) / 100,
    rawAgentsPeak: optimalAgents,
    occupancy: Math.round(occupancy * 1000) / 10,
    serviceLevelPct: Math.round(finalSla * 1000) / 10,
    waitingProbabilityPct: Math.round(finalErlangC * 1000) / 10,
    averageSpeedOfAnswerSec: Math.round(asaSec * 10) / 10,
  };
};

/**
 * Aplica el factor de Shrinkage (absentismo, descansos, formación, vacaciones)
 * para obtener los FTEs reales a contratar.
 * FTE = Agentes_Pico / (1 - Shrinkage)
 */
export const applyShrinkageToFte = (rawAgents: number, shrinkagePct: number): number => {
  if (rawAgents <= 0) return 0;
  const effectiveShrinkage = Math.min(Math.max(shrinkagePct, 0.05), 0.60);
  const totalFte = rawAgents / (1.0 - effectiveShrinkage);
  return Math.ceil(totalFte * 10) / 10;
};
