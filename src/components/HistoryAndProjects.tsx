import React, { useState } from 'react';
import { SavedSolarProject } from '../types/solar';
import {
  FolderClock,
  Trash2,
  Download,
  Eye,
  GitCompare,
  Plus,
  Calendar,
  MapPin,
  IndianRupee,
  CheckCircle2
} from 'lucide-react';

interface HistoryAndProjectsProps {
  savedProjects: SavedSolarProject[];
  currentProject: SavedSolarProject;
  onSaveCurrent: (name: string) => void;
  onLoadProject: (project: SavedSolarProject) => void;
  onDeleteProject: (id: string) => void;
}

export const HistoryAndProjects: React.FC<HistoryAndProjectsProps> = ({
  savedProjects,
  currentProject,
  onSaveCurrent,
  onLoadProject,
  onDeleteProject
}) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [comparingProjects, setComparingProjects] = useState<SavedSolarProject[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onSaveCurrent(newProjectName.trim());
    setNewProjectName('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportJSON = (project: SavedSolarProject) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `solarvision_${project.name.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const toggleCompare = (project: SavedSolarProject) => {
    if (comparingProjects.some((p) => p.id === project.id)) {
      setComparingProjects(comparingProjects.filter((p) => p.id !== project.id));
    } else {
      if (comparingProjects.length >= 2) {
        setComparingProjects([comparingProjects[1], project]);
      } else {
        setComparingProjects([...comparingProjects, project]);
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FolderClock className="w-5 h-5 text-emerald-600" />
            Saved Solar Projects & Prediction History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Store custom rooftop scenarios, track predictions over time, compare system capacities, or export project data.
          </p>
        </div>

        {/* Save Current Scenario Form */}
        <form onSubmit={handleSave} className="flex items-center gap-2 self-start">
          <input
            type="text"
            placeholder="Name this scenario (e.g., Jaipur Villa 5kW)..."
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 w-60"
          />
          <button
            type="submit"
            disabled={!newProjectName.trim()}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Save Analysis
          </button>
        </form>
      </div>

      {saveSuccess && (
        <div className="my-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Scenario saved successfully to your history!</span>
        </div>
      )}

      {/* Side-by-Side Comparison if 2 selected */}
      {comparingProjects.length === 2 && (
        <div className="my-6 p-4 bg-slate-900 text-white rounded-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <GitCompare className="w-4 h-4" />
              Side-by-Side Scenario Comparison
            </div>
            <button
              type="button"
              onClick={() => setComparingProjects([])}
              className="text-xs text-slate-400 hover:text-white"
            >
              Clear Comparison
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
            {comparingProjects.map((p) => (
              <div key={p.id} className="p-3 bg-slate-800/80 rounded-lg space-y-2">
                <div className="font-bold text-sm text-emerald-300">{p.name}</div>
                <div className="text-slate-400">{p.location.locality}, {p.location.city}</div>
                <div className="space-y-1 pt-2 border-t border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Capacity:</span>
                    <span className="font-mono font-bold">{p.panelConfig.systemCapacityKW} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Net Cost:</span>
                    <span className="font-mono text-emerald-400">₹{p.financial.netInvestmentCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annual Savings:</span>
                    <span className="font-mono">₹{p.financial.annualSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payback:</span>
                    <span className="font-mono">{p.financial.paybackPeriodYears} yrs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="mt-6">
        {savedProjects.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <FolderClock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No Saved Projects Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Enter a name above and click "Save Analysis" to store this configuration for comparison and future reference.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {savedProjects.map((project) => {
              const isSelectedForCompare = comparingProjects.some((p) => p.id === project.id);
              return (
                <div
                  key={project.id}
                  className="p-4 bg-white hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{project.name}</span>
                      <span className="text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                        {project.panelConfig.systemCapacityKW} kWp
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {project.location.locality}, {project.location.city}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-emerald-700 font-medium">
                        Net: ₹{project.financial.netInvestmentCost.toLocaleString()}
                      </span>
                      <span>·</span>
                      <span className="text-slate-600">
                        Payback: {project.financial.paybackPeriodYears} yrs
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center">
                    <button
                      type="button"
                      onClick={() => onLoadProject(project)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Load
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleCompare(project)}
                      className={`px-3 py-1.5 border text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                        isSelectedForCompare
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      {isSelectedForCompare ? 'Comparing' : 'Compare'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportJSON(project)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Export JSON"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteProject(project.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
