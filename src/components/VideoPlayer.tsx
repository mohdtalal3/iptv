'use client';

import { useEffect, useRef, useState } from 'react';
import HLS from 'hls.js';

interface VideoPlayerProps {
  streamUrl: string;
  title: string;
  autoPlay?: boolean;
}

export default function VideoPlayer({ streamUrl, title, autoPlay = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSafari, setIsSafari] = useState(false);

  // Detect Safari browser for native HLS support
  useEffect(() => {
    const ua = navigator.userAgent;
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(ua);
    setIsSafari(isSafariBrowser);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setError(null);

    // Safari supports HLS natively, use direct playback
    if (isSafari) {
      video.src = streamUrl;
      video.addEventListener('canplay', () => setIsLoading(false));
      video.addEventListener('error', () => {
        setError('Failed to load stream');
        setIsLoading(false);
      });
      if (autoPlay) {
        video.play().catch(() => {
          // Autoplay might be blocked, user needs to interact
          console.warn('Autoplay blocked. User interaction required.');
        });
      }
      return;
    }

    // Use hls.js for other browsers
    if (!HLS.isSupported()) {
      setError('HLS streaming not supported in this browser');
      setIsLoading(false);
      return;
    }

    const hls = new HLS({
      debug: false,
      enableWorker: true,
      lowLatencyMode: true,
    });

    hls.loadSource(streamUrl);
    hls.attachMedia(video);

    // Handle manifest parsed event
    hls.on(HLS.Events.MANIFEST_PARSED, () => {
      setIsLoading(false);
      if (autoPlay) {
        video
          .play()
          .catch(() => {
            console.warn('Autoplay blocked. User interaction required.');
          });
      }
    });

    // Handle errors
    hls.on(HLS.Events.ERROR, (event, data) => {
      if (data.fatal) {
        switch (data.type) {
          case HLS.ErrorTypes.NETWORK_ERROR:
            setError('Network error. Check your connection.');
            break;
          case HLS.ErrorTypes.MEDIA_ERROR:
            setError('Media error. Stream format may be incompatible.');
            break;
          default:
            setError('Stream error. Please try again.');
        }
      }
    });

    // Cleanup
    return () => {
      hls.destroy();
    };
  }, [streamUrl, isSafari, autoPlay]);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative w-full pb-[56.25%]">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full"
          controls
          playsInline
        />

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-white text-sm">Loading stream...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center">
              <p className="text-red-400 font-semibold mb-2">⚠️ Error</p>
              <p className="text-white text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Channel Title */}
      <div className="p-3 bg-gradient-to-r from-blue-900 to-blue-800">
        <h2 className="text-white font-semibold text-sm md:text-base truncate">{title}</h2>
      </div>
    </div>
  );
}
