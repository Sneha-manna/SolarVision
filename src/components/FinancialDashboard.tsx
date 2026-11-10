import React, { useState } from 'react';
import { FinancialAnalysisData } from '../types/solar';
import {
  IndianRupee,
  TrendingUp,
  ShieldCheck,
  Percent,
  Calendar,
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

interface FinancialDashboardProps {
  financial: FinancialAnalysisData;
  systemCapacityKW: number;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  financial,
  systemCapacityKW
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<number>(25);

  // Prepare 25-year cumulative cash flow chart data
  const chartData = financial.yearlyProjections.map((proj) => {
    // Cumulative grid spend without solar
    let cumulativeGrid = 0;
    for (let y = 0; y < proj.year; y++) {
      cumulativeGrid += financial.yearlyProjections[y].gridCostWithoutSolar;
    }

    return {
      year: `Yr ${proj.year}`,
      yearNumber: proj.year,
      gridCostCumulative: cumulativeGrid,
      netSolarSavingsCumulative: proj.netCumulativeSavings,
      annualSavings: proj.electricitySavedINR
    };
  });

  const milestoneYears = [5, 10, 15, 25];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-600" />
            Financial Analysis, PM Surya Ghar Subsidy & 25-Year ROI
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent investment breakdown, government subsidy eligibility, capital recovery payback, and lifetime lifecycle comparison.
          </p>
        </div>

        {/* Subsidy Status Badge */}
        {financial.subsidyEligible ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg self-start">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Eligible for ₹{financial.governmentSubsidy.toLocaleString()} PM Surya Ghar Subsidy</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg self-start">
            <span>Commercial 40% Accelerated Tax Depreciation</span>
          </div>
        )}
      </div>

      {/* Top Financial KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-xs font-medium text-slate-500">Gross System Capex</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            ₹{financial.grossInstallationCost.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            ~₹{Math.round(financial.grossInstallationCost / Math.max(1, systemCapacityKW)).toLocaleString()} / kWp
          </div>
        </div>

        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
          <div className="text-xs font-medium text-emerald-900">Net Investment After Subsidy</div>
          <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">
            ₹{financial.netInvestmentCost.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">
            {financial.governmentSubsidy > 0
              ? `Saved ₹${financial.governmentSubsidy.toLocaleString()} via Govt Subsidy`
              : 'Direct capital outlay'}
          </div>
        </div>

        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
          <div className="text-xs font-medium text-emerald-900">Estimated Payback Period</div>
          <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">
            {financial.paybackPeriodYears} <span className="text-xs font-normal text-emerald-700">Years</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">
            Capital fully recovered
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-xs font-medium text-slate-500">25-Year Lifetime Net Profit</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
            ₹{financial.lifetimeSavings25Years.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            ROI: {financial.returnOnInvestment25YearsPercent}% · NPV: ₹{financial.netPresentValue25Years.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cost Itemization & Subsidy Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
              <span>Itemized Capital Expenditure (CAPEX)</span>
              <span className="font-mono text-slate-500">{systemCapacityKW} kW</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                <span>Solar PV Modules (Tier-1 Mono PERC):</span>
                <span className="font-mono font-medium text-slate-900">
                  ₹{financial.panelCost.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                <span>Solar Grid-Tie Inverter (MPPT):</span>
                <span className="font-mono font-medium text-slate-900">
                  ₹{financial.inverterCost.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                <span>Mounting Structures & Hardware (GI 80μm):</span>
                <span className="font-mono font-medium text-slate-900">
                  ₹{financial.bosAndStructureCost.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                <span>BOS, Wiring, Earthing & Net Metering:</span>
                <span className="font-mono font-medium text-slate-900">
                  ₹{financial.installationAndNetMeterFee.toLocaleString()}
                </span>
              </div>

              {financial.batteryCost > 0 && (
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200 text-amber-800">
                  <span>Lithium LFP Battery Storage:</span>
                  <span className="font-mono font-bold">
                    ₹{financial.batteryCost.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-1 font-semibold text-slate-900">
                <span>Gross Turnkey Installation Cost:</span>
                <span className="font-mono">₹{financial.grossInstallationCost.toLocaleString()}</span>
              </div>

              {financial.governmentSubsidy > 0 && (
                <div className="flex justify-between items-center text-emerald-700 font-semibold bg-emerald-100/60 p-2 rounded-md">
                  <span>Less: PM Surya Ghar Subsidy:</span>
                  <span className="font-mono">- ₹{financial.governmentSubsidy.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 text-sm font-bold text-slate-900 border-t border-slate-300">
                <span>Net Consumer Outlay:</span>
                <span className="font-mono text-emerald-700">₹{financial.netInvestmentCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Monthly Savings summary */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs space-y-2">
            <div className="font-bold text-emerald-950">Immediate Monthly Impact</div>
            <div className="flex justify-between text-slate-700">
              <span>Avg Monthly Bill Savings:</span>
              <span className="font-mono font-bold text-emerald-800">
                ₹{financial.monthlyBillSavings.toLocaleString()} / month
              </span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Annual Bill Savings (Year 1):</span>
              <span className="font-mono font-bold text-emerald-800">
                ₹{financial.annualSavings.toLocaleString()} / year
              </span>
            </div>
          </div>
        </div>

        {/* 25-Year Financial Comparison Chart (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                25-Year Cumulative Financial Comparison: Grid vs Solar (₹)
              </span>
              <span className="text-[11px] text-slate-500">4% tariff escalation factored</span>
            </div>

            <div className="h-60 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '11px'
                    }}
                    formatter={(val: any, name: any) => [
                      `₹${Number(val).toLocaleString()}`,
                      name === 'gridCostCumulative' ? 'Cumulative Grid Cost (No Solar)' : 'Net Cumulative Savings with Solar'
                    ]}
                  />
                  <Legend
                    verticalAlign="top"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gridCostCumulative"
                    name="Cumulative Grid Spend (No Solar)"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="netSolarSavingsCumulative"
                    name="Net Solar Profit (After Capex & O&M)"
                    stroke="#059669"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5, 10, 15, 25-Year Milestone Comparison Table */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="text-xs font-bold text-slate-800 mb-2">
              Milestone Financial Projections (Years 5, 10, 15, 25):
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {milestoneYears.map((yr) => {
                const row = financial.yearlyProjections[yr - 1];
                let cumGrid = 0;
                for (let i = 0; i < yr; i++) cumGrid += financial.yearlyProjections[i].gridCostWithoutSolar;

                return (
                  <div key={yr} className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <div className="text-[11px] font-bold text-slate-700">Year {yr}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Grid Cost:</div>
                    <div className="font-mono text-slate-600 text-[11px]">₹{(cumGrid / 100000).toFixed(1)}L</div>
                    <div className="text-[10px] text-slate-400 mt-1">Solar Net Profit:</div>
                    <div className="font-mono font-bold text-emerald-700 text-xs">
                      ₹{(row.netCumulativeSavings / 100000).toFixed(1)}L
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Assumptions Footer Bar */}
      <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <span><strong>Assumptions:</strong> 0.5% annual panel degradation · 4.0% annual DISCOM tariff inflation · 1% annual O&M · Inverter refurbishment provision at Year 11 · 8% discount rate.</span>
      </div>
    </div>
  );
};
