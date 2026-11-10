import React, { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sun,
  Zap,
  Battery,
  Shield,
  RotateCcw,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const KnowledgeCenter: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'basics' | 'tech' | 'roadmap' | 'glossary' | 'faqs'>('basics');

  const faqs = [
    {
      q: 'How does Net Metering work in Rajasthan (JVVNL)?',
      a: 'A bidirectional bi-directional net meter records both electricity imported from JVVNL grid and surplus solar energy exported. At the end of every monthly billing cycle, exported solar units are subtracted from imported units. You only pay for net imported units. If net export occurs, units are carried forward or credited as per RERC solar regulations.'
    },
    {
      q: 'What is the maximum subsidy under PM Surya Ghar: Muft Bijli Yojana?',
      a: 'Under the PM Surya Ghar scheme, residential rooftop installations receive ₹30,000 for 1 kW, ₹60,000 for 2 kW, and a maximum of ₹78,000 for 3 kW and above. The subsidy is disbursed directly to your bank account via Direct Benefit Transfer (DBT) within 30 days of DISCOM inspection and net meter installation.'
    },
    {
      q: 'Will solar panels work during rainy days and cloudy monsoon seasons?',
      a: 'Yes. Solar panels convert both direct beam irradiance and diffuse ambient daylight. While output drops to ~30-50% during heavy overcast monsoon rain, annual generation in Rajasthan remains amongst the highest in the world due to over 300 clear sunny days.'
    },
    {
      q: 'What happens during a power cut / grid failure with an On-Grid system?',
      a: 'For safety reasons (anti-islanding protection mandated by CEA), standard on-grid inverters automatically shut down during grid outages so maintenance linemen are not electrocuted. If continuous uninterrupted backup is essential, a Hybrid Solar System with a Lithium-ion battery bank or smart changeover switch is recommended.'
    },
    {
      q: 'How much rooftop space is required for a 3 kW solar system?',
      a: 'Modern 540W-580W monocrystalline modules require approximately 70 to 90 square feet of shadow-free area per kilowatt. For a 3 kW system, you need roughly 220 to 270 square feet of unobstructed terrace space facing South.'
    },
    {
      q: 'What maintenance is required for rooftop solar panels?',
      a: 'Solar PV systems have zero moving parts and require minimal maintenance. In arid regions like Rajasthan, washing panels with plain water every 15 to 20 days to remove accumulated dust ensures optimum 95%+ photonic capture efficiency.'
    }
  ];

  const glossaryItems = [
    { term: 'GHI (Global Horizontal Irradiance)', def: 'Total solar radiation received by a flat horizontal surface, combining Direct Normal Irradiance (DNI) and Diffuse Horizontal Irradiance (DHI).' },
    { term: 'Mono PERC', def: 'Passivated Emitter and Rear Cell monocrystalline technology offering 21%+ efficiency and superior low-light performance.' },
    { term: 'Bifacial TOPCon', def: 'Dual-glass solar modules generating energy from both front and rear albedo reflections (+5% to +15% additional energy).' },
    { term: 'MPPT (Maximum Power Point Tracking)', def: 'Electronic DC-DC optimizer inside inverters that continually locks onto the optimal voltage/current operating point of the solar array.' },
    { term: 'Anti-Islanding Protection', def: 'Mandatory safety protocol that immediately disconnects grid-tie solar systems during grid failure to protect utility workers.' },
    { term: 'Degradation Rate', def: 'Gradual reduction in panel output over time; Tier-1 manufacturers guarantee max 0.5% degradation per year for 25 to 30 years.' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Solar Knowledge & Education Centre
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Understand solar engineering principles, hardware technologies, net metering, and installation workflows.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg overflow-x-auto scrollbar-none self-start">
          {[
            { id: 'basics', label: 'How PV Works' },
            { id: 'tech', label: 'Panel & Inverter Tech' },
            { id: 'roadmap', label: '6-Step Installation' },
            { id: 'glossary', label: 'Solar Terms' },
            { id: 'faqs', label: 'FAQs' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {/* Tab 1: Basics */}
        {activeTab === 'basics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Photovoltaic Effect</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Solar photons knock electrons free from doped silicon p-n junctions, generating Direct Current (DC) electricity proportional to solar irradiance.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-sm">DC to AC Inversion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The solar string inverter converts high-voltage DC into synchronized 230V single-phase or 415V three-phase Alternating Current (AC) for household appliances.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Bi-Directional Net Metering</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Electricity generated during sunny hours powers your home first. Any surplus feeds into the utility grid, running your meter backwards and earning credit.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Hardware Tech */}
        {activeTab === 'tech' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Monocrystalline vs Bifacial TOPCon
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Mono PERC:</strong> Single pure silicon crystal ingots offering ~21.2% efficiency with excellent temperature coefficients.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Bifacial TOPCon:</strong> Next-gen n-type tunnel oxide passivated modules with glass on both sides, capturing reflected light from whitewashed terraces for 10-15% extra energy.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Battery className="w-4 h-4 text-emerald-600" />
                  Inverters & Battery Storage
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>String Inverter:</strong> Cost-effective centralized unit with dual MPPT trackers, ideal for unshaded rooftops.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Lithium Iron Phosphate (LFP):</strong> Safe, long-life (6000+ cycle) battery chemistry for hybrid systems, delivering 10+ years of daily cycling without thermal degradation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Installation Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Site Survey & Roof Check', desc: 'Verify shadow profile, RCC structural load-bearing capacity, and orientation.' },
              { step: '2', title: 'DISCOM Feasibility Approval', desc: 'Apply online on State DISCOM / PM Surya Ghar portal for load sanction.' },
              { step: '3', title: 'Certified Vendor Sourcing', desc: 'Contract an MNRE-empanelled EPC installer with ALMM-approved panels.' },
              { step: '4', title: 'Physical Installation', desc: 'Hot-dip galvanized mounting structures, modules, inverter, AC/DC DB & dual earthing.' },
              { step: '5', title: 'DISCOM Inspection & Net Meter', desc: 'Utility engineer inspects installation and installs bi-directional meter.' },
              { step: '6', title: 'DBT Subsidy Disbursal', desc: 'Upload commissioning report on National Portal; subsidy credited within 30 days.' }
            ].map((item) => (
              <div key={item.step} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                    {item.step}
                  </span>
                  <span className="font-bold text-slate-900">{item.title}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Glossary */}
        {activeTab === 'glossary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {glossaryItems.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-bold text-slate-900">{item.term}</div>
                <div className="text-slate-600 mt-1 leading-relaxed">{item.def}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: FAQs */}
        {activeTab === 'faqs' && (
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-lg overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-3.5 text-left bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-3.5 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
