// src/Components/Admin/Song/AdminUploadSong.jsx
import { useEffect, useState } from 'react';
import { Trash2, Plus, Music, Pencil, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { songService } from '../../../Services/songService';
import { useConfirm } from '../../../Context/ConfirmContext';

function EditSongModal({ song, onClose, onSave }) {
  const [form, setForm] = useState({
    title: song.title || '',
    artist: song.artist?.map(a => a.name ?? a).join(', ') || '',
    genre: Array.isArray(song.genre) ? song.genre.join(', ') : song.genre || '',
    coverImage: song.coverImage || '',
    duration: song.duration || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        coverImage: form.coverImage,
        genre: form.genre.split(',').map(s => s.trim()).filter(Boolean),
        artist: form.artist.split(',').map(s => s.trim()).filter(Boolean),
        ...(form.duration ? { duration: Number(form.duration) } : {}),
      };
      const result = await songService.update(song._id, payload);
      onSave(result.song ?? result);
    } catch (err) {
      setError(err.message || 'Failed to update song');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-section-bg border border-white/10 rounded-xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-primary-text">Edit Song</h2>
          <button onClick={onClose} className="text-muted-text/60 hover:text-primary-text transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-text/70 uppercase tracking-wider">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              className="bg-primary-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-primary-text focus:outline-none focus:border-accent/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-text/70 uppercase tracking-wider">
              Artists <span className="normal-case text-white/30 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={form.artist}
              onChange={(e) => setForm(f => ({ ...f, artist: e.target.value }))}
              placeholder="Artist One, Artist Two"
              className="bg-primary-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-primary-text placeholder:text-white/20 focus:outline-none focus:border-accent/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-text/70 uppercase tracking-wider">
              Genres <span className="normal-case text-white/30 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={form.genre}
              onChange={(e) => setForm(f => ({ ...f, genre: e.target.value }))}
              placeholder="Pop, Electronic"
              className="bg-primary-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-primary-text placeholder:text-white/20 focus:outline-none focus:border-accent/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-text/70 uppercase tracking-wider">Cover Image URL</label>
            <input
              type="text"
              value={form.coverImage}
              onChange={(e) => setForm(f => ({ ...f, coverImage: e.target.value }))}
              className="bg-primary-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-primary-text placeholder:text-white/20 focus:outline-none focus:border-accent/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-text/70 uppercase tracking-wider">Duration (seconds)</label>
            <input
              type="number"
              value={form.duration}
              onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))}
              min="1"
              className="bg-primary-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-primary-text focus:outline-none focus:border-accent/60 transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/10 text-muted-text hover:text-primary-text hover:border-white/20 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-accent hover:bg-accent/80 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUploadSong() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSong, setEditingSong] = useState(null);
  const navigate = useNavigate();
  const confirm  = useConfirm();

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const result = await songService.getAll({ limit: 25 });
      setSongs(result.data || result);
    } catch (err) {
      setError('Failed to fetch songs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (songId) => {
    const ok = await confirm('This will permanently remove the song and cannot be undone.', {
      title: 'Delete Song',
    });
    if (!ok) return;
    try {
      await songService.delete(songId);
      setSongs(songs.filter((s) => s._id !== songId));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete song');
    }
  };

  const handleSave = (updated) => {
    setSongs(songs.map(s => s._id === updated._id ? updated : s));
    setEditingSong(null);
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
      {editingSong && (
        <EditSongModal
          song={editingSong}
          onClose={() => setEditingSong(null)}
          onSave={handleSave}
        />
      )}

      <div className="px-4 py-2 sm:px-0">
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
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setEditingSong(song)}
                          className="text-muted-text/60 hover:text-accent transition-colors"
                          title="Edit song"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          onClick={() => handleDelete(song._id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          title="Delete song"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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
