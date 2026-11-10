import React from 'react';
import { Sun, User, LogOut } from 'lucide-react';
import { UserProfile } from '../types/solar';

interface NavbarProps {
  activeView: 'landing' | 'app' | 'knowledge' | 'subsidy' | 'history' | 'admin';
  onNavigate: (view: 'landing' | 'app' | 'knowledge' | 'subsidy' | 'history' | 'admin') => void;
  currentUser: UserProfile;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element Brand wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Sun className="w-4 h-4 text-white" />
          </div>
          <span>SolarVision</span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => onNavigate('app')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'app' ? 'text-emerald-700 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Solar Calculator
          </button>
          <button
            type="button"
            onClick={() => onNavigate('subsidy')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'subsidy' ? 'text-emerald-700 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            PM Surya Ghar
          </button>
          <button
            type="button"
            onClick={() => onNavigate('knowledge')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'knowledge' ? 'text-emerald-700 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Knowledge Hub
          </button>
          <button
            type="button"
            onClick={() => onNavigate('history')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'history' ? 'text-emerald-700 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Saved Projects
          </button>
          {currentUser.role === 'admin' && (
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors ${
                activeView === 'admin' ? 'text-emerald-700 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Admin Console
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser.isGuest ? (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Demo</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="max-w-[120px] truncate">{currentUser.name}</span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
