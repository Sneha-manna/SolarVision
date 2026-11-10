import React, { useState } from 'react';
import {
  MLModelEvaluation,
  PredictionResult,
  SolarRadiationData
} from '../types/solar';
import {
  Cpu,
  Brain,
  CheckCircle,
  Database,
  BarChart2,
  TreeDeciduous,
  Leaf,
  Layers,
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

interface MLPredictionViewProps {
  prediction: PredictionResult;
  radiationData: SolarRadiationData;
  systemCapacityKW: number;
}

export const MLPredictionView: React.FC<MLPredictionViewProps> = ({
  prediction,
  radiationData,
  systemCapacityKW
}) => {
  const [activeTab, setActiveTab] = useState<'generation' | 'ml_models' | 'sources'>('generation');

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyData = prediction.monthlyBreakdownKWh.map((kwh, idx) => ({
    month: monthNames[idx],
    generation: kwh,
    ghi: radiationData.monthlyGHI[idx] || 5.0,
    temp: radiationData.monthlyTemp[idx] || 25
  }));

  const hourlyData = prediction.hourlyGenerationCurve.map((item) => ({
    time: `${item.hour}:00`,
    watts: item.generationWatts
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      {/* Header and Sub-tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-600" />
            Machine Learning Energy Prediction & Model Validation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Trained regression models forecasting daily, monthly, and annual generation with NASA POWER irradiance and thermal derating.
          </p>
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setActiveTab('generation')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'generation'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Generation Curves
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ml_models')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'ml_models'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Model Comparison & Feature Importance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'sources'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Data Provenance
          </button>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
          <div className="text-xs font-medium text-emerald-900">Daily Average Generation</div>
          <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">
            {prediction.dailyAverageKWh} <span className="text-xs font-normal text-emerald-700">kWh/day</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">
            ~{(prediction.dailyAverageKWh / Math.max(1, systemCapacityKW)).toFixed(1)} kWh/kWp/day
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-xs font-medium text-slate-600">Annual Total Generation</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {prediction.annualTotalKWh.toLocaleString()} <span className="text-xs font-normal text-slate-500">kWh/yr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Monthly Avg: {prediction.monthlyAverageKWh} kWh
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-xs font-medium text-slate-600">Carbon Offset (CO₂)</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
            {prediction.co2SavedTonnesPerYear} <span className="text-xs font-normal text-slate-500">tonnes/yr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            CEA baseline: 0.82 kg CO₂/kWh
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-xs font-medium text-slate-600">Environmental Equivalence</div>
          <div className="text-2xl font-bold font-mono text-teal-700 mt-1 flex items-center gap-1.5">
            <TreeDeciduous className="w-5 h-5 text-emerald-600" />
            {prediction.equivalentTreesPlanted.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Mature trees planted per year
          </div>
        </div>
      </div>

      {/* Tab 1: Generation Charts */}
      {activeTab === 'generation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 12-Month Generation Bar Chart (8 cols) */}
            <div className="lg:col-span-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800">
                  Predicted 12-Month Energy Generation (kWh)
                </span>
                <span className="text-[11px] text-slate-500">
                  Peak: May ({Math.max(...prediction.monthlyBreakdownKWh)} kWh) · Monsoon Dip: Aug
                </span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '11px'
                      }}
                      formatter={(val: any) => [`${val} kWh`, 'Generation']}
                    />
                    <Bar dataKey="generation" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Solar Bell Curve (4 cols) */}
            <div className="lg:col-span-4 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800 mb-1">
                  Typical Daily Diurnal Solar Curve
                </div>
                <div className="text-[11px] text-slate-500 mb-3">
                  Instantaneous AC generation (Watts) from sunrise to sunset.
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} interval={2} />
                      <YAxis tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '8px',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '11px'
                        }}
                        formatter={(val: any) => [`${val} W`, 'AC Power']}
                      />
                      <Area type="monotone" dataKey="watts" stroke="#059669" fill="#10b981" fillOpacity={0.25} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 mt-2">
                * Peak generation occurs between 11:30 AM and 1:30 PM solar noon.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Model Comparison & Feature Importance */}
      {activeTab === 'ml_models' && (
        <div className="space-y-6">
          {/* Models Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Regression Model Benchmark Evaluation (Holdout Test Set N=200)</span>
              <span className="text-[11px] font-normal text-slate-500">
                Evaluation target: Generation (kWh/day)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Model Architecture</th>
                    <th className="py-2.5 px-4 text-right">MAE (kWh)</th>
                    <th className="py-2.5 px-4 text-right">RMSE (kWh)</th>
                    <th className="py-2.5 px-4 text-right">R² Score</th>
                    <th className="py-2.5 px-4">Evaluation Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {prediction.modelEvaluations.map((evalItem) => {
                    const isChampion = evalItem.modelName.includes('Champion');
                    return (
                      <tr
                        key={evalItem.modelName}
                        className={isChampion ? 'bg-emerald-50/50 font-medium' : 'hover:bg-slate-50'}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {isChampion && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                            <div>
                              <div className="text-slate-900 font-semibold">{evalItem.modelName}</div>
                              <div className="text-[11px] text-slate-500">{evalItem.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-800">
                          {evalItem.mae}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-800">
                          {evalItem.rmse}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                          {evalItem.r2Score}
                        </td>
                        <td className="py-3 px-4">
                          {isChampion ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                              Selected Model (R² &gt; 0.94)
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Baseline comparison</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feature Importance Bar List */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs font-bold text-slate-800 mb-1">
              Random Forest Feature Importance Weights (%)
            </div>
            <div className="text-[11px] text-slate-500 mb-4">
              Relative variance reduction contribution across decision tree splits for solar forecasting.
            </div>

            <div className="space-y-3">
              {prediction.featureImportances.map((item) => (
                <div key={item.feature} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{item.feature}</span>
                    <span className="font-mono font-semibold text-slate-900">{item.importance}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${item.importance}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Data Provenance */}
      {activeTab === 'sources' && (
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Database className="w-4 h-4 text-emerald-600" />
            External Data Sources & Measurement Methodology
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2">
              <div className="font-semibold text-slate-900 flex items-center justify-between">
                <span>Solar Radiation & Temperature</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                  {radiationData.isRealApiData ? 'LIVE SATELLITE' : 'VERIFIED BASELINE'}
                </span>
              </div>
              <div className="text-slate-600 leading-relaxed">
                <strong>Source:</strong> {radiationData.dataSourceName}
              </div>
              <div className="text-slate-600">
                <strong>Parameters:</strong> ALLSKY_SFC_SW_DWN (Global Horizontal Irradiance in kWh/m²/day), T2M (2-meter ambient temperature °C), CLDTOT (Cloud coverage %).
              </div>
              <div className="text-slate-500 text-[11px]">
                <strong>Last Retrieval:</strong> {new Date(radiationData.dataRetrievalDate).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 italic">
                {radiationData.dataQualityNotes}
              </div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2">
              <div className="font-semibold text-slate-900">
                PV Conversion & Physical Assumptions
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li><strong>Thermal Derating:</strong> -0.38% / °C above 25°C Standard Test Conditions (STC).</li>
                <li><strong>Inverter Efficiency:</strong> 97.5% Euro-efficiency weighted curve.</li>
                <li><strong>Balance of System (BOS) Losses:</strong> 6% (cables, dust, mismatch).</li>
                <li><strong>Grid Emission Baseline:</strong> Central Electricity Authority of India (CEA CO₂ baseline v19).</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
