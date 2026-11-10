import React from 'react';
import { PanelConfigData, PanelTechnology, SystemType } from '../types/solar';
import {
  Sliders,
  Cpu,
  BatteryCharging,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface PanelConfigurationProps {
  data: PanelConfigData;
  onChange: (updated: PanelConfigData) => void;
  maxRooftopCapacityKW?: number;
}

export const PanelConfiguration: React.FC<PanelConfigurationProps> = ({
  data,
  onChange,
  maxRooftopCapacityKW = 10
}) => {
  // Update capacity: re-compute panels & inverter
  const handleCapacityChange = (capacityKW: number) => {
    const validCap = Math.max(1, capacityKW);
    const panels = Math.ceil((validCap * 1000) / data.panelWattage);
    const inverter = Number((validCap * 1.05).toFixed(1)); // Inverter usually sized 1:1 or 1:1.15 DC:AC
    onChange({
      ...data,
      systemCapacityKW: validCap,
      numberOfPanels: panels,
      inverterCapacityKW: inverter
    });
  };

  // Update panel wattage
  const handleWattageChange = (wattage: number, tech: PanelTechnology, eff: number) => {
    const panels = Math.ceil((data.systemCapacityKW * 1000) / wattage);
    onChange({
      ...data,
      panelWattage: wattage,
      technology: tech,
      panelEfficiency: eff,
      numberOfPanels: panels
    });
  };

  // Update system type
  const handleSystemTypeChange = (type: SystemType) => {
    let batteryKW = undefined;
    let batteryHours = undefined;
    if (type !== 'on_grid') {
      batteryKW = Math.round(data.systemCapacityKW * 2.0); // e.g., 6 kWh for 3 kW system
      batteryHours = 4;
    }
    onChange({
      ...data,
      systemType: type,
      batteryBackupKW: batteryKW,
      batteryHours
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            Solar System & Equipment Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure system capacity, photovoltaic cell technology, inverter sizing, and grid interconnect type.
          </p>
        </div>

        {/* Capacity Quick Selector Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-1">Quick Sizes:</span>
          {[2, 3, 5, 8, 10, 15].map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => handleCapacityChange(kw)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                data.systemCapacityKW === kw
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {kw} kW
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Capacity Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Proposed Solar Capacity (kWp)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-mono text-emerald-700">
                  {data.systemCapacityKW} kW
                </span>
                <span className="text-xs text-slate-400">
                  (~{data.numberOfPanels} panels)
                </span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={data.systemCapacityKW}
              onChange={(e) => handleCapacityChange(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 kW (Small Home)</span>
              <span>3 kW (Avg 3BHK)</span>
              <span>5 kW (High AC)</span>
              <span>10 kW (Commercial)</span>
              <span>25 kW</span>
            </div>
          </div>

          {/* Module Technology Selection Cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Photovoltaic Module Technology
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleWattageChange(540, 'mono_perc', 21.3)}
                className={`p-3 text-left border rounded-lg transition-all ${
                  data.technology === 'mono_perc'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-xs text-slate-900">540W Mono PERC</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Efficiency: 21.3%</div>
                <div className="text-[10px] text-emerald-700 font-medium mt-2">
                  Most Popular · High Yield
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleWattageChange(580, 'bifacial', 22.4)}
                className={`p-3 text-left border rounded-lg transition-all ${
                  data.technology === 'bifacial'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-xs text-slate-900">580W TOPCon Bifacial</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Efficiency: 22.4% + Albedo</div>
                <div className="text-[10px] text-emerald-700 font-medium mt-2">
                  Dual-glass · +10% rear gain
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleWattageChange(335, 'poly', 17.5)}
                className={`p-3 text-left border rounded-lg transition-all ${
                  data.technology === 'poly'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-xs text-slate-900">335W Polycrystalline</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Efficiency: 17.5%</div>
                <div className="text-[10px] text-slate-500 font-medium mt-2">
                  Budget · Requires +30% area
                </div>
              </button>
            </div>
          </div>

          {/* System Interconnection Type: On-Grid / Off-Grid / Hybrid */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              System Interconnect & Battery Configuration
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSystemTypeChange('on_grid')}
                className={`p-3 text-left border rounded-lg transition-all ${
                  data.systemType === 'on_grid'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-xs text-slate-900 flex items-center justify-between">
                  <span>On-Grid (Net Metered)</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Grid export & credit. No batteries.
                </div>
                <div className="text-[10px] text-emerald-700 font-medium mt-2">
                  Lowest Cost · Highest ROI
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSystemTypeChange('hybrid')}
                className={`p-3 text-left border rounded-lg transition-all ${
                  data.systemType === 'hybrid'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-xs text-slate-900">Hybrid (Grid + Storage)</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Net metering with 4hr LFP battery backup.
                </div>
                <div className="text-[10px] text-amber-700 font-medium mt-2">
                  Zero Power Outages · Mid Cost
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSystemTypeChange('off_grid')}
                className={`p-3 text-left border rounded-lg transition-all ${
                  data.systemType === 'off_grid'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-xs text-slate-900">Off-Grid (Island Mode)</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  100% autonomous battery bank. No grid.
                </div>
                <div className="text-[10px] text-slate-600 font-medium mt-2">
                  For Remote / Rural Sites
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Summary (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Bill of Materials (BOM) Specs</span>
              <span className="text-xs font-mono font-semibold text-slate-900">
                {data.systemCapacityKW} kWp DC
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span>Total Modules Required:</span>
                <span className="font-mono font-bold text-slate-900">
                  {data.numberOfPanels} × {data.panelWattage}W
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Inverter Sizing:</span>
                <span className="font-mono font-bold text-slate-900">
                  {data.inverterCapacityKW} kW Grid-Tie MPPT
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Required Shadow-Free Area:</span>
                <span className="font-mono font-semibold text-slate-800">
                  ~{data.numberOfPanels * 22} sq ft ({Math.round(data.numberOfPanels * 2.05)} sq m)
                </span>
              </div>

              {data.systemType !== 'on_grid' && (
                <div className="flex justify-between items-center text-amber-800">
                  <span>Battery Storage Sized:</span>
                  <span className="font-mono font-bold">
                    {data.batteryBackupKW || 6} kWh LFP Lithium Bank
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>System Degradation Standard:</span>
                <span className="font-mono text-slate-700">0.5% / year (25yr warranty)</span>
              </div>
            </div>

            {/* Comparison of 3 System Types Table */}
            <div className="mt-5 p-3.5 bg-white border border-slate-200 rounded-lg text-[11px]">
              <div className="font-semibold text-slate-800 mb-2">System Type Comparison Matrix:</div>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="font-medium">On-Grid:</span>
                  <span className="text-emerald-700 font-medium">Eligible for PM Surya Ghar subsidy</span>
                </div>
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="font-medium">Hybrid:</span>
                  <span>Grid security + power cuts protection</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Off-Grid:</span>
                  <span>Higher battery capex, for un-electrified sites</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
            * Inverter MPPT efficiency: 97.8% · Mounting: Hot-dip Galvanized Iron (GI) 80 micron coating.
          </div>
        </div>
      </div>
    </div>
  );
};
