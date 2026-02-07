// IPTV Channel Configuration
// Add or modify channels here for your streaming service

export interface Channel {
  id: string;
  name: string;
  streamUrl: string;
  logo?: string;
}

export const CHANNELS: Channel[] = [
  {
    id: 'ptv-main',
    name: 'PAKISTAN TV',
    streamUrl: 'http://192.168.6.7:8000/play/a00e/index.m3u8',
    logo: '📺',
  },
  {
    id: 'ptv-home',
    name: 'PTV Home',
    streamUrl: 'http://192.168.6.7:8000/play/a00c/index.m3u8',
    logo: '🏠',
  },
  {
    id: 'ptv-news',
    name: 'PTV News HD',
    streamUrl: 'http://192.168.6.7:8000/play/a00d/index.m3u8',
    logo: '📰',
  },
  {
    id: 'ptv-sports',
    name: 'PTV Sports HD',
    streamUrl: 'http://192.168.6.7:8000/play/a00b/index.m3u8',
    logo: '⚽',
  },
];

// Helper function to get channel by ID
export const getChannelById = (id: string): Channel | undefined => {
  return CHANNELS.find((channel) => channel.id === id);
};
