import React, { useState } from 'react';
import { UserProfile } from '../types/solar';
import {
  X,
  User,
  Lock,
  Mail,
  Shield,
  CheckCircle2,
  LogIn,
  UserPlus,
  KeyRound
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'homeowner' | 'commercial_buyer' | 'installer'>('homeowner');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'forgot') {
      setMessage(`Password reset instructions sent to ${email || 'your email'}.`);
      setTimeout(() => {
        setMessage(null);
        setMode('login');
      }, 2500);
      return;
    }

    if (mode === 'register') {
      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        name: name || 'Solar Customer',
        email: email || 'user@example.com',
        role,
        isGuest: false,
        savedProjects: currentUser.savedProjects,
        createdAt: new Date().toISOString()
      };
      onUpdateUser(newUser);
      setMessage('Account registered successfully! Welcome to SolarVision.');
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1200);
      return;
    }

    if (mode === 'login') {
      const loggedUser: UserProfile = {
        id: currentUser.id || `user_${Date.now()}`,
        name: name || (email ? email.split('@')[0] : 'Sneha Manna'),
        email: email || 'snehamanna009@gmail.com',
        role,
        isGuest: false,
        savedProjects: currentUser.savedProjects,
        createdAt: currentUser.createdAt || new Date().toISOString()
      };
      onUpdateUser(loggedUser);
      setMessage('Logged in successfully!');
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1000);
    }
  };

  const handleQuickDemoLogin = (demoRole: 'homeowner' | 'commercial_buyer' | 'installer' | 'admin') => {
    const demoUser: UserProfile = {
      id: `demo_${demoRole}`,
      name: demoRole === 'admin' ? 'Admin Engineer' : 'Sneha Manna (Jaipur)',
      email: demoRole === 'admin' ? 'admin@solarvision.in' : 'snehamanna009@gmail.com',
      role: demoRole,
      isGuest: false,
      savedProjects: currentUser.savedProjects,
      createdAt: new Date().toISOString()
    };
    onUpdateUser(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              SV
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                {mode === 'login' && 'Log In to SolarVision'}
                {mode === 'register' && 'Create Your Solar Account'}
                {mode === 'forgot' && 'Reset Account Password'}
              </div>
              <div className="text-[11px] text-slate-500">
                Manage saved rooftop analyses & financial projections
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {message && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sneha Manna"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="snehamanna009@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-emerald-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">I am a</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="homeowner">Homeowner / Property Owner</option>
                  <option value="commercial_buyer">Commercial / Industrial Property Owner</option>
                  <option value="installer">Solar EPC / Installer</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-xs flex items-center justify-center gap-1.5"
            >
              {mode === 'login' && <LogIn className="w-3.5 h-3.5" />}
              {mode === 'register' && <UserPlus className="w-3.5 h-3.5" />}
              {mode === 'forgot' && <KeyRound className="w-3.5 h-3.5" />}
              <span>
                {mode === 'login' && 'Sign In'}
                {mode === 'register' && 'Create Account'}
                {mode === 'forgot' && 'Send Reset Link'}
              </span>
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="text-[11px] text-slate-400 text-center mb-2">Or instant demo sign-in:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('homeowner')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium rounded-lg transition-colors text-center"
              >
                Guest / Homeowner
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium rounded-lg transition-colors text-center"
              >
                Admin Mode
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Log in here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
