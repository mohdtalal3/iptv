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
  const hlsRef = useRef<HLS | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useNativePlayback, setUseNativePlayback] = useState(false);

  // Detect if browser supports native HLS
  useEffect(() => {
    const video = document.createElement('video');
    const canPlayHLS = video.canPlayType('application/vnd.apple.mpegurl') !== '';
    if (canPlayHLS) {
      setUseNativePlayback(true);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setError(null);

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Use native HLS playback for Safari/iOS or if forced
    if (useNativePlayback) {
      video.src = streamUrl;
      
      const handleCanPlay = () => {
        setIsLoading(false);
        if (autoPlay) {
          video.play().catch((err) => console.warn('Autoplay blocked:', err));
        }
      };
      
      const handleError = () => {
        setError('Failed to load stream. Try another channel.');
        setIsLoading(false);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }

    // Use hls.js for other browsers
    if (!HLS.isSupported()) {
      // Fallback to native playback
      video.src = streamUrl;
      video.addEventListener('canplay', () => setIsLoading(false));
      video.addEventListener('error', () => {
        setError('HLS streaming not supported in this browser');
        setIsLoading(false);
      });
      return;
    }

    const hls = new HLS({
      // Disable debug and workers
      debug: false,
      enableWorker: true,
      
      // Conservative buffering to reduce requests
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      backBufferLength: 60, // Reduced from 90
      maxBufferSize: 60 * 1000 * 1000,
      maxBufferHole: 3, // Increased tolerance
      
      // Minimal live sync - allows more drift to reduce polling
      liveSyncDurationCount: 6, // Increased from 3 - less aggressive
      liveMaxLatencyDurationCount: 12, // Increased - tolerate more lag
      maxLiveSyncPlaybackRate: 1, // No speed changes
      
      // Reduce polling frequency
      highBufferWatchdogPeriod: 3, // Increased from 2
      nudgeOffset: 0.5, // Increased from 0.1
      nudgeMaxRetry: 2, // Reduced from 3
      maxFragLookUpTolerance: 1.0, // More tolerant
      
      // Slower ABR decisions = fewer level switches = fewer requests
      abrEwmaFastLive: 5.0, // Slower from 3.0
      abrEwmaSlowLive: 12.0, // Slower from 9.0
      abrEwmaFastVoD: 5.0,
      abrEwmaSlowVoD: 12.0,
      abrEwmaDefaultEstimate: 500000,
      abrBandWidthFactor: 0.95,
      abrBandWidthUpFactor: 0.7,
      
      // Minimal retries
      maxStarvationDelay: 6, // Increased from 4
      maxLoadingDelay: 6, // Increased from 4
      manifestLoadingTimeOut: 15000, // Increased from 10000
      manifestLoadingMaxRetry: 1, // Minimal retries
      manifestLoadingRetryDelay: 3000, // Longer delay
      levelLoadingTimeOut: 15000,
      levelLoadingMaxRetry: 1,
      fragLoadingTimeOut: 30000, // Increased from 20000
      fragLoadingMaxRetry: 2,
      
      // Disable all unnecessary features
      lowLatencyMode: false,
      enableWebVTT: false,
      enableIMSC1: false,
      enableCEA708Captions: false,
      emeEnabled: false,
      stretchShortVideoTrack: false,
      liveDurationInfinity: false,
      
      // Other settings
      maxAudioFramesDrift: 2, // More tolerant
      forceKeyFrameOnDiscontinuity: true,
      minAutoBitrate: 0,
      startLevel: -1,
      
      xhrSetup: function (xhr: any) {
        xhr.withCredentials = false;
      },
    });

    hlsRef.current = hls;
    hls.loadSource(streamUrl);
    hls.attachMedia(video);

    // Handle manifest parsed
    hls.on(HLS.Events.MANIFEST_PARSED, () => {
      setIsLoading(false);
      if (autoPlay) {
        video.play().catch((err) => console.warn('Autoplay blocked:', err));
      }
    });

    // Handle fragment loaded
    let firstFragmentLoaded = false;
    hls.on(HLS.Events.FRAG_LOADED, () => {
      if (!firstFragmentLoaded && autoPlay && video.paused) {
        firstFragmentLoaded = true;
        video.play().catch(() => {});
      }
    });

    // Enhanced error handling
    hls.on(HLS.Events.ERROR, (event, data) => {
      // Ignore non-fatal buffer holes
      if (data.details === 'bufferSeekOverHole') {
        return;
      }
      
      if (data.fatal) {
        switch (data.type) {
          case HLS.ErrorTypes.NETWORK_ERROR:
            // Network error - try to recover by restarting load
            hls.startLoad();
            break;
            
          case HLS.ErrorTypes.MEDIA_ERROR:
            // Media error - try to recover
            hls.recoverMediaError();
            
            // If still failing after 2 seconds, fallback to native
            setTimeout(() => {
              if (video.error) {
                console.warn('Media error persists, trying native playback');
                setUseNativePlayback(true);
              }
            }, 2000);
            break;
            
          default:
            // Fatal error - show message to user
            setError('Unable to play this stream. Try another channel.');
            setIsLoading(false);
        }
      }
    });

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamUrl, useNativePlayback, autoPlay]);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {/* Video Container - Full width, no aspect ratio constraint */}
      <div className="relative w-full" style={{ minHeight: '400px' }}>
        <video
          ref={videoRef}
          className="w-full h-full"
          style={{ minHeight: '400px', maxHeight: '80vh' }}
          controls
          playsInline
          muted={false}
          preload="auto"
          crossOrigin="anonymous"
          autoPlay
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
