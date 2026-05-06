import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchData = async () => {
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
