import React from 'react';
import { useGame } from '../../context/GameContext';
import { PageId } from '../../types/game';
import {
  LayoutDashboard,
  MapPin,
  Box,
  Cpu,
  Activity,
  HelpCircle,
  Terminal,
  Award,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'learning-path', label: 'Learning Path', icon: MapPin, badge: '8 Levels' },
  { id: 'playground', label: 'DS Playground', icon: Box, badge: 'Interactive' },
  { id: 'algorithm-lab', label: 'Algorithm Lab', icon: Cpu, badge: 'Live Trace' },
  { id: 'big-o-arena', label: 'Big O Arena', icon: Activity },
  { id: 'quiz', label: 'Quiz Challenge', icon: HelpCircle },
  { id: 'missions', label: 'Coding Missions', icon: Terminal, badge: 'Python' },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'settings', label: 'Profile & Settings', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, onCloseMobileMenu }) => {
  const { currentPage, setCurrentPage, stats, achievements } = useGame();

  const unlockedBadges = achievements.filter(a => a.isUnlocked).length;

  const handleNavClick = (pageId: PageId) => {
    setCurrentPage(pageId);
    onCloseMobileMenu();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-cyan-600 flex items-center justify-center font-bold text-white text-xs">
              Ω
            </div>
            <span className="font-bold text-white tracking-tight">DSA Quest</span>
          </div>
          <button
            onClick={onCloseMobileMenu}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Title */}
        <div className="px-6 pt-5 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Quest Hub
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1 px-3 py-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-950/70 text-cyan-300 font-semibold border border-cyan-800/40 shadow-sm shadow-cyan-950/50'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Gamer Profile Mini-Card */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 m-3 rounded-xl border">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-200">Adventurer</div>
            <div className="text-[10px] font-mono text-cyan-400 font-bold">
              Level {stats.level}
            </div>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(5, ((stats.xp % 250) / 250) * 100)
                )}%`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-mono tabular-nums">{stats.xp} Total XP</span>
            <span className="font-mono tabular-nums">{unlockedBadges}/{achievements.length} Badges</span>
          </div>
        </div>
      </aside>
    </>
  );
};
