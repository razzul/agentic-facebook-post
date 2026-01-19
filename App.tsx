
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import PostHistory from './components/PostHistory';
import { AgentConfig, TriviaPost } from './types';
import { generateTrivia, generateImageFromDescription } from './services/geminiService';
import { loadProjectData, saveProjectData } from './services/db';

const App: React.FC = () => {
  const [config, setConfig] = useState<AgentConfig>({
    autoPostEnabled: true,
    postTime: '09:00',
    topic: 'Pro Cycling and Bicycle History',
    groupName: 'Global Cycling Enthusiasts',
    fbConnected: false
  });

  const [posts, setPosts] = useState<TriviaPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<string | null>(null);
  
  const isFirstRender = useRef(true);

  // 1. Initial Data Hydration (Firebase -> State)
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        const cloudData = await loadProjectData();
        if (cloudData) {
          setConfig(cloudData.config);
          setPosts(cloudData.posts || []);
        } else {
          // Fallback to local storage if cloud is empty or fails
          const savedPosts = localStorage.getItem('velotrivia_posts');
          const savedConfig = localStorage.getItem('velotrivia_config');
          if (savedPosts) setPosts(JSON.parse(savedPosts));
          if (savedConfig) setConfig(JSON.parse(savedConfig));
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setIsLoading(false);
        isFirstRender.current = false;
      }
    };
    initData();
  }, []);

  // 2. Cloud Sync (State -> Firebase/Local)
  useEffect(() => {
    if (isFirstRender.current) return;

    const syncData = async () => {
      setIsSyncing(true);
      try {
        // Sync to local storage for offline redundancy
        localStorage.setItem('velotrivia_config', JSON.stringify(config));
        localStorage.setItem('velotrivia_posts', JSON.stringify(posts));
        
        // Sync to Firebase
        await saveProjectData({ config, posts });
      } catch (err) {
        console.error("Sync failed", err);
      } finally {
        setIsSyncing(false);
      }
    };

    const timer = setTimeout(syncData, 1000); // Debounce saves
    return () => clearTimeout(timer);
  }, [config, posts]);

  const handleGeneratePost = async () => {
    setIsSyncing(true);
    try {
      const trivia = await generateTrivia(config.topic);
      const newPost: TriviaPost = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        ...trivia,
        status: 'scheduled',
        platform: 'facebook'
      };
      setPosts(prev => [newPost, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleGenerateImage = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    setIsGeneratingImage(postId);
    try {
      const imageUrl = await generateImageFromDescription(post.imageDescription);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, imageUrl } : p));
    } catch (err) {
      console.error("Failed to generate image", err);
    } finally {
      setIsGeneratingImage(null);
    }
  };

  const updatePostStatus = (id: string, status: 'posted' | 'failed') => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const toggleFbConnection = () => {
    setConfig(prev => ({ ...prev, fbConnected: !prev.fbConnected }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium animate-pulse">Syncing with Cloud Database...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-bicycle text-white text-xl"></i>
            </div>
            <div>
              <h1 className="font-heading text-2xl tracking-wider text-emerald-400">VELOTRIVIA</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">AI Agent Pro</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
              <i className="fa-solid fa-chart-line w-5"></i>
              <span>Dashboard</span>
            </Link>
            <Link to="/history" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
              <i className="fa-solid fa-history w-5"></i>
              <span>History</span>
            </Link>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
              <i className="fa-solid fa-gear w-5"></i>
              <span>Settings</span>
            </Link>
          </nav>

          <div className="mt-10 space-y-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase">Cloud Sync</h3>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">{isSyncing ? 'Syncing...' : 'Live'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <i className={`fa-solid ${isSyncing ? 'fa-cloud-arrow-up text-amber-400' : 'fa-cloud-check text-emerald-400'} text-xs`}></i>
                <span className="text-[11px] font-medium text-slate-300 truncate">Firebase Realtime DB</span>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Agent Status</h3>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${config.autoPostEnabled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500'}`}></span>
                <span className="text-sm font-medium">{config.autoPostEnabled ? 'Active' : 'Paused'}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Scheduled: {config.postTime}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-slate-950 overflow-y-auto">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  posts={posts} 
                  onGenerate={handleGeneratePost} 
                  isLoading={isSyncing} 
                  onUpdateStatus={updatePostStatus} 
                  config={config} 
                  onGenerateImage={handleGenerateImage}
                  isGeneratingImage={isGeneratingImage}
                  onToggleFb={toggleFbConnection}
                />
              } 
            />
            <Route path="/history" element={<PostHistory posts={posts} />} />
            <Route path="/settings" element={<Settings config={config} setConfig={setConfig} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
