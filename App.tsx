import React, { useState } from 'react';
import { processUrl, detectPlatform } from './services/socialService';
import { UnifiedResult } from './types';
import { 
  Download, 
  Search, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Link2,
  Music,
  Video,
  Image as ImageIcon,
  FileText,
  Zap
} from 'lucide-react';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UnifiedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await processUrl(url);
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network error or API unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  const detectedPlatform = detectPlatform(url);

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[#050505] z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="container relative z-10 px-4 py-12 md:py-20 max-w-3xl mx-auto flex-grow flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-12 animate-float">
          <div className="inline-flex items-center justify-center p-2 mb-4 bg-cyan-500/10 border border-cyan-500/20 rounded-full backdrop-blur-md">
            <Zap className="w-4 h-4 text-cyan-400 mr-2" />
            <span className="text-xs font-semibold tracking-wider text-cyan-300 uppercase">Universal Downloader</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] mb-4">
            SoloX
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto">
            Paste a link from your favorite social platform and get the content instantly.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full relative group mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <form onSubmit={handleSubmit} className="relative flex items-center bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
            <div className="pl-4 text-gray-400">
              <Link2 className={`w-6 h-6 ${url && !detectedPlatform ? 'text-red-400' : url && detectedPlatform ? 'text-green-400' : ''}`} />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste URL (Instagram, TikTok, YouTube...)"
              className="w-full bg-transparent border-none outline-none text-white px-4 py-4 text-lg placeholder-gray-500 font-light"
            />
            <button
              type="submit"
              disabled={isLoading || !url}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
            </button>
          </form>
          
          {/* Supported Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 opacity-60">
             {['Instagram', 'TikTok', 'Facebook', 'YouTube', 'Spotify', 'X'].map((p) => (
               <span key={p} className="px-3 py-1 bg-white/5 rounded-full text-xs border border-white/10">{p}</span>
             ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="w-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center text-red-200">
              <AlertCircle className="w-6 h-6 mr-3 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Results Card */}
        {result && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
              
              {/* Card Glow Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-[50px] -mr-16 -mt-16 rounded-full pointer-events-none"></div>

              <div className="flex flex-col md:flex-row gap-6 md:items-start">
                {/* Thumbnail */}
                {result.thumbnail && (
                  <div className="w-full md:w-1/3 shrink-0">
                    <div className="aspect-square md:aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg relative group">
                      <img 
                        src={result.thumbnail} 
                        alt="Content Thumbnail" 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                        <span className="bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded shadow-lg shadow-cyan-500/20">
                          {result.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info & Downloads */}
                <div className={`flex flex-col ${result.thumbnail ? 'md:w-2/3' : 'w-full'}`}>
                  <h2 className="text-2xl font-bold text-white mb-2 line-clamp-2">{result.title}</h2>
                  {result.author && (
                    <p className="text-gray-400 mb-6 flex items-center text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2"></span>
                      {result.author}
                    </p>
                  )}

                  <div className="space-y-3 mt-auto">
                    {result.downloads.map((link, idx) => (
                      <a 
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 rounded-xl p-4 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                            {link.type === 'audio' ? <Music className="w-5 h-5" /> : 
                             link.type === 'image' ? <ImageIcon className="w-5 h-5" /> : 
                             link.type === 'file' ? <FileText className="w-5 h-5" /> :
                             <Video className="w-5 h-5" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-200 group-hover:text-white transition-colors">{link.label}</span>
                            {link.size && <span className="text-xs text-gray-500">{link.size}</span>}
                          </div>
                        </div>
                        <div className="bg-cyan-500 text-black p-2 rounded-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          <Download className="w-4 h-4" />
                        </div>
                      </a>
                    ))}
                  </div>

                  {result.downloads.length === 0 && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-sm mt-4">
                      Preview only. No direct download links returned by the provider.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-600 text-sm relative z-10">
        <p>© {new Date().getFullYear()} SoloX. Compatible with popular social platforms.</p>
      </footer>
    </div>
  );
};

export default App;