
import React from 'react';
import { AgentConfig } from '../types';

interface SettingsProps {
  config: AgentConfig;
  setConfig: React.Dispatch<React.SetStateAction<AgentConfig>>;
}

const Settings: React.FC<SettingsProps> = ({ config, setConfig }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-white">Agent Settings</h2>
        <p className="text-slate-400">Configure how the VeloTrivia agent behaves</p>
      </header>

      <div className="space-y-8">
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <i className="fa-solid fa-robot text-emerald-400"></i>
            Automation Logic
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl">
              <div>
                <p className="text-white font-bold">Auto-Post Enabled</p>
                <p className="text-xs text-slate-500">Agent will automatically generate and queue content daily.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="autoPostEnabled"
                  checked={config.autoPostEnabled}
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Preferred Post Time</label>
                <input 
                  type="time" 
                  name="postTime"
                  value={config.postTime}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Trivia Topic Focus</label>
                <input 
                  type="text" 
                  name="topic"
                  value={config.topic}
                  onChange={handleChange}
                  placeholder="e.g. Mountain Biking, History..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <i className="fa-brands fa-facebook text-blue-500"></i>
            Platform Integration
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Facebook Group Name/ID</label>
              <input 
                type="text" 
                name="groupName"
                value={config.groupName}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl flex items-start gap-4">
              <i className="fa-solid fa-circle-info text-blue-400 mt-1"></i>
              <div>
                <p className="text-sm text-blue-100 font-medium">Integration Note</p>
                <p className="text-xs text-blue-200/70 mt-1 leading-relaxed">
                  To connect your Facebook Group, you must install the VeloTrivia App in your group's "Apps" settings and authorize the Graph API.
                </p>
                <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors">
                  Open Facebook Developer Console
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4 pb-10">
          <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
            Discard Changes
          </button>
          <button className="px-10 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
