import React from 'react';
import {
  Sun,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Brain,
  Layers,
  ArrowRight,
  CheckCircle2,
  TreeDeciduous,
  Zap,
  Building,
  HelpCircle,
  FileText
} from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onExploreMap: () => void;
  onViewSubsidy: () => void;
  onViewKnowledge: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  onExploreMap,
  onViewSubsidy,
  onViewKnowledge
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>AI-Powered Solar Potential & Decision Support</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] max-w-2xl text-balance">
                Know Your Solar Potential Before You Invest.
              </h1>

              <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-xl">
                Accurate rooftop feasibility, NASA satellite solar radiation data, machine learning generation forecasting, and verified PM Surya Ghar financial returns tailored for Indian properties.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onStartAnalysis}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Start Solar Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onExploreMap}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Explore Solar Map</span>
                </button>
              </div>

              {/* Proof strip */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-mono text-lg font-bold text-slate-900">5.4+ kWh</div>
                  <div className="text-slate-500">Avg. Daily Irradiance</div>
                </div>
                <div>
                  <div className="font-mono text-lg font-bold text-emerald-700">₹78,000</div>
                  <div className="text-slate-500">Max Govt Subsidy</div>
                </div>
                <div>
                  <div className="font-mono text-lg font-bold text-slate-900">3.4 Years</div>
                  <div className="text-slate-500">Avg Capital Recovery</div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols) Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 aspect-[16/10] bg-slate-900">
                <img
                  src="/src/assets/images/solar_hero_rooftop_1794295927348.jpg"
                  alt="Modern rooftop solar array at sunset"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Jaipur Rooftop Photovoltaic Potential</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded font-mono">
                      NASA POWER v2.0
                    </span>
                  </div>
                  <div className="text-slate-300 text-[11px] mt-1">
                    Annual average GHI: 5.42 kWh/m²/day · 300+ clear days/year
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            All-In-One Decision Platform
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Engineered for Precision, Not Guesstimates
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-2">
            Every calculation connects satellite weather archives with empirical PV physical modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Interactive Solar Map</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pinpoint any property in Jaipur or across India. Inspect micro-locality solar indexes with Leaflet satellite imagery.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Rooftop Assessment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compute usable shadow-free terrace dimensions, optimal 26° South tilt, obstacle deratings, and panel arrangements.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">ML Prediction Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trained regression models (Random Forest, Decision Tree, OLS) forecasting 12-month generation with thermal derating.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">PM Surya Ghar Subsidy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant calculation of verified DBT grants (up to ₹78,000) and complete 25-year lifecycle financial cash flow projections.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              Clear 4-Step Process
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              How SolarVision Solves Your Solar Decision
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Select Property Location',
                desc: 'Pick your city & locality or drop a custom pin on the satellite map to extract NASA solar radiation.'
              },
              {
                step: '02',
                title: 'Input Rooftop & Bill Details',
                desc: 'Specify usable terrace area, roof type, shading, and monthly electricity bill.'
              },
              {
                step: '03',
                title: 'Run AI Prediction Model',
                desc: 'Our Random Forest regressor computes daily, monthly, and seasonal generation curves.'
              },
              {
                step: '04',
                title: 'Review Financials & PDF Dossier',
                desc: 'Get a clear decision verdict, payback period, PM Surya Ghar subsidy claim, and certified report.'
              }
            ].map((item) => (
              <div key={item.step} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-mono text-2xl font-black text-emerald-600">{item.step}</div>
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SATELLITE & COMMERCIAL SHOWCASE */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-[4/3] bg-slate-900">
            <img
              src="/src/assets/images/solar_rooftop_satellite_1794295927912.jpg"
              alt="Satellite view of rooftop solar array"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Rooftop Photogrammetry & Geometry
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Precision Area Sizing & Shading Losses
            </h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Standard estimation tools often ignore rooftop obstacles like water storage tanks, stairwell mumties, and high parapet walls. SolarVision incorporates realistic usable area coefficients (70% standard RCC allowance) and orientation penalties to avoid costly over-sizing.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onStartAnalysis}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <span>Calculate Your Rooftop Capacity</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Sun className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">SolarVision</span>
            <span className="text-slate-500 text-xs ml-2">© 2026 SolarVision Platform. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button type="button" onClick={onViewSubsidy} className="hover:text-white transition-colors">
              PM Surya Ghar Subsidy
            </button>
            <button type="button" onClick={onViewKnowledge} className="hover:text-white transition-colors">
              Solar Knowledge Hub
            </button>
            <button type="button" onClick={onStartAnalysis} className="hover:text-white transition-colors">
              Rooftop Calculator
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
