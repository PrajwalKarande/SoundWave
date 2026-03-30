// src/Components/Admin/Song/AdminUploadSong.jsx
import { useEffect, useState } from 'react';
import { Trash2, Plus, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../Services/api';

export default function AdminUploadSong() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await api.get('/songs');
      setSongs(res.data);
    } catch (err) {
      setError('Failed to fetch songs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (songId) => {
    if (!window.confirm('Are you sure you want to delete this song?')) return;
    try {
      await api.delete(`/songs/manage/${songId}`);
      setSongs(songs.filter((s) => s._id !== songId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete song');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '-';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full text-primary-text">
        Loading...
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-primary-text">Manage Songs</h1>
          <button
            onClick={() => navigate('/admin/manage/songs/upload')}
            className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-primary-bg font-semibold py-2 px-5 rounded-full transition-colors"
          >
            <Plus size={18} />
            Upload Song
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-section-bg shadow overflow-hidden rounded-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-muted-text/20">
            <thead className="bg-primary-bg/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">Song</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">Artists</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">Genre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-text/20">
              {songs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-text">
                    No songs found
                  </td>
                </tr>
              ) : (
                songs.map((song) => (
                  <tr key={song._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {song.coverImage ? (
                          <img
                            src={song.coverImage}
                            alt={song.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-accent/20 flex items-center justify-center text-accent">
                            <Music size={18} />
                          </div>
                        )}
                        <span className="text-sm font-medium text-primary-text">{song.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-text">
                      {song.artist?.map((a) => a.name ?? a).join(', ') || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-text">
                      {Array.isArray(song.genre) ? song.genre.join(', ') : song.genre || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-text">
                      {formatDuration(song.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(song._id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}