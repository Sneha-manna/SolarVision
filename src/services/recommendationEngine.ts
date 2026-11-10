import {
  ElectricityData,
  FinancialAnalysisData,
  PanelConfigData,
  PredictionResult,
  RecommendationData,
  RecommendationStatus,
  RooftopAssessmentData,
  SolarRadiationData
} from '../types/solar';

export function generateSolarRecommendation(
  rooftop: RooftopAssessmentData,
  electricity: ElectricityData,
  panelConfig: PanelConfigData,
  radiation: SolarRadiationData,
  prediction: PredictionResult,
  financial: FinancialAnalysisData
): RecommendationData {
  let score = 70; // baseline
  const pros: string[] = [];
  const limitations: string[] = [];
  const actionItems: string[] = [];

  // 1. Rooftop area check (~80-100 sq ft needed per kW)
  const requiredAreaSqFt = panelConfig.systemCapacityKW * 90;
  const areaRatio = rooftop.usableAreaSqFt / Math.max(1, requiredAreaSqFt);

  if (areaRatio >= 1.2) {
    score += 10;
    pros.push(`Generous rooftop space: ${rooftop.usableAreaSqFt.toLocaleString()} sq ft usable area comfortably accommodates ${panelConfig.systemCapacityKW} kWp system.`);
  } else if (areaRatio >= 0.95) {
    score += 5;
    pros.push(`Rooftop area is closely matched to the proposed ${panelConfig.systemCapacityKW} kW capacity.`);
  } else {
    score -= 20;
    limitations.push(`Rooftop area shortfall: Available usable area (${rooftop.usableAreaSqFt} sq ft) is below the recommended ${Math.round(requiredAreaSqFt)} sq ft for a ${panelConfig.systemCapacityKW} kW system.`);
    actionItems.push('Consider choosing higher-wattage bifacial panels (540W+) or slightly downsizing system capacity.');
  }

  // 2. Shading evaluation
  if (rooftop.shadingCondition === 'none') {
    score += 10;
    pros.push('Zero tree or parapet shading ensures maximum photonic yield throughout the day.');
  } else if (rooftop.shadingCondition === 'minimal') {
    score += 5;
    pros.push('Minimal morning/evening shading has negligible (<8%) impact on annual generation.');
  } else if (rooftop.shadingCondition === 'partial') {
    score -= 10;
    limitations.push('Partial shading from nearby structures reduces peak solar hours by ~15-20%.');
    actionItems.push('Install micro-inverters or DC power optimizers to prevent string-level mismatch losses.');
  } else {
    score -= 25;
    limitations.push('Heavy shadow obstruction severely compromises standard string inverter performance.');
    actionItems.push('Conduct an on-site solar pathfinder survey or trim overshadowing trees before proceeding.');
  }

  // 3. Solar Radiation Quality
  if (radiation.annualDailyAverageGHI >= 5.0) {
    score += 10;
    pros.push(`Exceptional regional solar resource: ${radiation.annualDailyAverageGHI} kWh/m²/day GHI ranking in India's top renewable energy zone.`);
  } else {
    score += 2;
    pros.push(`Adequate solar resource (${radiation.annualDailyAverageGHI} kWh/m²/day) for viable rooftop generation.`);
  }

  // 4. Financial Payback & Subsidy
  if (financial.paybackPeriodYears <= 4.0) {
    score += 15;
    pros.push(`Rapid capital recovery: Payback achieved in only ${financial.paybackPeriodYears} years with PM Surya Ghar subsidy.`);
  } else if (financial.paybackPeriodYears <= 6.5) {
    score += 8;
    pros.push(`Solid financial return with payback within ${financial.paybackPeriodYears} years.`);
  } else {
    score -= 10;
    limitations.push(`Payback duration (${financial.paybackPeriodYears} years) is higher due to battery storage or lower tariff.`);
  }

  if (financial.subsidyEligible && financial.governmentSubsidy > 0) {
    pros.push(`Eligible for ₹${financial.governmentSubsidy.toLocaleString()} direct government subsidy under PM Surya Ghar.`);
    actionItems.push('Submit application on the official PM Surya Ghar National Portal (pmsuryaghar.gov.in) before commissioning.');
  }

  // 5. Orientation and Tilt
  if (rooftop.orientation === 'south' && Math.abs(rooftop.tiltAngle - 26) <= 6) {
    pros.push('Ideal South-facing orientation with optimal ~26° tilt maximizes both summer and winter solar harvesting.');
  } else if (rooftop.orientation === 'north') {
    score -= 15;
    limitations.push('North-facing roof slopes receive ~25-30% lower direct solar beam irradiance.');
    actionItems.push('Use elevated South-tilted mounting frames rather than flush mounting.');
  }

  // Standard action items
  actionItems.push('Get a certified DISCOM net metering feasibility approval letter.');
  actionItems.push('Ensure structural load bearing test of roof slab (approx 15-20 kg/m² for ballast/strut).');

  // Final status classification
  let status: RecommendationStatus;
  let headline: string;
  let summary: string;

  if (score >= 80 && areaRatio >= 0.9 && financial.paybackPeriodYears <= 5.5) {
    status = 'STRONGLY_RECOMMENDED';
    headline = 'Solar Installation Strongly Recommended';
    summary = `Your property exhibits outstanding solar feasibility. With an estimated payback of ${financial.paybackPeriodYears} years, ₹${financial.annualSavings.toLocaleString()} annual electricity bill savings, and strong solar irradiance (${radiation.annualDailyAverageGHI} kWh/m²/day), installing a ${panelConfig.systemCapacityKW} kW solar system is an exceptionally viable investment.`;
  } else if (score >= 60 && areaRatio >= 0.75) {
    status = 'BENEFICIAL';
    headline = 'Solar Installation May Be Beneficial';
    summary = `Installing solar at this location is financially positive with an estimated payback of ${financial.paybackPeriodYears} years. A few site optimizations (such as mitigating shadow or adjusting panel layout) will maximize your energy yield.`;
  } else if (rooftop.totalArea === 0 || electricity.monthlyUnitsKWh === 0) {
    status = 'MORE_INFO_NEEDED';
    headline = 'More Property Details Required';
    summary = 'Please specify your exact usable rooftop dimensions and electricity bill history to calculate a verified feasibility verdict.';
  } else {
    status = 'NOT_RECOMMENDED';
    headline = 'Solar Installation Not Currently Recommended';
    summary = `Due to significant constraints (such as heavy shading, insufficient usable roof area, or extended payback exceeding 8 years), an immediate standard rooftop installation is not recommended without addressing shading obstructions and structural mounting adjustments.`;
  }

  // Recommend optimal capacity to offset ~90% of electricity bill
  const targetMonthlyKWh = electricity.monthlyUnitsKWh;
  const recommendedCapacityKW = Math.max(1, Number((targetMonthlyKWh / 125).toFixed(1))); // ~125 kWh per kW per month in Jaipur

  return {
    status,
    headline,
    summary,
    recommendedCapacityKW,
    suitabilityScore: Math.min(100, Math.max(20, score)),
    pros,
    limitations,
    actionItems
  };
}
