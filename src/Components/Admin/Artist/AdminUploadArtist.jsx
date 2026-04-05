import { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { artistService } from '../../../Services/artistService';

export default function AdminUploadArtist() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    if (!window.confirm('Are you sure you want to delete this artist?')) return;
    try {
      await artistService.delete(artistId);
      setArtists(artists.filter(a => a._id !== artistId));
    } catch (err) {
      setError(err.message || 'Failed to delete artist');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen w-full text-primary-text">Loading...</div>;
  }

  return (
    <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                      <button
                        onClick={() => handleDelete(artist._id)}
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
