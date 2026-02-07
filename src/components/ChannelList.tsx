'use client';

import Link from 'next/link';
import { Channel } from '@/data/channels';

interface ChannelListProps {
  channels: Channel[];
  activeChannelId?: string;
  onChannelSelect?: (channel: Channel) => void;
}

export default function ChannelList({
  channels,
  activeChannelId,
  onChannelSelect,
}: ChannelListProps) {
  const handleChannelClick = (channel: Channel) => {
    onChannelSelect?.(channel);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-3 border-b border-slate-700">
        <h3 className="text-white font-semibold text-sm md:text-base">📺 Channels</h3>
        <p className="text-slate-400 text-xs mt-1">{channels.length} channels available</p>
      </div>

      {/* Channel List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-3 md:p-4">
        {channels.map((channel) => (
          <Link key={channel.id} href={`/watch/${channel.id}`}>
            <button
              onClick={() => handleChannelClick(channel)}
              className={`w-full p-3 md:p-4 rounded-lg transition-all duration-200 text-left ${
                activeChannelId === channel.id
                  ? 'bg-blue-600 border-2 border-blue-400 shadow-lg shadow-blue-500/50 scale-105'
                  : 'bg-slate-700 border border-slate-600 hover:bg-slate-600 hover:border-slate-500 active:scale-95'
              }`}
            >
              {/* Channel Logo/Icon */}
              <div className="text-2xl md:text-3xl mb-2">{channel.logo || '📡'}</div>

              {/* Channel Name */}
              <h4 className="text-white font-semibold text-sm truncate">{channel.name}</h4>

              {/* Active Indicator */}
              {activeChannelId === channel.id && (
                <div className="mt-2 flex items-center gap-1 text-blue-200 text-xs">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Now Playing
                </div>
              )}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
