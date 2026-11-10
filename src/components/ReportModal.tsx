import React from 'react';
import {
  ElectricityData,
  FinancialAnalysisData,
  LocationData,
  PanelConfigData,
  PredictionResult,
  RecommendationData,
  RooftopAssessmentData,
  SolarRadiationData
} from '../types/solar';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  TreeDeciduous,
  Sun,
  IndianRupee,
  Building
} from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationData;
  rooftop: RooftopAssessmentData;
  electricity: ElectricityData;
  panelConfig: PanelConfigData;
  radiation: SolarRadiationData;
  prediction: PredictionResult;
  financial: FinancialAnalysisData;
  recommendation: RecommendationData;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  location,
  rooftop,
  electricity,
  panelConfig,
  radiation,
  prediction,
  financial,
  recommendation
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight">SolarVision Certified Feasibility Report</span>
            <span className="text-xs text-slate-400">· Ready for Print or PDF Export</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 md:p-12 text-slate-900 space-y-8 bg-white" id="printable-solar-report">
          {/* Document Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Sun className="w-4 h-4" />
                </div>
                SolarVision
              </div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                Rooftop Solar Potential & Techno-Financial Decision Report
              </div>
            </div>

            <div className="text-left md:text-right text-xs space-y-0.5 text-slate-500 font-mono">
              <div>Dossier ID: SV-{Math.floor(100000 + Math.random() * 900000)}</div>
              <div>Issue Date: {reportDate}</div>
              <div className="text-emerald-700 font-bold">Standard Edition v2.4</div>
            </div>
          </div>

          {/* Section 1: Executive Verdict */}
          <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Official Engineering & Financial Verdict
              </span>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                Feasibility Score: {recommendation.suitabilityScore} / 100
              </span>
            </div>
            <div className="text-lg font-bold text-emerald-900">
              {recommendation.headline}
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {recommendation.summary}
            </p>
          </div>

          {/* Section 2: Property & Solar Resource Baseline */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-slate-500 font-medium">Property Location</div>
              <div className="font-semibold text-slate-900 mt-1">{location.locality}, {location.city}</div>
              <div className="font-mono text-slate-500 text-[11px]">
                {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-slate-500 font-medium">Solar Resource (GHI)</div>
              <div className="font-mono font-bold text-slate-900 mt-1">
                {radiation.annualDailyAverageGHI} kWh/m²/day
              </div>
              <div className="text-[11px] text-slate-500">{radiation.dataSourceName}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-slate-500 font-medium">Usable Roof Area</div>
              <div className="font-mono font-bold text-slate-900 mt-1">
                {rooftop.usableAreaSqFt.toLocaleString()} sq ft
              </div>
              <div className="text-[11px] text-slate-500">
                {rooftop.roofType.replace('_', ' ')} · {rooftop.orientation}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-slate-500 font-medium">Proposed System</div>
              <div className="font-mono font-bold text-emerald-700 mt-1">
                {panelConfig.systemCapacityKW} kWp DC
              </div>
              <div className="text-[11px] text-slate-500">
                {panelConfig.numberOfPanels} × {panelConfig.panelWattage}W Mono PERC
              </div>
            </div>
          </div>

          {/* Section 3: Financial Summary Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-900 text-white p-3 font-bold text-xs uppercase tracking-wider">
              Financial Analysis & Subsidy Summary (INR)
            </div>
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-slate-50">
                  <td className="py-2.5 px-4 font-medium text-slate-700">Gross Turnkey Installation (EPC)</td>
                  <td className="py-2.5 px-4 text-right font-mono font-semibold text-slate-900">
                    ₹{financial.grossInstallationCost.toLocaleString()}
                  </td>
                </tr>
                {financial.governmentSubsidy > 0 && (
                  <tr className="bg-emerald-50/50 text-emerald-900 font-medium">
                    <td className="py-2.5 px-4">PM Surya Ghar Central Subsidy (DBT Grant)</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-700">
                      - ₹{financial.governmentSubsidy.toLocaleString()}
                    </td>
                  </tr>
                )}
                <tr className="bg-white font-bold">
                  <td className="py-2.5 px-4 text-slate-900">Net Consumer Capital Outlay</td>
                  <td className="py-2.5 px-4 text-right font-mono text-emerald-800 text-sm">
                    ₹{financial.netInvestmentCost.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-slate-700">Annual Electricity Savings (Year 1)</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-700">
                    ₹{financial.annualSavings.toLocaleString()} / year
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-slate-700">Estimated Payback Period</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                    {financial.paybackPeriodYears} Years
                  </td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-2.5 px-4 font-medium text-slate-900">25-Year Cumulative Net Profit</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-700">
                    ₹{financial.lifetimeSavings25Years.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Machine Learning Generation Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900">Energy Forecast (ML Random Forest)</div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Daily Average Generation:</span>
                <span className="font-mono font-bold text-slate-900">{prediction.dailyAverageKWh} kWh</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Monthly Average Generation:</span>
                <span className="font-mono font-bold text-slate-900">{prediction.monthlyAverageKWh} kWh</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Annual Total Generation:</span>
                <span className="font-mono font-bold text-emerald-700">{prediction.annualTotalKWh.toLocaleString()} kWh</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900">Environmental & Carbon Impact</div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Annual CO₂ Emissions Avoided:</span>
                <span className="font-mono font-bold text-emerald-700">{prediction.co2SavedTonnesPerYear} Tonnes</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Equivalent Forest Absorption:</span>
                <span className="font-mono font-bold text-emerald-700">{prediction.equivalentTreesPlanted} Trees</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                * Based on India Central Electricity Authority (CEA) grid factor of 0.82 kg CO₂/kWh.
              </div>
            </div>
          </div>

          {/* Signoff & Regulatory Note */}
          <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500 space-y-2">
            <div>
              <strong>Methodology & Compliance:</strong> Calculations strictly adhere to MNRE Technical Specifications, National Solar Mission standards, and the PM Surya Ghar: Muft Bijli Yojana Central Financial Assistance guidelines. Irradiance modeling verified via NASA POWER satellite archives.
            </div>
            <div className="flex justify-between items-center pt-4">
              <span>Prepared automatically by <strong>SolarVision Analytics Engine</strong></span>
              <span>Authorized Signature: __________________________</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
