import { useEffect, useState } from 'react';
import { Trash2, Plus, Pencil, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { artistService } from '../../../Services/artistService';
import { useConfirm } from '../../../Context/ConfirmContext';

function EditArtistModal({ artist, onClose, onSave }) {
  const [form, setForm] = useState({
    name: artist.name || '',
    bio: artist.bio || '',
    profileImageURL: artist.profileImageURL || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const updated = await artistService.update(artist._id, form);
      onSave(updated);
    } catch (err) {
      setError(err.message || 'Failed to update artist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-section-bg border border-white/10 rounded-xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-primary-text">Edit Artist</h2>
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
            <label className="text-xs font-medium text-muted-text/70 uppercase tracking-wider">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              className="bg-primary-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-primary-text placeholder:text-white/20 focus:outline-none focus:border-accent/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-text/70 uppercase tracking-wider">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={3}
              className="bg-primary-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-primary-text placeholder:text-white/20 focus:outline-none focus:border-accent/60 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-text/70 uppercase tracking-wider">Profile Image URL</label>
            <input
              type="text"
              value={form.profileImageURL}
              onChange={(e) => setForm(f => ({ ...f, profileImageURL: e.target.value }))}
              className="bg-primary-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-primary-text placeholder:text-white/20 focus:outline-none focus:border-accent/60 transition-colors"
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

export default function AdminUploadArtist() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingArtist, setEditingArtist] = useState(null);
  const navigate = useNavigate();
  const confirm  = useConfirm();

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const data = await artistService.getAll({ limit: 25 });
      setArtists(data.data || data);
    } catch (err) {
      setError('Failed to fetch artists');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (artistId) => {
    const ok = await confirm('This will permanently remove the artist and cannot be undone.', {
      title: 'Delete Artist',
    });
    if (!ok) return;
    try {
      await artistService.delete(artistId);
      setArtists(artists.filter(a => a._id !== artistId));
    } catch (err) {
      setError(err.message || 'Failed to delete artist');
    }
  };

  const handleSave = (updated) => {
    setArtists(artists.map(a => a._id === updated._id ? updated : a));
    setEditingArtist(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen w-full text-primary-text">Loading...</div>;
  }

  return (
    <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      {editingArtist && (
        <EditArtistModal
          artist={editingArtist}
          onClose={() => setEditingArtist(null)}
          onSave={handleSave}
        />
      )}

      <div className="px-4 py-2 sm:px-0">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-primary-text">Manage Artists</h1>
          <button
            onClick={() => navigate('/admin/manage/artists/add')}
            className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-primary-bg font-semibold py-2 px-5 rounded-full transition-colors"
          >
            <Plus size={18} />
            Add Artist
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
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">Artist</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">Bio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-text/20">
              {artists.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-text">No artists found</td>
                </tr>
              ) : (
                artists.map((artist) => (
                  <tr key={artist._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {artist.profileImageURL ? (
                          <img src={artist.profileImageURL} alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                            {artist.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm font-medium text-primary-text">{artist.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-text max-w-xs truncate">
                      {artist.bio || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setEditingArtist(artist)}
                          className="text-muted-text/60 hover:text-accent transition-colors"
                          title="Edit artist"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          onClick={() => handleDelete(artist._id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          title="Delete artist"
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
