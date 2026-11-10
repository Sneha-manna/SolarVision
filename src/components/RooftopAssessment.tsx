import React from 'react';
import { RooftopAssessmentData } from '../types/solar';
import {
  Home,
  Compass,
  SunMedium,
  Building2,
  Grid,
  ShieldAlert,
  Sliders,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';

interface RooftopAssessmentProps {
  data: RooftopAssessmentData;
  onChange: (updated: RooftopAssessmentData) => void;
}

export const RooftopAssessment: React.FC<RooftopAssessmentProps> = ({ data, onChange }) => {
  // Area unit conversion
  const handleUnitToggle = (newUnit: 'sqft' | 'sqm') => {
    if (newUnit === data.areaUnit) return;
    if (newUnit === 'sqm') {
      // sqft to sqm
      const converted = Math.round(data.totalArea * 0.092903);
      onChange({
        ...data,
        areaUnit: 'sqm',
        totalArea: converted,
        usableAreaSqFt: Math.round(converted * 10.7639 * (data.usableAreaPercentage / 100))
      });
    } else {
      // sqm to sqft
      const converted = Math.round(data.totalArea * 10.7639);
      onChange({
        ...data,
        areaUnit: 'sqft',
        totalArea: converted,
        usableAreaSqFt: Math.round(converted * (data.usableAreaPercentage / 100))
      });
    }
  };

  const handleTotalAreaChange = (val: number) => {
    const rawVal = Math.max(0, val);
    const inSqFt = data.areaUnit === 'sqm' ? Math.round(rawVal * 10.7639) : rawVal;
    const usableSqFt = Math.round(inSqFt * (data.usableAreaPercentage / 100));

    onChange({
      ...data,
      totalArea: rawVal,
      usableAreaSqFt: usableSqFt
    });
  };

  const handleUsablePercentChange = (percent: number) => {
    const inSqFt = data.areaUnit === 'sqm' ? Math.round(data.totalArea * 10.7639) : data.totalArea;
    const usableSqFt = Math.round(inSqFt * (percent / 100));

    onChange({
      ...data,
      usableAreaPercentage: percent,
      usableAreaSqFt: usableSqFt
    });
  };

  // Approximate solar potential capacity on this roof (~90 sq ft per kW for 540W modules)
  const potentialCapacityKW = Number((data.usableAreaSqFt / 90).toFixed(1));
  const estimatedPanels = Math.floor((potentialCapacityKW * 1000) / 540);

  // Orientation efficiency score
  const getOrientationSuitability = () => {
    switch (data.orientation) {
      case 'south':
        return { label: 'Optimal (100% solar capture)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'south_west':
      case 'south_east':
        return { label: 'Very Good (95% solar capture)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'west':
      case 'east':
        return { label: 'Moderate (85% solar capture)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'north':
        return { label: 'Low (~65% capture, elevated frame recommended)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    }
  };

  // Tilt efficiency score (ideal for Jaipur ~26°)
  const getTiltSuitability = () => {
    const delta = Math.abs(data.tiltAngle - 26);
    if (delta <= 5) return { label: 'Ideal (~26° matches Jaipur latitude)', color: 'text-emerald-700 bg-emerald-50' };
    if (delta <= 12) return { label: 'Acceptable (3-5% seasonal variance)', color: 'text-slate-700 bg-slate-100' };
    return { label: 'Sub-optimal (tilt frame adjustment advised)', color: 'text-amber-700 bg-amber-50' };
  };

  const orientationStatus = getOrientationSuitability();
  const tiltStatus = getTiltSuitability();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Rooftop Solar Potential Assessment
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate usable shadow-free area, roof geometry, orientation, and structural feasibility.
          </p>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start">
          <button
            type="button"
            onClick={() => handleUnitToggle('sqft')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              data.areaUnit === 'sqft' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sq. Feet
          </button>
          <button
            type="button"
            onClick={() => handleUnitToggle('sqm')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              data.areaUnit === 'sqm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sq. Metres
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Total Area & Usable Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Total Rooftop Area ({data.areaUnit === 'sqft' ? 'sq ft' : 'sq m'})
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="100"
                  max="100000"
                  step="50"
                  value={data.totalArea}
                  onChange={(e) => handleTotalAreaChange(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                  {data.areaUnit}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Usable Shadow-Free Roof:</span>
                <span className="font-mono text-emerald-700">{data.usableAreaPercentage}%</span>
              </label>
              <input
                type="range"
                min="20"
                max="95"
                step="5"
                value={data.usableAreaPercentage}
                onChange={(e) => handleUsablePercentChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>20% (Heavy obstacles)</span>
                <span>70% (Typical RCC)</span>
                <span>95% (Open Shed)</span>
              </div>
            </div>
          </div>

          {/* Building & Roof Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Building Classification
              </label>
              <select
                value={data.buildingType}
                onChange={(e) => onChange({ ...data, buildingType: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="residential">Residential (Villa / Independent Roof)</option>
                <option value="commercial">Commercial Office / Retail</option>
                <option value="industrial">Industrial Shed / Factory</option>
                <option value="institutional">Institutional / School / Hospital</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Roof Construction Type
              </label>
              <select
                value={data.roofType}
                onChange={(e) => onChange({ ...data, roofType: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="flat_concrete">Flat RCC Concrete Terrace</option>
                <option value="sloped_tin">Sloped Metal / Corrugated Sheet</option>
                <option value="sloped_tile">Clay Mangalore Tile</option>
                <option value="curved_shed">Curved PEB Industrial Shed</option>
              </select>
            </div>
          </div>

          {/* Orientation & Tilt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-slate-500" />
                Roof Azimuth / Orientation
              </label>
              <select
                value={data.orientation}
                onChange={(e) => onChange({ ...data, orientation: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="south">True South (Recommended for India)</option>
                <option value="south_west">South-West</option>
                <option value="south_east">South-East</option>
                <option value="west">West Facing</option>
                <option value="east">East Facing</option>
                <option value="north">North Facing</option>
              </select>
              <div className={`mt-1.5 px-2 py-1 rounded text-[11px] font-medium border ${orientationStatus.color}`}>
                {orientationStatus.label}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Roof Tilt Angle:</span>
                <span className="font-mono text-slate-900">{data.tiltAngle}°</span>
              </label>
              <input
                type="range"
                min="0"
                max="60"
                step="2"
                value={data.tiltAngle}
                onChange={(e) => onChange({ ...data, tiltAngle: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
              />
              <div className={`mt-1.5 px-2 py-1 rounded text-[11px] font-medium ${tiltStatus.color}`}>
                {tiltStatus.label}
              </div>
            </div>
          </div>

          {/* Shading & Floors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Surrounding Shading Conditions
              </label>
              <select
                value={data.shadingCondition}
                onChange={(e) => onChange({ ...data, shadingCondition: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="none">Zero Shadow (Full 100% Sky View)</option>
                <option value="minimal">Minimal (&lt; 10% morning/evening shade)</option>
                <option value="partial">Partial (Nearby trees / parapet shadows)</option>
                <option value="heavy">Heavy (High-rise adjacent obstruction)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Number of Floors
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={data.numberOfFloors}
                onChange={(e) => onChange({ ...data, numberOfFloors: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Output Assessment Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Rooftop Physical Viability</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                Verified Formula
              </span>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span>Calculated Usable Area:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {data.usableAreaSqFt.toLocaleString()} sq ft
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Max Feasible System Capacity:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {potentialCapacityKW} kWp
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Estimated 540W Panel Array:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {estimatedPanels} Modules
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Mounting Structure Recommendation:</span>
                <span className="font-medium text-slate-800 text-right">
                  {data.roofType === 'flat_concrete'
                    ? 'Elevated Galvanized Iron (GI) 26°'
                    : 'Flush Clamping to Metal Purlins'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Estimated Structural Deadload:</span>
                <span className="font-mono text-slate-700">~16 kg / m²</span>
              </div>
            </div>

            {/* Visual Simulated Rooftop Mini Grid */}
            <div className="mt-5 p-3.5 bg-white border border-slate-200 rounded-lg">
              <div className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center justify-between">
                <span>Simulated Module Layout</span>
                <span className="text-slate-400 font-mono">{Math.min(estimatedPanels, 32)} modules shown</span>
              </div>
              <div className="grid grid-cols-8 gap-1 p-2 bg-slate-900 rounded-md">
                {Array.from({ length: Math.min(32, Math.max(8, estimatedPanels)) }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-blue-900/90 border border-blue-400/40 rounded-xs flex items-center justify-center"
                    title={`Module #${i + 1} - 540W Mono PERC`}
                  >
                    <div className="w-full h-full bg-linear-to-b from-blue-700/50 to-blue-950/80" />
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
                <span>Azimuth: 180° South</span>
                <span>Tilt: {data.tiltAngle}°</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-start gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Values are mathematical estimates based on 90 sq ft/kW standard allowance for Indian high-efficiency bifacial monocrystalline modules.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
