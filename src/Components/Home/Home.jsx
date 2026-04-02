import { useEffect, useState } from 'react';
import { songService } from '../../Services/songService';
import { artistService } from '../../Services/artistService';
import HorizontalList from '../Common/HorizontalList';

export const Home = () => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsData, artistsData] = await Promise.all([
          songService.getAll(),
          artistService.getAll(),
        ]);
        setSongs(songsData);
        setArtists(artistsData);
      } catch (err) {
        console.error('Failed to load data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full text-primary-text">
        Loading...
      </div>
    );
  }

  return (
    <main className="px-6 py-6 max-w-7xl mx-auto">
      <HorizontalList title="Songs" items={songs} type="song" />
      <HorizontalList title="Artists" items={artists} type="artist" />
    </main>
  );
};
