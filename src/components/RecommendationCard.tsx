import React from 'react';
import { RecommendationData, FinancialAnalysisData, PredictionResult } from '../types/solar';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileText
} from 'lucide-react';

interface RecommendationCardProps {
  recommendation: RecommendationData;
  financial: FinancialAnalysisData;
  prediction: PredictionResult;
  onOpenReport?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  financial,
  prediction,
  onOpenReport
}) => {
  const getStatusConfig = () => {
    switch (recommendation.status) {
      case 'STRONGLY_RECOMMENDED':
        return {
          icon: CheckCircle2,
          badgeText: 'Highly Recommended',
          bgBanner: 'bg-emerald-900 text-white',
          badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
          scoreColor: 'text-emerald-400'
        };
      case 'BENEFICIAL':
        return {
          icon: CheckCircle2,
          badgeText: 'Viable with Optimizations',
          bgBanner: 'bg-slate-900 text-white',
          badgeColor: 'bg-emerald-400 text-slate-950 font-bold',
          scoreColor: 'text-emerald-400'
        };
      case 'MORE_INFO_NEEDED':
        return {
          icon: HelpCircle,
          badgeText: 'More Information Required',
          bgBanner: 'bg-slate-800 text-white',
          badgeColor: 'bg-amber-400 text-slate-950 font-bold',
          scoreColor: 'text-amber-400'
        };
      case 'NOT_RECOMMENDED':
      default:
        return {
          icon: AlertTriangle,
          badgeText: 'Not Recommended Currently',
          bgBanner: 'bg-slate-900 text-white',
          badgeColor: 'bg-rose-400 text-slate-950 font-bold',
          scoreColor: 'text-rose-400'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Top Banner */}
      <div className={`p-6 ${config.bgBanner} relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-xs tracking-wide uppercase ${config.badgeColor}`}>
                {config.badgeText}
              </span>
              <span className="text-xs text-slate-300">
                Decision Support Engine
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {recommendation.headline}
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {recommendation.summary}
            </p>
          </div>

          <div className="text-left md:text-right shrink-0 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
            <div className="text-xs text-slate-300">Feasibility Index</div>
            <div className={`text-3xl font-extrabold font-mono ${config.scoreColor}`}>
              {recommendation.suitabilityScore}<span className="text-sm font-normal text-slate-300">/100</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              Multi-criteria index
            </div>
          </div>
        </div>
      </div>

      {/* Decision Summary Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs text-slate-500 block">Recommended Capacity</span>
            <span className="text-lg font-bold font-mono text-slate-900">
              {recommendation.recommendedCapacityKW} kWp
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Annual Generation</span>
            <span className="text-lg font-bold font-mono text-slate-900">
              {prediction.annualTotalKWh.toLocaleString()} kWh
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Annual Bill Savings</span>
            <span className="text-lg font-bold font-mono text-emerald-700">
              ₹{financial.annualSavings.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Capital Payback</span>
            <span className="text-lg font-bold font-mono text-emerald-700">
              {financial.paybackPeriodYears} Years
            </span>
          </div>
        </div>

        {/* Pros and Limitations Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Main Advantages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Key Drivers & Benefits
            </h4>
            <div className="space-y-2">
              {recommendation.pros.map((pro, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{pro}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cautions & Next Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Constraints, Limitations & Checklist
            </h4>
            <div className="space-y-2">
              {recommendation.limitations.length > 0 ? (
                recommendation.limitations.map((lim, idx) => (
                  <div key={idx} className="p-2.5 bg-amber-50/50 border border-amber-200/60 rounded-lg text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">!</span>
                    <span>{lim}</span>
                  </div>
                ))
              ) : (
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-800">
                  No critical physical or financial limitations identified.
                </div>
              )}

              {recommendation.actionItems.map((action, idx) => (
                <div key={`act-${idx}`} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                  <span className="text-slate-500 font-semibold shrink-0">→</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        {onOpenReport && (
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Download complete certified dossier for DISCOM or bank loan application.
            </span>
            <button
              type="button"
              onClick={onOpenReport}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <FileText className="w-4 h-4" />
              Generate Official Solar Feasibility PDF Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
