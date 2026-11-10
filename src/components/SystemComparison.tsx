import React from 'react';
import {
  ElectricityData,
  PanelConfigData,
  RooftopAssessmentData,
  SolarRadiationData
} from '../types/solar';
import {
  GitCompare,
  CheckCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface SystemComparisonProps {
  currentConfig: PanelConfigData;
  electricity: ElectricityData;
  rooftop: RooftopAssessmentData;
  radiation: SolarRadiationData;
  onSelectCapacity: (capacityKW: number) => void;
}

export const SystemComparison: React.FC<SystemComparisonProps> = ({
  currentConfig,
  electricity,
  rooftop,
  radiation,
  onSelectCapacity
}) => {
  const standardCapacities = [1, 2, 3, 5, 10];
  const tariff = electricity.tariffPerUnit > 0 ? electricity.tariffPerUnit : 7.2;
  const isResidential = rooftop.buildingType === 'residential';
  const ghi = radiation.annualDailyAverageGHI || 5.4;

  const comparisonRows = standardCapacities.map((kw) => {
    const panels = Math.ceil((kw * 1000) / 540);
    const areaRequired = panels * 22; // ~22 sq ft per module
    const grossCost = Math.round(kw * 47000); // ~₹47,000 / kW turnkey on-grid

    // Subsidy
    let subsidy = 0;
    if (isResidential) {
      if (kw === 1) subsidy = 30000;
      else if (kw === 2) subsidy = 60000;
      else subsidy = 78000;
    }

    const netCost = Math.max(5000, grossCost - subsidy);
    // Generation: in Jaipur ~4.2 kWh/kW/day average
    const dailyGen = Number((kw * (ghi * 0.78)).toFixed(1));
    const annualGen = Math.round(dailyGen * 365);
    const annualConsumption = electricity.monthlyUnitsKWh * 12;

    const selfConsumed = Math.min(annualGen, annualConsumption);
    const exported = Math.max(0, annualGen - annualConsumption);
    const annualSavings = Math.round((selfConsumed * tariff) + (exported * 3.25));
    const payback = Number((netCost / Math.max(1, annualSavings)).toFixed(1));

    const isAreaFeasible = areaRequired <= rooftop.usableAreaSqFt;
    const isCurrent = currentConfig.systemCapacityKW === kw;
    const offsetPercent = Math.min(100, Math.round((annualGen / Math.max(1, annualConsumption)) * 100));

    return {
      kw,
      panels,
      areaRequired,
      grossCost,
      subsidy,
      netCost,
      dailyGen,
      annualGen,
      annualSavings,
      payback,
      isAreaFeasible,
      isCurrent,
      offsetPercent
    };
  });

  // Identify recommended size to offset ~90-100% of electricity bill
  const targetMonthlyKWh = electricity.monthlyUnitsKWh;
  const optimalKW = Math.max(1, Math.round(targetMonthlyKWh / 125));

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-emerald-600" />
            Standard Solar Capacity Comparison Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare standard system sizes (1 kW to 10 kW) against your roof space, bill offset, and PM Surya Ghar subsidies.
          </p>
        </div>

        <div className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg self-start">
          Recommended for your bill: <strong className="font-mono text-emerald-950">{optimalKW} kWp</strong>
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3">System Size</th>
              <th className="py-3 px-3">540W Panels</th>
              <th className="py-3 px-3">Roof Area Needed</th>
              <th className="py-3 px-3 text-right">Gross Cost</th>
              <th className="py-3 px-3 text-right">Govt Subsidy</th>
              <th className="py-3 px-3 text-right">Net Cost</th>
              <th className="py-3 px-3 text-right">Daily Yield</th>
              <th className="py-3 px-3 text-right">Annual Savings</th>
              <th className="py-3 px-3 text-right">Payback</th>
              <th className="py-3 px-3 text-center">Bill Offset</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comparisonRows.map((row) => {
              const isMatch = row.kw === optimalKW;
              return (
                <tr
                  key={row.kw}
                  className={`${
                    row.isCurrent
                      ? 'bg-emerald-50/70 font-medium'
                      : isMatch
                      ? 'bg-amber-50/40'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">{row.kw} kWp</span>
                      {isMatch && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                          Best Match
                        </span>
                      )}
                      {row.isCurrent && (
                        <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-700">{row.panels} Modules</td>
                  <td className="py-3.5 px-3">
                    <span className={`font-mono ${row.isAreaFeasible ? 'text-slate-700' : 'text-rose-600 font-semibold'}`}>
                      {row.areaRequired} sq ft
                    </span>
                    {!row.isAreaFeasible && (
                      <span className="text-[10px] text-rose-500 block">Exceeds roof area</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-600">
                    ₹{row.grossCost.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-emerald-700 font-semibold">
                    {row.subsidy > 0 ? `₹${row.subsidy.toLocaleString()}` : 'Nil'}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                    ₹{row.netCost.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                    {row.dailyGen} kWh
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-700">
                    ₹{row.annualSavings.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-800">
                    {row.payback} yrs
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-800">
                      {row.offsetPercent}%
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectCapacity(row.kw)}
                      className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                        row.isCurrent
                          ? 'bg-slate-200 text-slate-500 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                      disabled={row.isCurrent}
                    >
                      {row.isCurrent ? 'Configured' : 'Select'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
