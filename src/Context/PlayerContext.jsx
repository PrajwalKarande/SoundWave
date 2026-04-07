import { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

const PlayerContext = createContext(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};

// True Shuffle helper (Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  
  const [queue, setQueue] = useState([]);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'

  const audio = audioRef.current;

  // Sync volume
  useEffect(() => {
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted, audio]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    let nextIndex = queueIndex + 1;
    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }
    setQueueIndex(nextIndex);
    const nextSong = queue[nextIndex];
    if (nextSong) {
      setCurrentSong(nextSong);
      if (nextSong.url) {
        audio.src = nextSong.url;
        audio.load();
        audio.play().catch(console.error);
      }
    }
  }, [queue, queueIndex, repeatMode, audio]);

  // Audio event listeners
  useEffect(() => {
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [repeatMode, queue, queueIndex, audio, playNext]);

  const playSong = useCallback((song, songList = [], index = 0) => {
    const url = song?.url
    
    // Normalize song list ensuring every song has a 'url' property
    let baseList = songList.length > 0 
      ? songList.map(s => ({ ...s, url: s.url })) 
      : [{ ...song, url: url }];
      
    if (!url) {
      baseList = songList.length > 0 ? songList : [song];
    }

    setOriginalQueue(baseList);

    // If starting play while shuffled is true, we should scramble the upcoming queue immediately
    if (isShuffled && baseList.length > 1) {
      const playingIndex = songList.length > 0 ? index : 0;
      const firstSong = baseList[playingIndex];
      
      const listWithoutCurrent = [...baseList];
      listWithoutCurrent.splice(playingIndex, 1);
      
      const shuffled = shuffleArray(listWithoutCurrent);
      setQueue([firstSong, ...shuffled]);
      setQueueIndex(0);
    } else {
      setQueue(baseList);
      setQueueIndex(songList.length > 0 ? index : 0);
    }
    
    // Maintain state setting
    const formattedSong = url ? { ...song, url: url } : song;
    setCurrentSong(formattedSong);
    
    if (url) {
      audio.src = url;
      audio.load();
      audio.play().catch(console.error);
    }
  }, [audio, isShuffled]);

  const togglePlay = useCallback(() => {
    if (!currentSong) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  }, [currentSong, isPlaying, audio]);

  const seek = useCallback((time) => {
    audio.currentTime = time;
    setCurrentTime(time);
  }, [audio]);

  const playPrev = useCallback(() => {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    if (queue.length === 0) return;
    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      if (repeatMode === 'all') {
        prevIndex = queue.length - 1;
      } else {
        audio.currentTime = 0;
        return;
      }
    }
    setQueueIndex(prevIndex);
    const prevSong = queue[prevIndex];
    if (prevSong) {
      setCurrentSong(prevSong);
      if (prevSong.url) {
        audio.src = prevSong.url;
        audio.load();
        audio.play().catch(console.error);
      }
    }
  }, [queue, queueIndex, repeatMode, audio]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    if (!isShuffled) {
      // Turn Shuffle ON
      if (originalQueue.length > 1 && currentSong) {
        const currentSongItem = queue[queueIndex];
        
        let indexInOriginal = originalQueue.findIndex(s => s === currentSongItem);
        if (indexInOriginal === -1 && currentSongItem) {
          indexInOriginal = originalQueue.findIndex(s => s.url === currentSongItem.url);
        }
        
        const listToShuffle = [...originalQueue];
        if (indexInOriginal !== -1) {
          listToShuffle.splice(indexInOriginal, 1);
        } else if (listToShuffle.length > 0) {
          listToShuffle.splice(0, 1);
        }
        
        const shuffled = shuffleArray(listToShuffle);
        setQueue([currentSongItem, ...shuffled]);
        setQueueIndex(0);
      }
      setIsShuffled(true);
    } else {
      // Turn Shuffle OFF
      const currentSongItem = queue[queueIndex];
      setQueue([...originalQueue]);
      
      let newIndex = originalQueue.findIndex(s => s === currentSongItem);
      if (newIndex === -1 && currentSongItem) {
        newIndex = originalQueue.findIndex(s => s.url === currentSongItem.url);
      }
      
      setQueueIndex(Math.max(0, newIndex));
      setIsShuffled(false);
    }
  }, [isShuffled, queue, queueIndex, originalQueue, currentSong]);

  const cycleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const playAtIndex = useCallback((index) => {
    if (index < 0 || index >= queue.length) return;
    const song = queue[index];
    if (!song) return;
    setQueueIndex(index);
    setCurrentSong(song);
    if (song.url) {
      audio.src = song.url;
      audio.load();
      audio.play().catch(console.error);
    }
  }, [queue, audio]);

  const clearPlayer = useCallback(() => {
    audio.pause();
    audio.src = '';
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setQueue([]);
    setOriginalQueue([]);
    setQueueIndex(-1);
  }, [audio]);


  const value = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    queue,
    queueIndex,
    playSong,
    playAtIndex,
    togglePlay,
    seek,
    playNext,
    playPrev,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    clearPlayer,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
