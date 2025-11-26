export interface DownloadLink {
  label: string;
  url: string;
  quality?: string;
  type: 'video' | 'image' | 'audio' | 'file';
  size?: string;
}

export interface UnifiedResult {
  success: boolean;
  platform: string;
  title?: string;
  author?: string;
  thumbnail?: string;
  downloads: DownloadLink[];
  error?: string;
}

// Raw API Response Types (Partial)
export interface InstagramResponse {
  success: boolean;
  urls?: string[];
  error?: string;
}

export interface FacebookResponse {
  success: boolean;
  hd?: string;
  sd?: string;
  audio?: string;
  error?: string;
}

export interface SpotifyResponse {
  success: boolean;
  download_url?: string;
  name?: string;
  artists?: string[];
  image?: string;
  error?: string;
}

export interface TikTokResponse {
  success: boolean;
  data?: {
    title?: string;
    thumbnail?: string;
    downloadLinks?: { link: string; text: string }[];
  }[];
  error?: string;
}

export interface YouTubeResponse {
  success: boolean;
  data?: {
    title?: string;
    downloadUrl?: string;
    fileSize?: string;
    format?: string;
  }[];
  error?: string;
}

export interface XResponse {
  success: boolean;
  found?: boolean;
  media?: { url: string; type: string }[];
  authorName?: string;
  error?: string;
}

export interface MediaFireResponse {
  success: boolean;
  download?: string;
  name?: string;
  size?: string;
  error?: string;
}

export interface PinterestResponse {
  source?: string; // 'pinterest'
  title?: string;
  medias?: { url: string; quality: string; extension: string; formattedSize: string }[];
  error?: string;
}