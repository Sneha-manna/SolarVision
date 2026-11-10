import {
  ElectricityData,
  FinancialAnalysisData,
  FinancialYearProjection,
  PanelConfigData,
  PredictionResult,
  RooftopAssessmentData
} from '../types/solar';

/**
 * Calculate complete solar installation economics, PM Surya Ghar subsidy,
 * 25-year ROI, and grid vs solar lifecycle comparisons.
 */
export function calculateSolarFinancials(
  panelConfig: PanelConfigData,
  electricity: ElectricityData,
  rooftop: RooftopAssessmentData,
  prediction: PredictionResult
): FinancialAnalysisData {
  const capacityKW = panelConfig.systemCapacityKW;
  const isResidential = rooftop.buildingType === 'residential';

  // Indian Solar Benchmark Costs per kW (₹)
  const panelCostPerKW = 24000;
  const inverterCostPerKW = 10000;
  const bosAndStructureCostPerKW = 7000;
  const installationAndNetMeterFeePerKW = 6000;

  const panelCost = Math.round(capacityKW * panelCostPerKW);
  const inverterCost = Math.round(capacityKW * inverterCostPerKW);
  const bosAndStructureCost = Math.round(capacityKW * bosAndStructureCostPerKW);
  const installationAndNetMeterFee = Math.round(capacityKW * installationAndNetMeterFeePerKW);

  // Battery storage cost (if hybrid or off-grid)
  let batteryCost = 0;
  if (panelConfig.systemType !== 'on_grid') {
    const batteryCapacityKWh = panelConfig.batteryBackupKW || Math.max(3, capacityKW * 1.5);
    batteryCost = Math.round(batteryCapacityKWh * 13500); // Lithium Ferro Phosphate (LFP) ~₹13,500/kWh
  }

  const grossInstallationCost = panelCost + inverterCost + bosAndStructureCost + installationAndNetMeterFee + batteryCost;

  // PM Surya Ghar: Muft Bijli Yojana Official Central Financial Assistance (CFA)
  // Up to 1 kW: ₹30,000
  // Up to 2 kW: ₹60,000
  // 3 kW & above: ₹78,000 max (for residential rooftop)
  let governmentSubsidy = 0;
  let subsidyEligible = false;
  let subsidySchemeName = 'PM Surya Ghar: Muft Bijli Yojana';

  if (isResidential && panelConfig.systemType !== 'off_grid') {
    subsidyEligible = true;
    if (capacityKW < 1) {
      governmentSubsidy = Math.round(capacityKW * 30000);
    } else if (capacityKW < 2) {
      governmentSubsidy = 30000 + Math.round((capacityKW - 1) * 30000);
    } else if (capacityKW < 3) {
      governmentSubsidy = 60000 + Math.round((capacityKW - 2) * 18000);
    } else {
      governmentSubsidy = 78000; // Capped at ₹78,000 as per official MNRE guidelines
    }
  } else if (!isResidential) {
    subsidySchemeName = 'Commercial 40% Accelerated Tax Depreciation (Section 32)';
    subsidyEligible = false; // No direct upfront consumer grant, but tax benefit
  }

  const netInvestmentCost = Math.max(10000, grossInstallationCost - governmentSubsidy);

  // Savings calculation:
  // Units generated vs consumed
  const annualSolarGenKWh = prediction.annualTotalKWh;
  const annualConsumptionKWh = electricity.monthlyUnitsKWh * 12;
  const effectiveTariff = electricity.tariffPerUnit > 0 ? electricity.tariffPerUnit : 7.2; // default ₹7.2/unit for Rajasthan

  // Net metering offset: solar units reduce grid bill at tariff rate
  // Any surplus fed back to grid at average APPC rate (~₹3.2/kWh) or credited
  const selfConsumedKWh = Math.min(annualSolarGenKWh, annualConsumptionKWh);
  const exportedKWh = Math.max(0, annualSolarGenKWh - annualConsumptionKWh);
  const feedInTariff = 3.25; // ₹ per kWh feed-in credit

  const annualSavings = Math.round((selfConsumedKWh * effectiveTariff) + (exportedKWh * feedInTariff));
  const monthlyBillSavings = Math.round(annualSavings / 12);

  // Payback period
  const paybackPeriodYears = Number((netInvestmentCost / Math.max(1, annualSavings)).toFixed(1));

  // 25-Year Projection Simulation
  const yearlyProjections: FinancialYearProjection[] = [];
  const annualDegradation = 0.005; // 0.5% degradation per year
  const annualTariffEscalation = 0.04; // 4% tariff hike per year
  const omRate = 0.01; // 1% of capex annual maintenance

  let cumulativeSavings = -netInvestmentCost;
  let totalLifetimeSavings = 0;

  for (let year = 1; year <= 25; year++) {
    // Current year tariff with compounding escalation
    const yearTariff = effectiveTariff * Math.pow(1 + annualTariffEscalation, year - 1);
    const gridCostWithoutSolar = Math.round(annualConsumptionKWh * yearTariff);

    // Degraded solar generation
    const degradationMultiplier = Math.pow(1 - annualDegradation, year - 1);
    const yearGenKWh = Math.round(annualSolarGenKWh * degradationMultiplier);

    // O&M cost
    let maintenanceCost = Math.round(grossInstallationCost * omRate);
    // Inverter replacement in Year 11
    if (year === 11) {
      maintenanceCost += Math.round(inverterCost * 0.85);
    }

    const yearSelfConsumed = Math.min(yearGenKWh, annualConsumptionKWh);
    const yearExported = Math.max(0, yearGenKWh - annualConsumptionKWh);
    const yearSavings = Math.round((yearSelfConsumed * yearTariff) + (yearExported * feedInTariff)) - maintenanceCost;

    cumulativeSavings += yearSavings;
    totalLifetimeSavings += yearSavings;

    yearlyProjections.push({
      year,
      gridCostWithoutSolar,
      solarMaintenanceCost: maintenanceCost,
      solarGenerationKWh: yearGenKWh,
      electricitySavedINR: yearSavings,
      netCumulativeSavings: cumulativeSavings
    });
  }

  // 25-Year Return on Investment (ROI %)
  const returnOnInvestment25YearsPercent = Math.round(((totalLifetimeSavings - netInvestmentCost) / netInvestmentCost) * 100);

  // Net Present Value at 8% discount rate
  const discountRate = 0.08;
  let npv = -netInvestmentCost;
  for (let i = 0; i < yearlyProjections.length; i++) {
    npv += yearlyProjections[i].electricitySavedINR / Math.pow(1 + discountRate, i + 1);
  }

  return {
    grossInstallationCost,
    panelCost,
    inverterCost,
    bosAndStructureCost,
    installationAndNetMeterFee,
    batteryCost,
    governmentSubsidy,
    subsidyEligible,
    subsidySchemeName,
    netInvestmentCost,
    monthlyBillSavings,
    annualSavings,
    paybackPeriodYears,
    returnOnInvestment25YearsPercent,
    netPresentValue25Years: Math.round(npv),
    lifetimeSavings25Years: Math.round(totalLifetimeSavings),
    yearlyProjections,
    assumptions: {
      annualDegradationPercent: 0.5,
      annualTariffEscalationPercent: 4.0,
      discountRatePercent: 8.0,
      omCostPercentOfCapex: 1.0,
      inverterReplacementYear: 11
    }
  };
}
