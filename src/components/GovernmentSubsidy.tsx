import React from 'react';
import {
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  Calendar,
  IndianRupee
} from 'lucide-react';

export const GovernmentSubsidy: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Official Scheme Information
            </span>
            <span className="text-xs text-slate-400">
              Verified: Q1 2026 Central Financial Assistance (CFA)
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            PM Surya Ghar: Muft Bijli Yojana & State Policy Guide
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive breakdown of official government rooftop solar subsidies, portal application steps, and mandatory documentation.
          </p>
        </div>

        <a
          href="https://pmsuryaghar.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors self-start"
        >
          <span>National Portal (pmsuryaghar.gov.in)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Subsidy Slabs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5">
          <div className="text-xs font-semibold text-emerald-900">Capacity Up to 1 kWp</div>
          <div className="text-2xl font-bold font-mono text-emerald-800">
            ₹30,000 <span className="text-xs font-normal text-emerald-700">fixed grant</span>
          </div>
          <p className="text-[11px] text-emerald-700 leading-relaxed">
            Ideal for small households consuming up to 150 units/month. Direct DBT into beneficiary bank account.
          </p>
        </div>

        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5">
          <div className="text-xs font-semibold text-emerald-900">Capacity Up to 2 kWp</div>
          <div className="text-2xl font-bold font-mono text-emerald-800">
            ₹60,000 <span className="text-xs font-normal text-emerald-700">fixed grant</span>
          </div>
          <p className="text-[11px] text-emerald-700 leading-relaxed">
            (₹30,000 for 1st kW + ₹30,000 for 2nd kW). Offsets ~250-300 units/month typical consumption.
          </p>
        </div>

        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5">
          <div className="text-xs font-semibold text-emerald-900">Capacity 3 kWp & Above</div>
          <div className="text-2xl font-bold font-mono text-emerald-800">
            ₹78,000 <span className="text-xs font-normal text-emerald-700">max cap</span>
          </div>
          <p className="text-[11px] text-emerald-700 leading-relaxed">
            (₹60,000 for 2 kW + ₹18,000 for 3rd kW). Standard maximum residential ceiling under MNRE rules.
          </p>
        </div>
      </div>

      {/* Eligibility and Application Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left: Eligibility & Requirements (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Eligibility Criteria & Rules
          </h3>

          <ul className="space-y-2 text-xs text-slate-600">
            <li className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Residential Property:</strong> Applicant must have an active domestic/residential consumer connection in their name or family name.</span>
            </li>
            <li className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>DCR (Domestic Content Requirement):</strong> Solar PV modules must be manufactured in India using domestic solar cells as per ALMM (Approved List of Models and Manufacturers).</span>
            </li>
            <li className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Empanelled Vendor:</strong> Installation must be executed by a registered vendor listed on the National Portal.</span>
            </li>
            <li className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Single Connection Rule:</strong> One subsidy claim per electricity consumer number (CA number/K Number).</span>
            </li>
          </ul>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Commercial and industrial premises are not eligible for direct PM Surya Ghar consumer subsidies, but can claim 40% accelerated tax depreciation under Section 32 of the Income Tax Act.</span>
          </div>
        </div>

        {/* Right: Mandatory Documents & 5-Step Portal Process (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-600" />
            Mandatory Documents Checklist
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="font-semibold text-slate-800">1. Electricity Bill</div>
              <div className="text-[11px] text-slate-500">Latest paid bill showing CA/K-Number</div>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="font-semibold text-slate-800">2. Proof of Identity</div>
              <div className="text-[11px] text-slate-500">Aadhaar Card / Voter ID of consumer</div>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="font-semibold text-slate-800">3. Bank Passbook / Cheque</div>
              <div className="text-[11px] text-slate-500">Cancelled cheque showing IFSC & Account No.</div>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="font-semibold text-slate-800">4. Rooftop Photograph</div>
              <div className="text-[11px] text-slate-500">Clear picture of shadow-free terrace</div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
            <div className="font-semibold text-emerald-400">Step-by-Step Portal Application Workflow:</div>
            <ol className="list-decimal pl-4 space-y-1 text-slate-300">
              <li>Register on <strong>pmsuryaghar.gov.in</strong> with state and electricity consumer number.</li>
              <li>Apply for Rooftop Solar Sanction and wait for DISCOM Technical Feasibility Approval (TFA).</li>
              <li>Select an empanelled installer and sign standard tripartite agreement.</li>
              <li>Installer completes work and submits commissioning report and work completion photo.</li>
              <li>DISCOM inspects installation, replaces traditional meter with Net Meter, and certifies system.</li>
              <li>Submit bank details; subsidy credited via DBT within 30 days.</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
        * Disclaimer: SolarVision provides decision support and financial estimations. Official subsidy sanction and disbursal are governed strictly by the Ministry of New and Renewable Energy (MNRE) and the respective state DISCOM (e.g. JVVNL in Rajasthan).
      </div>
    </div>
  );
};
