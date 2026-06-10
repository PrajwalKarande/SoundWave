import { useEffect, useState, useCallback } from 'react';
import { Music2, WifiOff, RefreshCw } from 'lucide-react';
import { songService } from '../../Services/songService';
import { artistService } from '../../Services/artistService';
import HorizontalList from '../Common/HorizontalList';

export const Home = () => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [songsData, artistsData, recentData, recsData, trendingData] = await Promise.all([
        songService.getAll({ limit: 20 }),
        artistService.getAll({ limit: 20 }),
        songService.getRecentlyPlayed(),
        songService.getRecommendations({ limit: 20 }),
        songService.getTrending({ limit: 20 }),
      ]);
      setSongs(songsData.data || songsData);
      setArtists(artistsData.data || artistsData);
      setRecentlyPlayed(recentData.songs || []);
      setRecommendations(recsData.songs || []);
      setTrending(trendingData.songs || []);
    } catch (err) {
      console.error('Failed to load data:', err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return (
      <main className="px-6 py-6 w-full flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6 text-center max-w-sm">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-section-bg border border-white/5 flex items-center justify-center">
              <Music2 className="w-10 h-10 text-muted-text" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-red-950/60 border border-red-500/30 flex items-center justify-center">
              <WifiOff className="w-4 h-4 text-red-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-primary-text text-xl font-semibold tracking-tight">
              Failed to get songs
            </h2>
            <p className="text-muted-text text-sm leading-relaxed">
              Couldn't reach the server. Check your connection and try again.
            </p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent/30 text-accent text-sm font-medium hover:bg-accent/10 transition-colors duration-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-6 w-full">
      {(loading || recentlyPlayed.length > 0) && (
        <HorizontalList title="Recently Played :)" items={recentlyPlayed} type="song" loading={loading} />
      )}
      {(loading || recommendations.length > 0) && (
        <HorizontalList title="Recommended for You" items={recommendations} type="song" loading={loading} />
      )}
      {(loading || trending.length > 0) && (
        <HorizontalList title="Trending This Week" items={trending} type="song" loading={loading} />
      )}
      <HorizontalList title="Songs" items={songs} type="song" loading={loading} />
      <HorizontalList title="Artists" items={artists} type="artist" loading={loading} />
    </main>
  );
};

export default Home;
