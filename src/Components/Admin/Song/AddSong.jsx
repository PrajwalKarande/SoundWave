// src/Components/Admin/Song/AddSong.jsx
import { useState } from 'react';
import { Upload, Music, Image, X, Plus, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../Services/api';
import './AdminUploadSong.css';

export default function AddSong() {
  const [formData, setFormData] = useState({
    title: '',
    artists: [''],
    genres: [],
  });
  const [audioFile, setAudioFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const availableGenres = [
    'Romance', 'Bollywood', 'Soft', 'Pop', 'Rock', 'Hip Hop',
    'Jazz', 'Classical', 'Electronic', 'R&B', 'Country', 'Indie', 'Blues','Hindi','English'
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArtistChange = (index, value) => {
    const newArtists = [...formData.artists];
    newArtists[index] = value;
    setFormData({ ...formData, artists: newArtists });
  };

  const addArtist = () => {
    setFormData({ ...formData, artists: [...formData.artists, ''] });
  };

  const removeArtist = (index) => {
    const newArtists = formData.artists.filter((_, i) => i !== index);
    setFormData({ ...formData, artists: newArtists });
  };

  const toggleGenre = (genre) => {
    const newGenres = formData.genres.includes(genre)
      ? formData.genres.filter((g) => g !== genre)
      : [...formData.genres, genre];
    setFormData({ ...formData, genres: newGenres });
  };

  const getAudioDuration = (file) =>
    new Promise((resolve) => {
      const audio = document.createElement('audio');
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => resolve(Math.round(audio.duration));
    });

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError('Audio file must be less than 50MB');
        return;
      }
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Cover image must be less than 5MB');
        return;
      }
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Song title is required');
      setLoading(false);
      return;
    }
    if (formData.artists.filter((a) => a.trim()).length === 0) {
      setError('At least one artist is required');
      setLoading(false);
      return;
    }
    if (formData.genres.length === 0) {
      setError('At least one genre is required');
      setLoading(false);
      return;
    }
    if (!audioFile) {
      setError('Audio file is required');
      setLoading(false);
      return;
    }
    if (!coverImage) {
      setError('Cover image is required');
      setLoading(false);
      return;
    }

    try {
      const duration = await getAudioDuration(audioFile);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('artist', formData.artists.filter((a) => a.trim()).join(','));
      formDataToSend.append('genre', formData.genres.filter((g) => g.trim()).join(','));
      formDataToSend.append('audio', audioFile);
      formDataToSend.append('coverImage', coverImage);
      formDataToSend.append('duration', duration);

      await api.post('/songs/upload', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Song uploaded successfully!');
      setFormData({ title: '', artists: [''], genres: [] });
      setAudioFile(null);
      setCoverImage(null);
      setAudioPreview(null);
      setCoverPreview(null);
      setTimeout(() => navigate('/admin/manage/songs'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload song');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">

        <button
          onClick={() => navigate('/admin/manage/songs')}
          className="flex items-center gap-1 text-muted-text hover:text-primary-text mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Songs
        </button>

        <h1 className="text-4xl font-bold mb-8 text-primary-text">Upload New Song</h1>

        {success && (
          <div className="mb-6 bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded flex items-center">
            <Check className="mr-2" size={20} />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-section-bg rounded-xl p-6 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Song Title */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary-text">Song Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter song title"
                className="w-full px-4 py-3 rounded-lg bg-primary-bg border border-muted-text/30 focus:border-accent focus:outline-none text-primary-text placeholder:text-muted-text"
              />
            </div>

            {/* Artists */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary-text">Artists *</label>
              {formData.artists.map((artist, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => handleArtistChange(index, e.target.value)}
                    placeholder="Artist name"
                    className="flex-1 px-4 py-3 rounded-lg bg-primary-bg border border-muted-text/30 focus:border-accent focus:outline-none text-primary-text placeholder:text-muted-text"
                  />
                  {formData.artists.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArtist(index)}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addArtist}
                className="flex items-center text-accent hover:text-accent/80 text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add Artist
              </button>
            </div>

            {/* Genres */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary-text">Genres * (Select at least one)</label>
              <div className="flex flex-wrap gap-2">
                {availableGenres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.genres.includes(genre)
                        ? 'bg-accent text-primary-bg'
                        : 'bg-primary-bg text-muted-text hover:bg-primary-bg/80 hover:text-primary-text'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio File Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary-text">Audio File * (MP3, WAV — Max 50MB)</label>
              <div className="border-2 border-dashed border-muted-text/30 rounded-lg p-8 text-center hover:border-accent transition-colors">
                {audioPreview ? (
                  <div className="space-y-4">
                    <Music className="mx-auto text-accent" size={48} />
                    <p className="text-sm text-muted-text">{audioFile.name}</p>
                    <audio controls src={audioPreview} className="w-full" />
                    <button
                      type="button"
                      onClick={() => { setAudioFile(null); setAudioPreview(null); }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="mx-auto mb-4 text-muted-text" size={48} />
                    <p className="text-muted-text mb-2">Click to upload or drag and drop</p>
                    <input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary-text">Cover Image * (JPG, PNG — Max 5MB)</label>
              <div className="border-2 border-dashed border-muted-text/30 rounded-lg p-8 text-center hover:border-accent transition-colors">
                {coverPreview ? (
                  <div className="space-y-4">
                    <img src={coverPreview} alt="Cover preview" className="w-48 h-48 mx-auto rounded-lg object-cover" />
                    <p className="text-sm text-muted-text">{coverImage.name}</p>
                    <button
                      type="button"
                      onClick={() => { setCoverImage(null); setCoverPreview(null); }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Image className="mx-auto mb-4 text-muted-text" size={48} />
                    <p className="text-muted-text mb-2">Click to upload or drag and drop</p>
                    <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/80 text-primary-bg font-bold py-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload Song'}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}
