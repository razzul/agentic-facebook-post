
import React, { useState } from 'react';
import { TriviaPost } from '../types';
import TriviaCard from './TriviaCard';

interface PostHistoryProps {
  posts: TriviaPost[];
}

const PostHistory: React.FC<PostHistoryProps> = ({ posts }) => {
  const [filter, setFilter] = useState<'all' | 'posted' | 'failed'>('all');

  const filteredPosts = posts.filter(p => {
    if (filter === 'all') return p.status !== 'scheduled';
    return p.status === filter;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white">Post History</h2>
        <p className="text-slate-400">Review your past automated interactions</p>
      </header>

      <div className="flex gap-4 mb-8">
        {['all', 'posted', 'failed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
              filter === f 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <TriviaCard key={post.id} post={post} isInteractive={false} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <i className="fa-solid fa-box-open text-slate-800 text-6xl mb-4"></i>
            <p className="text-slate-500 text-lg">No history matches your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostHistory;
