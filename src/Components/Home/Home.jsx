import { useEffect, useState } from 'react';
import { songService } from '../../Services/songService';
import { artistService } from '../../Services/artistService';
import HorizontalList from '../Common/HorizontalList';

export const Home = () => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsData, artistsData, recentData] = await Promise.all([
          songService.getAll({ limit: 20 }),
          artistService.getAll({ limit: 20 }),
          songService.getRecentlyPlayed(),
        ]);
        setSongs(songsData.data || songsData);
        setArtists(artistsData.data || artistsData);
        setRecentlyPlayed(recentData.songs || []);
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
      <HorizontalList title="Songs" items={songs} type="song" loading={loading} />
      <HorizontalList title="Artists" items={artists} type="artist" loading={loading} />
    </main>
  );
};

export default Home;
