import React, { useState } from 'react';
import { ElectricityData } from '../types/solar';
import {
  Zap,
  TrendingUp,
  FileText,
  Building,
  Upload,
  CheckCircle,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface ElectricityModuleProps {
  data: ElectricityData;
  onChange: (updated: ElectricityData) => void;
}

export const ElectricityModule: React.FC<ElectricityModuleProps> = ({ data, onChange }) => {
  const [billUploaded, setBillUploaded] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');

  // Handle bill change: auto-recalculate units based on tariff
  const handleBillChange = (billINR: number) => {
    const validBill = Math.max(0, billINR);
    const tariff = data.tariffPerUnit > 0 ? data.tariffPerUnit : 7.2;
    const computedUnits = Math.round(validBill / tariff);
    onChange({
      ...data,
      averageMonthlyBill: validBill,
      monthlyUnitsKWh: computedUnits
    });
  };

  // Handle unit change: auto-recalculate bill
  const handleUnitsChange = (unitsKWh: number) => {
    const validUnits = Math.max(0, unitsKWh);
    const tariff = data.tariffPerUnit > 0 ? data.tariffPerUnit : 7.2;
    const computedBill = Math.round(validUnits * tariff);
    onChange({
      ...data,
      monthlyUnitsKWh: validUnits,
      averageMonthlyBill: computedBill
    });
  };

  // Handle tariff change
  const handleTariffChange = (tariffINR: number) => {
    const validTariff = Math.max(1, tariffINR);
    const computedBill = Math.round(data.monthlyUnitsKWh * validTariff);
    onChange({
      ...data,
      tariffPerUnit: validTariff,
      averageMonthlyBill: computedBill
    });
  };

  // Quick Preset Profiles for Indian Homes & Businesses
  const applyPreset = (preset: 'small_home' | 'medium_home' | 'large_villa' | 'commercial') => {
    setSelectedPreset(preset);
    if (preset === 'small_home') {
      onChange({
        ...data,
        monthlyUnitsKWh: 180,
        averageMonthlyBill: 1260,
        tariffPerUnit: 7.0,
        connectionType: 'residential'
      });
    } else if (preset === 'medium_home') {
      onChange({
        ...data,
        monthlyUnitsKWh: 380,
        averageMonthlyBill: 2850,
        tariffPerUnit: 7.5,
        connectionType: 'residential'
      });
    } else if (preset === 'large_villa') {
      onChange({
        ...data,
        monthlyUnitsKWh: 850,
        averageMonthlyBill: 6800,
        tariffPerUnit: 8.0,
        connectionType: 'residential'
      });
    } else if (preset === 'commercial') {
      onChange({
        ...data,
        monthlyUnitsKWh: 2400,
        averageMonthlyBill: 21600,
        tariffPerUnit: 9.0,
        connectionType: 'commercial'
      });
    }
  };

  // Monthly breakdown curve factoring in typical Indian cooling demand
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const seasonalWeights = [0.8, 0.85, 1.05, 1.3, 1.45, 1.35, 1.15, 1.1, 0.95, 0.85, 0.8, 0.75];
  const avgMonthly = data.monthlyUnitsKWh;

  const monthlyChartData = monthNames.map((m, idx) => {
    const units = Math.round(avgMonthly * seasonalWeights[idx]);
    const cost = Math.round(units * data.tariffPerUnit);
    return {
      month: m,
      units,
      cost
    };
  });

  const annualUnitsKWh = data.monthlyUnitsKWh * 12;
  const annualCostINR = data.averageMonthlyBill * 12;
  const dailyAverageUnits = (data.monthlyUnitsKWh / 30).toFixed(1);

  // Recommended solar capacity needed to offset ~90% of electricity bill
  // 1 kW in Jaipur typically generates ~125 kWh / month (1500 kWh / year)
  const recommendedSolarKW = Number((data.monthlyUnitsKWh / 125).toFixed(1));

  const handleSimulateBillUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBillUploaded(true);
      // Auto-extract realistic values
      onChange({
        ...data,
        monthlyUnitsKWh: 420,
        averageMonthlyBill: 3150,
        discomName: 'JVVNL - Jaipur Vidyut Vitran Nigam Limited'
      });
      setTimeout(() => setBillUploaded(false), 4000);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Electricity Consumption & Tariff Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Input your utility tariff details to establish current grid spend and calculate optimal solar capacity.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-1">Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('small_home')}
            className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Small (180 kWh)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('medium_home')}
            className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Medium (380 kWh)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('large_villa')}
            className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Villa (850 kWh)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('commercial')}
            className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Commercial (2400 kWh)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Form Inputs (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Avg. Monthly Electricity Bill (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={data.averageMonthlyBill}
                  onChange={(e) => handleBillChange(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Monthly Consumption (Units / kWh)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="20"
                  value={data.monthlyUnitsKWh}
                  onChange={(e) => handleUnitsChange(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                  kWh
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Effective Tariff Rate (₹ / kWh)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  max="25"
                  step="0.25"
                  value={data.tariffPerUnit}
                  onChange={(e) => handleTariffChange(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Rajasthan JVVNL average: ₹7.00 - ₹8.50/unit
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                DISCOM Electricity Provider
              </label>
              <select
                value={data.discomName}
                onChange={(e) => onChange({ ...data, discomName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 truncate"
              >
                <option value="JVVNL - Jaipur Vidyut Vitran Nigam">JVVNL - Jaipur Vidyut Vitran</option>
                <option value="AVVNL - Ajmer Vidyut Vitran">AVVNL - Ajmer Vidyut Vitran</option>
                <option value="JDVVNL - Jodhpur Vidyut Vitran">JDVVNL - Jodhpur Vidyut Vitran</option>
                <option value="Tata Power Delhi / Mumbai">Tata Power</option>
                <option value="BESCOM Karnataka">BESCOM</option>
                <option value="Adani Electricity">Adani Electricity</option>
                <option value="BSES Rajdhani / Yamuna">BSES Delhi</option>
                <option value="Other Regional State DISCOM">Other State DISCOM</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Connection Category
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ ...data, connectionType: 'residential' })}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    data.connectionType === 'residential'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Residential
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...data, connectionType: 'commercial' })}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    data.connectionType === 'commercial'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Commercial
                </button>
              </div>
            </div>

            {/* Optional Bill Upload Feature */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Upload Electricity Bill (Optional)
              </label>
              <label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 text-xs text-slate-600 transition-colors">
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                <span>{billUploaded ? 'Bill Parsed Successfully!' : 'Select PDF or Image'}</span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleSimulateBillUpload}
                  className="hidden"
                />
              </label>
              {billUploaded && (
                <span className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Auto-populated 420 kWh from bill
                </span>
              )}
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Daily Average</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{dailyAverageUnits} kWh</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Annual Units</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{annualUnitsKWh.toLocaleString()} kWh</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Annual Grid Cost</span>
              <span className="font-mono font-bold text-amber-700 text-sm">₹{annualCostINR.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Charts & Solar Sizing (6 cols) */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Projected 12-Month Consumption & Spend
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Summer AC Peaks factored</span>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-44 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '11px'
                    }}
                    formatter={(val: any, name: any) => [
                      name === 'units' ? `${val} kWh` : `₹${val.toLocaleString()}`,
                      name === 'units' ? 'Consumption' : 'Estimated Bill'
                    ]}
                  />
                  <Bar dataKey="units" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-950 block">
                  Recommended System Capacity for 100% Bill Offset:
                </span>
                <span className="text-[11px] text-emerald-800">
                  Generates ~{Math.round(recommendedSolarKW * 125)} kWh/month in Jaipur to eliminate current ₹{data.averageMonthlyBill.toLocaleString()} bill
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-emerald-800 block">
                  {recommendedSolarKW} kWp
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
