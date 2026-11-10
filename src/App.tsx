import React, { useState, useEffect, useMemo } from 'react';
import {
  ElectricityData,
  FinancialAnalysisData,
  LocationData,
  PanelConfigData,
  PredictionResult,
  RecommendationData,
  RooftopAssessmentData,
  SavedSolarProject,
  SolarRadiationData,
  UserProfile
} from './types/solar';
import {
  DEFAULT_JAIPUR_LOCATION,
  fetchSolarRadiationData
} from './services/solarDataService';
import { runSolarPrediction } from './services/mlPredictionEngine';
import { calculateSolarFinancials } from './services/financialEngine';
import { generateSolarRecommendation } from './services/recommendationEngine';

// Components
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { InteractiveMap } from './components/InteractiveMap';
import { RooftopAssessment } from './components/RooftopAssessment';
import { ElectricityModule } from './components/ElectricityModule';
import { PanelConfiguration } from './components/PanelConfiguration';
import { MLPredictionView } from './components/MLPredictionView';
import { FinancialDashboard } from './components/FinancialDashboard';
import { SystemComparison } from './components/SystemComparison';
import { RecommendationCard } from './components/RecommendationCard';
import { KnowledgeCenter } from './components/KnowledgeCenter';
import { GovernmentSubsidy } from './components/GovernmentSubsidy';
import { ReportModal } from './components/ReportModal';
import { HistoryAndProjects } from './components/HistoryAndProjects';
import { AdminConsole } from './components/AdminConsole';
import { AuthModal } from './components/AuthModal';

import {
  MapPin,
  Building2,
  Zap,
  Sliders,
  Brain,
  IndianRupee,
  GitCompare,
  FileText,
  Bookmark,
  Share2
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | 'app' | 'knowledge' | 'subsidy' | 'history' | 'admin'>('landing');
  const [calculatorTab, setCalculatorTab] = useState<'all' | 'map' | 'rooftop' | 'electricity' | 'panels' | 'prediction' | 'financial' | 'comparison'>('all');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('solarvision_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: 'guest_user',
      name: 'Guest Explorer',
      email: 'guest@solarvision.in',
      role: 'homeowner',
      isGuest: true,
      savedProjects: [],
      createdAt: new Date().toISOString()
    };
  });

  // Saved Projects List
  const [savedProjects, setSavedProjects] = useState<SavedSolarProject[]>(() => {
    const saved = localStorage.getItem('solarvision_saved_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Core Solar State
  const [location, setLocation] = useState<LocationData>(DEFAULT_JAIPUR_LOCATION);

  const [rooftop, setRooftop] = useState<RooftopAssessmentData>({
    totalArea: 1200,
    areaUnit: 'sqft',
    usableAreaPercentage: 70,
    usableAreaSqFt: 840,
    buildingType: 'residential',
    roofType: 'flat_concrete',
    orientation: 'south',
    tiltAngle: 26,
    shadingCondition: 'minimal',
    numberOfFloors: 2,
    hasObstructions: true,
    obstructionNotes: 'Stair mumty and small overhead water tank'
  });

  const [electricity, setElectricity] = useState<ElectricityData>({
    averageMonthlyBill: 3150,
    monthlyUnitsKWh: 420,
    tariffPerUnit: 7.5,
    discomName: 'JVVNL - Jaipur Vidyut Vitran Nigam',
    connectionType: 'residential',
    seasonalVariation: {
      summerPeakPercent: 35,
      monsoonDipPercent: -15,
      winterPercent: -20
    }
  });

  const [panelConfig, setPanelConfig] = useState<PanelConfigData>({
    systemCapacityKW: 3,
    panelWattage: 540,
    panelEfficiency: 21.3,
    technology: 'mono_perc',
    numberOfPanels: 6,
    inverterCapacityKW: 3.2,
    systemType: 'on_grid'
  });

  // Solar Radiation Data State
  const [radiation, setRadiation] = useState<SolarRadiationData>({
    annualDailyAverageGHI: 5.42,
    dni: 6.23,
    dhi: 1.89,
    averageTemperatureC: 26.8,
    monthlyGHI: [4.35, 5.25, 6.18, 6.82, 7.15, 6.54, 5.21, 4.68, 5.45, 5.32, 4.62, 4.12],
    monthlyTemp: [15.2, 18.6, 24.5, 30.2, 34.8, 35.1, 31.4, 29.8, 29.5, 26.8, 21.2, 16.4],
    monthlyCloudCover: [12, 14, 15, 18, 22, 38, 68, 65, 32, 10, 8, 9],
    dataSourceName: 'NASA POWER Climatology (v2.0)',
    dataSourceUrl: 'https://power.larc.nasa.gov/',
    isRealApiData: true,
    dataRetrievalDate: new Date().toISOString(),
    dataQualityNotes: 'Satellite climatology for Jaipur, Rajasthan (26.85°N, 75.82°E).'
  });

  // Fetch real NASA POWER data when location coordinates change
  useEffect(() => {
    let isCancelled = false;
    const fetchWeather = async () => {
      setIsLoadingWeather(true);
      try {
        const data = await fetchSolarRadiationData(location.latitude, location.longitude);
        if (!isCancelled) {
          setRadiation(data);
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
      } finally {
        if (!isCancelled) {
          setIsLoadingWeather(false);
        }
      }
    };

    fetchWeather();
    return () => {
      isCancelled = true;
    };
  }, [location.latitude, location.longitude]);

  // Reactive Machine Learning Prediction
  const prediction: PredictionResult = useMemo(() => {
    return runSolarPrediction(radiation, rooftop, panelConfig, electricity);
  }, [radiation, rooftop, panelConfig, electricity]);

  // Reactive Financial Calculations
  const financial: FinancialAnalysisData = useMemo(() => {
    return calculateSolarFinancials(panelConfig, electricity, rooftop, prediction);
  }, [panelConfig, electricity, rooftop, prediction]);

  // Reactive Decision Recommendation
  const recommendation: RecommendationData = useMemo(() => {
    return generateSolarRecommendation(rooftop, electricity, panelConfig, radiation, prediction, financial);
  }, [rooftop, electricity, panelConfig, radiation, prediction, financial]);

  // Current project representation
  const currentProject: SavedSolarProject = useMemo(() => ({
    id: `proj_${Date.now()}`,
    name: `${location.locality} - ${panelConfig.systemCapacityKW}kW System`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location,
    rooftop,
    electricity,
    panelConfig,
    radiation,
    prediction,
    financial,
    recommendation
  }), [location, rooftop, electricity, panelConfig, radiation, prediction, financial, recommendation]);

  // Save current project
  const handleSaveProject = (customName: string) => {
    const newProj: SavedSolarProject = {
      ...currentProject,
      id: `proj_${Date.now()}`,
      name: customName,
      createdAt: new Date().toISOString()
    };
    const updated = [newProj, ...savedProjects];
    setSavedProjects(updated);
    localStorage.setItem('solarvision_saved_projects', JSON.stringify(updated));
  };

  // Load project
  const handleLoadProject = (proj: SavedSolarProject) => {
    setLocation(proj.location);
    setRooftop(proj.rooftop);
    setElectricity(proj.electricity);
    setPanelConfig(proj.panelConfig);
    if (proj.radiation) setRadiation(proj.radiation);
    setActiveView('app');
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    const updated = savedProjects.filter((p) => p.id !== id);
    setSavedProjects(updated);
    localStorage.setItem('solarvision_saved_projects', JSON.stringify(updated));
  };

  // User auth update
  const handleUpdateUser = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('solarvision_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    const guest: UserProfile = {
      id: 'guest_user',
      name: 'Guest Explorer',
      email: 'guest@solarvision.in',
      role: 'homeowner',
      isGuest: true,
      savedProjects,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(guest);
    localStorage.removeItem('solarvision_user');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW 1: LANDING PAGE */}
        {activeView === 'landing' && (
          <LandingPage
            onStartAnalysis={() => setActiveView('app')}
            onExploreMap={() => {
              setActiveView('app');
              setCalculatorTab('map');
            }}
            onViewSubsidy={() => setActiveView('subsidy')}
            onViewKnowledge={() => setActiveView('knowledge')}
          />
        )}

        {/* VIEW 2: SOLAR CALCULATOR & DECISION DASHBOARD */}
        {activeView === 'app' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            {/* Top Workspace Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Interactive Decision Workspace
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5">
                  Solar Energy Feasibility & Financial Forecasting
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Location: <strong className="text-slate-800">{location.locality}, {location.city}</strong> · System: <strong className="text-emerald-700 font-mono">{panelConfig.systemCapacityKW} kWp</strong> · Annual Yield: <strong className="text-slate-800 font-mono">{prediction.annualTotalKWh.toLocaleString()} kWh</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap self-start">
                <button
                  type="button"
                  onClick={() => handleSaveProject(`${location.locality} ${panelConfig.systemCapacityKW}kW`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                  Save Scenario
                </button>
                <button
                  type="button"
                  onClick={() => setIsReportOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Download Dossier PDF
                </button>
              </div>
            </div>

            {/* Filter Navigation Bar (Clean Segmented Tabs) */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs overflow-x-auto scrollbar-none text-xs">
              {[
                { id: 'all', label: 'Complete Overview' },
                { id: 'map', label: '1. Solar Map' },
                { id: 'rooftop', label: '2. Rooftop Viability' },
                { id: 'electricity', label: '3. Electricity Bill' },
                { id: 'panels', label: '4. Panel Config' },
                { id: 'prediction', label: '5. ML Forecast' },
                { id: 'financial', label: '6. 25-Yr ROI & Subsidy' },
                { id: 'comparison', label: '7. Size Comparison' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCalculatorTab(tab.id as any)}
                  className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap shrink-0 transition-colors ${
                    calculatorTab === tab.id
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* RECOMMENDATION DECISION VERDICT (Prominent top banner) */}
            <RecommendationCard
              recommendation={recommendation}
              financial={financial}
              prediction={prediction}
              onOpenReport={() => setIsReportOpen(true)}
            />

            {/* MODULAR SECTION VIEWS */}
            {(calculatorTab === 'all' || calculatorTab === 'map') && (
              <InteractiveMap
                currentLocation={location}
                radiationData={radiation}
                onLocationChange={(newLoc) => setLocation(newLoc)}
                onSaveLocation={(loc) => handleSaveProject(`${loc.locality} Solar Study`)}
                isLoadingWeather={isLoadingWeather}
              />
            )}

            {(calculatorTab === 'all' || calculatorTab === 'rooftop') && (
              <RooftopAssessment
                data={rooftop}
                onChange={(updated) => setRooftop(updated)}
              />
            )}

            {(calculatorTab === 'all' || calculatorTab === 'electricity') && (
              <ElectricityModule
                data={electricity}
                onChange={(updated) => setElectricity(updated)}
              />
            )}

            {(calculatorTab === 'all' || calculatorTab === 'panels') && (
              <PanelConfiguration
                data={panelConfig}
                onChange={(updated) => setPanelConfig(updated)}
                maxRooftopCapacityKW={Number((rooftop.usableAreaSqFt / 90).toFixed(1))}
              />
            )}

            {(calculatorTab === 'all' || calculatorTab === 'prediction') && (
              <MLPredictionView
                prediction={prediction}
                radiationData={radiation}
                systemCapacityKW={panelConfig.systemCapacityKW}
              />
            )}

            {(calculatorTab === 'all' || calculatorTab === 'financial') && (
              <FinancialDashboard
                financial={financial}
                systemCapacityKW={panelConfig.systemCapacityKW}
              />
            )}

            {(calculatorTab === 'all' || calculatorTab === 'comparison') && (
              <SystemComparison
                currentConfig={panelConfig}
                electricity={electricity}
                rooftop={rooftop}
                radiation={radiation}
                onSelectCapacity={(kw) => {
                  setPanelConfig({
                    ...panelConfig,
                    systemCapacityKW: kw,
                    numberOfPanels: Math.ceil((kw * 1000) / panelConfig.panelWattage),
                    inverterCapacityKW: Number((kw * 1.05).toFixed(1))
                  });
                }}
              />
            )}
          </div>
        )}

        {/* VIEW 3: PM SURYA GHAR GOVERNMENT SUBSIDY GUIDE */}
        {activeView === 'subsidy' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            <GovernmentSubsidy />
          </div>
        )}

        {/* VIEW 4: SOLAR KNOWLEDGE CENTRE */}
        {activeView === 'knowledge' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            <KnowledgeCenter />
          </div>
        )}

        {/* VIEW 5: SAVED PROJECTS & PREDICTION HISTORY */}
        {activeView === 'history' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            <HistoryAndProjects
              savedProjects={savedProjects}
              currentProject={currentProject}
              onSaveCurrent={handleSaveProject}
              onLoadProject={handleLoadProject}
              onDeleteProject={handleDeleteProject}
            />
          </div>
        )}

        {/* VIEW 6: ADMIN TELEMETRY CONSOLE */}
        {activeView === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            <AdminConsole
              evaluations={prediction.modelEvaluations}
              totalSavedProjects={savedProjects.length}
              lastApiRetrieval={radiation.dataRetrievalDate}
            />
          </div>
        )}
      </main>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        location={location}
        rooftop={rooftop}
        electricity={electricity}
        panelConfig={panelConfig}
        radiation={radiation}
        prediction={prediction}
        financial={financial}
        recommendation={recommendation}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  );
}
