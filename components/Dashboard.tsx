
import React, { useState } from 'react';
import { TriviaPost, AgentConfig } from '../types';
import TriviaCard from './TriviaCard';

interface DashboardProps {
  posts: TriviaPost[];
  onGenerate: () => void;
  isLoading: boolean;
  onUpdateStatus: (id: string, status: 'posted' | 'failed') => void;
  config: AgentConfig;
  onGenerateImage?: (postId: string) => void;
  isGeneratingImage?: string | null;
  onToggleFb: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  posts, 
  onGenerate, 
  isLoading, 
  onUpdateStatus, 
  config,
  onGenerateImage,
  isGeneratingImage,
  onToggleFb
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const scheduledPost = posts.find(p => p.status === 'scheduled');

  const handleAuthClick = () => {
    if (config.fbConnected) {
      onToggleFb();
      return;
    }
    
    setIsConnecting(true);
    // Simulate OAuth flow
    setTimeout(() => {
      onToggleFb();
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Agent Overview</h2>
          <p className="text-slate-400 mt-1">Managing {config.groupName} community automation</p>
        </div>
        <button 
          onClick={onGenerate}
          disabled={isLoading}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
          {isLoading ? (
            <i className="fa-solid fa-circle-notch fa-spin"></i>
          ) : (
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          )}
          Manual Generate Trivia
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Cards */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-clock text-emerald-400"></i>
              Current Scheduled Post
            </h3>
            {scheduledPost ? (
              <TriviaCard 
                post={scheduledPost} 
                onUpdateStatus={onUpdateStatus} 
                isInteractive={true} 
                onGenerateImage={onGenerateImage}
                isGeneratingImage={isGeneratingImage === scheduledPost.id}
              />
            ) : (
              <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center">
                <i className="fa-solid fa-calendar-plus text-slate-700 text-4xl mb-4"></i>
                <p className="text-slate-500 font-medium">No posts scheduled. Click generate to create one.</p>
              </div>
            )}
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-300 mb-4">Performance Insights</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Posts', value: posts.length, icon: 'fa-paper-plane', color: 'text-blue-400' },
                { label: 'Engagement', value: '4.2k', icon: 'fa-thumbs-up', color: 'text-emerald-400' },
                { label: 'Success Rate', value: '98%', icon: 'fa-circle-check', color: 'text-purple-400' },
                { label: 'Audience', value: '1.8k', icon: 'fa-users', color: 'text-amber-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <i className={`fa-solid ${stat.icon} ${stat.color} text-lg mb-2`}></i>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Mini-feed */}
        <div className="space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Agent Logs</h3>
            <div className="space-y-4">
              {[
                { time: '10:00 AM', msg: 'System check complete.', type: 'info' },
                { time: '09:00 AM', msg: 'Scheduled post "History of Tires" successful.', type: 'success' },
                { time: 'Yesterday', msg: 'Auto-generation trigger started.', type: 'info' },
              ].map((log, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <span className="text-slate-500 whitespace-nowrap">{log.time}</span>
                  <span className={`${log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className={`rounded-2xl p-6 shadow-xl transition-all ${config.fbConnected ? 'bg-slate-900 border border-emerald-500/30' : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/10'}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-bold">Connect Your FB Group</h3>
              {config.fbConnected && (
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  LINKED
                </span>
              )}
            </div>
            <p className={`${config.fbConnected ? 'text-slate-400' : 'text-emerald-100'} text-sm mb-4`}>
              {config.fbConnected 
                ? `Account linked to "${config.groupName}". The agent is authorized to post trivia.` 
                : "You are currently using a simulated Facebook API. Connect a real group to start posting live."}
            </p>
            <button 
              onClick={handleAuthClick}
              disabled={isConnecting}
              className={`w-full font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                config.fbConnected 
                ? 'bg-slate-800 hover:bg-rose-500/20 hover:text-rose-500 text-slate-300' 
                : 'bg-white/20 hover:bg-white/30 text-white shadow-inner'
              }`}
            >
              {isConnecting ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : (
                <i className={`fa-brands ${config.fbConnected ? 'fa-facebook-f' : 'fa-facebook'}`}></i>
              )}
              {config.fbConnected ? 'Disconnect Account' : 'Manage Auth'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
