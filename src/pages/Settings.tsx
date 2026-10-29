import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/sound';
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Upload,
  User,
  Zap,
  Flame,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { stats, isMuted, toggleMute, resetProgress } = useGame();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stats, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dsa_quest_save_lv${stats.level}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    sound.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.xp !== undefined && parsed.level !== undefined) {
          localStorage.setItem('dsa_quest_progress_v1', JSON.stringify(parsed));
          window.location.reload();
        } else {
          setImportNotice('Invalid save file format.');
        }
      } catch {
        setImportNotice('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>PREFERENCES &amp; PLAYER PROFILE</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Profile &amp; Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review your gameplay metrics, audio feedback preferences, and manage your local data.
        </p>
      </div>

      {/* Player Career Stats */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" />
          <span>Player Career Record</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 block">TOTAL XP</span>
            <span className="text-lg font-bold font-mono text-cyan-400">{stats.xp}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 block">LEVEL</span>
            <span className="text-lg font-bold font-mono text-white">Lv. {stats.level}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 block">STREAK</span>
            <span className="text-lg font-bold font-mono text-amber-400">{stats.streakDays} Days</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 block">OPERATIONS</span>
            <span className="text-lg font-bold font-mono text-purple-400">{stats.operationsCount}</span>
          </div>
        </div>
      </div>

      {/* Audio Preferences */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Audio &amp; Sound Synthesizer</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Retro Web Audio synthesizers provide subtle feedback on pushes, pops, swaps, and victory chimes.
            </p>
          </div>

          <button
            onClick={toggleMute}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isMuted
                ? 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'
                : 'bg-cyan-950 border-cyan-800 text-cyan-300'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isMuted ? 'Muted' : 'Audio Active'}</span>
          </button>
        </div>
      </div>

      {/* Backup and Restore */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Save Data Management</h3>
        <p className="text-xs text-slate-400">
          Export your current player save to a local JSON file or import a previous backup file.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Save JSON</span>
          </button>

          <label className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import Save File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
        </div>

        {importNotice && (
          <div className="text-xs text-amber-400 font-mono">{importNotice}</div>
        )}
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="p-6 rounded-2xl border border-red-950 bg-red-950/20 space-y-4">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
          <ShieldAlert className="w-4 h-4" />
          <span>DANGER ZONE</span>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">Reset Gameplay Progress</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Reset all earned XP, unlocked levels, completed missions, and badges. This action cannot be undone.
          </p>
        </div>

        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/60 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Progress</span>
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950 border border-red-900/60 space-y-3">
            <div className="text-xs text-red-300 font-bold">
              Are you sure? All stats, streaks, and unlocked adventure levels will be reset!
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  resetProgress();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
