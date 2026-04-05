import { useState } from "react";
import { createPlaylist } from "../Services/playlistService";
import { Loader2, Check, X } from "lucide-react";

export const CreatePlaylist = ({ onClose, onCreated }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Playlist name is required');
            return;
        }
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const result = await createPlaylist(name.trim());
            setSuccess('Playlist created successfully!');
            setName('');
            if (onCreated) onCreated(result);
            setTimeout(() => {
                onClose?.();
            }, 1200);
        } catch (err) {
            setError(err.message || 'Failed to create playlist');
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-primary-bg/70 backdrop-blur-sm"
            onClick={handleBackdropClick}
            onKeyDown={(e) => e.key === 'Escape' && onClose?.()}
        >
            <div className="relative w-full max-w-md mx-4 bg-section-bg rounded-2xl shadow-2xl border border-accent/10 overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                    <h2 className="text-xl font-bold text-primary-text">Create Playlist</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-muted-text hover:text-primary-text hover:bg-primary-bg/50 transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-4">
                    {success && (
                        <div className="bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                            <Check size={18} />
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="playlist-name" className="block text-sm font-medium text-muted-text mb-2">
                            Playlist Name
                        </label>
                        <input
                            id="playlist-name"
                            type="text"
                            placeholder="My awesome playlist"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                            className="w-full px-4 py-3 bg-primary-bg/60 border border-muted-text/20 rounded-lg text-primary-text placeholder-muted-text/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-full border border-muted-text/20 text-muted-text hover:text-primary-text hover:border-muted-text/40 font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-accent hover:bg-accent/80 text-primary-bg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Create'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};