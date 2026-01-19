
import React, { useState } from 'react';
import { TriviaPost } from '../types';

interface TriviaCardProps {
  post: TriviaPost;
  onUpdateStatus?: (id: string, status: 'posted' | 'failed') => void;
  isInteractive?: boolean;
  onGenerateImage?: (postId: string) => void;
  isGeneratingImage?: boolean;
}

const TriviaCard: React.FC<TriviaCardProps> = ({ 
  post, 
  onUpdateStatus, 
  isInteractive = false,
  onGenerateImage,
  isGeneratingImage = false
}) => {
  const [copied, setCopied] = useState(false);
  const formattedDate = new Date(post.timestamp).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleShare = async () => {
    const shareText = `🚲 VeloTrivia Time!\n\n❓ Question: ${post.question}\n✅ Answer: ${post.answer}\n\n✨ Fun Fact: ${post.funFact}\n\n#VeloTrivia ${post.hashtags.map(t => `#${t}`).join(' ')}`;
    
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    };

    if (navigator.share) {
      try {
        const shareData: ShareData = {
          title: 'Cycling Trivia',
          text: shareText,
        };

        // Only include URL if it's a valid absolute HTTP/HTTPS URL
        // Some preview environments use internal protocols that break navigator.share
        if (window.location.protocol.startsWith('http')) {
          shareData.url = window.location.href;
        }

        await navigator.share(shareData);
      } catch (err) {
        // If it's not a user-cancellation (AbortError), fallback to clipboard
        if ((err as Error).name !== 'AbortError') {
          console.warn('Native share failed, falling back to clipboard:', err);
          await copyToClipboard();
        }
      }
    } else {
      await copyToClipboard();
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl transition-transform hover:scale-[1.01]">
      {post.imageUrl && (
        <div className="w-full aspect-square md:aspect-video relative overflow-hidden bg-slate-950">
          <img 
            src={post.imageUrl} 
            alt="AI Generated Trivia Visual" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-6">
            <span className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
              AI Generated Artwork
            </span>
          </div>
        </div>
      )}

      {isGeneratingImage && (
        <div className="w-full aspect-square md:aspect-video flex flex-col items-center justify-center bg-slate-950/80 border-b border-slate-800">
          <i className="fa-solid fa-circle-notch fa-spin text-emerald-500 text-3xl mb-4"></i>
          <p className="text-emerald-500 font-bold text-sm animate-pulse">Designing Visual Content...</p>
          <p className="text-slate-500 text-xs mt-2 px-10 text-center">{post.imageDescription}</p>
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-bicycle text-emerald-500 text-sm"></i>
            </div>
            <div>
              <p className="text-white font-bold text-sm">VeloTrivia AI Agent</p>
              <p className="text-slate-500 text-[10px]">{formattedDate}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
            post.status === 'posted' ? 'bg-emerald-500/20 text-emerald-400' :
            post.status === 'scheduled' ? 'bg-amber-500/20 text-amber-400' :
            'bg-rose-500/20 text-rose-400'
          }`}>
            {post.status}
          </span>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-emerald-400 font-bold text-xs uppercase mb-1">Question</h4>
            <p className="text-lg text-white font-medium">{post.question}</p>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <h4 className="text-slate-400 font-bold text-xs uppercase mb-1">Answer</h4>
            <p className="text-slate-200">{post.answer}</p>
          </div>

          <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
            <h4 className="text-emerald-500 font-bold text-xs uppercase mb-1">Fun Fact</h4>
            <p className="text-emerald-100 italic text-sm">" {post.funFact} "</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {post.hashtags.map((tag, idx) => (
              <span key={idx} className="text-blue-400 text-xs font-medium hover:underline cursor-pointer">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
          {isInteractive && post.status === 'scheduled' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => onUpdateStatus?.(post.id, 'posted')}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <i className="fa-solid fa-paper-plane"></i>
                Post Now
              </button>
              
              {!post.imageUrl && onGenerateImage && (
                <button 
                  onClick={() => onGenerateImage(post.id)}
                  disabled={isGeneratingImage}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-slate-700 disabled:to-slate-800 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  {isGeneratingImage ? (
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                  ) : (
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                  )}
                  {post.imageUrl ? 'Regenerate Visual' : 'Generate AI Visual'}
                </button>
              )}
            </div>
          )}

          <div className="flex gap-3">
            {isInteractive && post.status === 'scheduled' && (
              <>
                <button 
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                  Edit
                </button>
                <button 
                  onClick={() => onUpdateStatus?.(post.id, 'failed')}
                  className="w-12 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 py-3 rounded-xl transition-all flex items-center justify-center"
                  title="Discard Post"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </>
            )}

            <button 
              onClick={handleShare}
              className={`flex-1 ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'} font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2`}
            >
              <i className={`fa-solid ${copied ? 'fa-check' : 'fa-share-nodes'}`}></i>
              {copied ? 'Copied to Clipboard' : 'Share Trivia'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/40 p-4">
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">AI Image Generation Prompt</p>
        <p className="text-[11px] text-slate-400 leading-relaxed italic line-clamp-2">
          {post.imageDescription}
        </p>
      </div>
    </div>
  );
};

export default TriviaCard;
