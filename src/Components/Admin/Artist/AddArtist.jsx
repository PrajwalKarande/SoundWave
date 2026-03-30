import { useState } from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { artistService } from '../../../Services/artistService';

export default function AddArtist() {
  const [formData, setFormData] = useState({ name: '', bio: '', profileImageURL: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Artist name is required');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting artist:', formData);
      await artistService.create(formData);
      setSuccess('Artist added successfully!');
      setFormData({ name: '', bio: '', profileImageURL: '' });
      setTimeout(() => navigate('/admin/manage/artists'), 1000);
    } catch (err) {
      setError(err.message || 'Failed to add artist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">

        <button
          onClick={() => navigate('/admin/manage/artists')}
          className="flex items-center gap-1 text-muted-text hover:text-primary-text mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Artists
        </button>

        <h1 className="text-4xl font-bold mb-8 text-primary-text">Add New Artist</h1>

        {success && (
          <div className="mb-4 bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded flex items-center" onClick={() => setSuccess('')}>
            <Check className="mr-2" size={20} />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded" onClick={() => setError('')}>
            {error}
          </div>
        )}

        <div className="bg-section-bg rounded-xl p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-primary-text">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Artist name"
                className="w-full px-4 py-3 rounded-lg bg-primary-bg border border-muted-text/30 focus:border-accent focus:outline-none text-primary-text placeholder:text-muted-text"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-primary-text">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Short biography"
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-primary-bg border border-muted-text/30 focus:border-accent focus:outline-none text-primary-text placeholder:text-muted-text resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-primary-text">Profile Image URL</label>
              <input
                type="url"
                name="profileImageURL"
                value={formData.profileImageURL}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-lg bg-primary-bg border border-muted-text/30 focus:border-accent focus:outline-none text-primary-text placeholder:text-muted-text"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-accent/80 text-primary-bg font-bold py-3 px-8 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Artist'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
