export type BuildingType = 'residential' | 'commercial' | 'industrial' | 'institutional';
export type RoofType = 'flat_concrete' | 'sloped_tin' | 'sloped_tile' | 'rcc_terrace' | 'curved_shed';
export type RoofOrientation = 'south' | 'south_west' | 'west' | 'south_east' | 'east' | 'north';
export type ShadingLevel = 'none' | 'minimal' | 'partial' | 'heavy';
export type SystemType = 'on_grid' | 'off_grid' | 'hybrid';
export type PanelTechnology = 'mono_perc' | 'bifacial' | 'poly';

export interface LocationData {
  country: string;
  state: string;
  city: string;
  locality: string;
  address: string;
  latitude: number;
  longitude: number;
  elevationMeters?: number;
}

export interface RooftopAssessmentData {
  totalArea: number; // in sq ft
  areaUnit: 'sqft' | 'sqm';
  usableAreaPercentage: number; // 0 to 100
  usableAreaSqFt: number;
  buildingType: BuildingType;
  roofType: RoofType;
  orientation: RoofOrientation;
  tiltAngle: number; // degrees
  shadingCondition: ShadingLevel;
  numberOfFloors: number;
  hasObstructions: boolean;
  obstructionNotes: string;
}

export interface ElectricityData {
  averageMonthlyBill: number; // in INR
  monthlyUnitsKWh: number;
  tariffPerUnit: number; // in INR / kWh
  discomName: string;
  connectionType: 'residential' | 'commercial';
  seasonalVariation: {
    summerPeakPercent: number;
    monsoonDipPercent: number;
    winterPercent: number;
  };
}

export interface PanelConfigData {
  systemCapacityKW: number;
  panelWattage: number; // e.g., 540W
  panelEfficiency: number; // e.g., 21.2%
  technology: PanelTechnology;
  numberOfPanels: number;
  inverterCapacityKW: number;
  systemType: SystemType;
  batteryBackupKW?: number;
  batteryHours?: number;
}

export interface SolarRadiationData {
  annualDailyAverageGHI: number; // kWh/m²/day
  dni: number; // Direct Normal Irradiance
  dhi: number; // Diffuse Horizontal Irradiance
  averageTemperatureC: number;
  monthlyGHI: number[]; // 12 months in kWh/m²/day
  monthlyTemp: number[]; // 12 months in °C
  monthlyCloudCover: number[]; // 12 months in %
  dataSourceName: string;
  dataSourceUrl: string;
  isRealApiData: boolean;
  dataRetrievalDate: string;
  dataQualityNotes: string;
}

export interface MLModelEvaluation {
  modelName: string;
  mae: number; // Mean Absolute Error in kWh
  rmse: number; // Root Mean Square Error in kWh
  r2Score: number; // R-squared 0 to 1
  description: string;
  featuresUsed: string[];
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number; // 0 to 100%
  description: string;
}

export interface PredictionResult {
  dailyAverageKWh: number;
  monthlyAverageKWh: number;
  annualTotalKWh: number;
  monthlyBreakdownKWh: number[]; // 12 months
  hourlyGenerationCurve: { hour: number; generationWatts: number }[];
  co2SavedTonnesPerYear: number;
  equivalentTreesPlanted: number;
  modelEvaluations: MLModelEvaluation[];
  selectedModel: string;
  featureImportances: FeatureImportanceItem[];
  predictionConfidence: number; // percentage
}

export interface FinancialYearProjection {
  year: number;
  gridCostWithoutSolar: number;
  solarMaintenanceCost: number;
  solarGenerationKWh: number;
  electricitySavedINR: number;
  netCumulativeSavings: number;
}

export interface FinancialAnalysisData {
  grossInstallationCost: number;
  panelCost: number;
  inverterCost: number;
  bosAndStructureCost: number;
  installationAndNetMeterFee: number;
  batteryCost: number;
  governmentSubsidy: number; // PM Surya Ghar
  subsidyEligible: boolean;
  subsidySchemeName: string;
  netInvestmentCost: number;
  monthlyBillSavings: number;
  annualSavings: number;
  paybackPeriodYears: number;
  returnOnInvestment25YearsPercent: number;
  netPresentValue25Years: number;
  lifetimeSavings25Years: number;
  yearlyProjections: FinancialYearProjection[];
  assumptions: {
    annualDegradationPercent: number;
    annualTariffEscalationPercent: number;
    discountRatePercent: number;
    omCostPercentOfCapex: number;
    inverterReplacementYear: number;
  };
}

export type RecommendationStatus = 
  | 'STRONGLY_RECOMMENDED'
  | 'BENEFICIAL'
  | 'MORE_INFO_NEEDED'
  | 'NOT_RECOMMENDED';

export interface RecommendationData {
  status: RecommendationStatus;
  headline: string;
  summary: string;
  recommendedCapacityKW: number;
  suitabilityScore: number; // 0 to 100
  pros: string[];
  limitations: string[];
  actionItems: string[];
}

export interface SavedSolarProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  location: LocationData;
  rooftop: RooftopAssessmentData;
  electricity: ElectricityData;
  panelConfig: PanelConfigData;
  radiation: SolarRadiationData;
  prediction: PredictionResult;
  financial: FinancialAnalysisData;
  recommendation: RecommendationData;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'homeowner' | 'commercial_buyer' | 'installer' | 'admin';
  isGuest: boolean;
  savedProjects: SavedSolarProject[];
  createdAt: string;
}
