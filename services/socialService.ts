import {
  UnifiedResult,
  DownloadLink,
  InstagramResponse,
  FacebookResponse,
  SpotifyResponse,
  TikTokResponse,
  YouTubeResponse,
  XResponse,
  MediaFireResponse,
  PinterestResponse
} from '../types';

const API_BASE_URL = "https://socialdown.itz-ashlynn.workers.dev";

// Helper to determine platform from URL
export const detectPlatform = (url: string): string | null => {
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'x';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('spotify.com')) return 'spotify';
  if (url.includes('pinterest.com') || url.includes('pin.it')) return 'pinterest';
  if (url.includes('mediafire.com')) return 'mediafire';
  if (url.includes('capcut.com')) return 'capcut';
  if (url.includes('soundcloud.com')) return 'soundcloud';
  if (url.includes('threads.net')) return 'threads';
  return null;
};

// Generic Fetch Wrapper
const fetchData = async <T>(endpoint: string, url: string, params: Record<string, string> = {}): Promise<T> => {
  const query = new URLSearchParams({ url, ...params });
  const response = await fetch(`${API_BASE_URL}/${endpoint}?${query.toString()}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
};

// Transformers to normalize data into UnifiedResult

const transformInstagram = (data: InstagramResponse): UnifiedResult => {
  if (!data.success || !data.urls) throw new Error(data.error || 'No media found');
  return {
    success: true,
    platform: 'Instagram',
    title: 'Instagram Post',
    downloads: data.urls.map((url, index) => ({
      label: `Download Media ${index + 1}`,
      url: url,
      type: 'video' // Assumed, mostly video/image mixed
    }))
  };
};

const transformFacebook = (data: FacebookResponse): UnifiedResult => {
  if (!data.success) throw new Error(data.error || 'No media found');
  const downloads: DownloadLink[] = [];
  if (data.hd) downloads.push({ label: 'HD Video', url: data.hd, type: 'video', quality: 'HD' });
  if (data.sd) downloads.push({ label: 'SD Video', url: data.sd, type: 'video', quality: 'SD' });
  if (data.audio) downloads.push({ label: 'Audio Only', url: data.audio, type: 'audio' });
  
  if (downloads.length === 0) throw new Error('No download links returned');

  return {
    success: true,
    platform: 'Facebook',
    title: 'Facebook Video',
    downloads
  };
};

const transformSpotify = (data: SpotifyResponse): UnifiedResult => {
  if (!data.success || !data.download_url) throw new Error(data.error || 'No track found');
  return {
    success: true,
    platform: 'Spotify',
    title: data.name || 'Spotify Track',
    author: data.artists?.join(', '),
    thumbnail: data.image,
    downloads: [{ label: 'Download MP3', url: data.download_url, type: 'audio' }]
  };
};

const transformTikTok = (data: TikTokResponse): UnifiedResult => {
  if (!data.success || !data.data || data.data.length === 0) throw new Error(data.error || 'No video found');
  const video = data.data[0];
  if (!video.downloadLinks) throw new Error('No download links found');

  return {
    success: true,
    platform: 'TikTok',
    title: video.title || 'TikTok Video',
    thumbnail: video.thumbnail,
    downloads: video.downloadLinks.map(link => ({
      label: link.text || 'Download',
      url: link.link,
      type: 'video'
    }))
  };
};

const transformYouTubeCombined = (mp4Data: YouTubeResponse | null, mp3Data: YouTubeResponse | null): UnifiedResult => {
  const mp4Valid = mp4Data?.success && mp4Data?.data && mp4Data.data.length > 0;
  const mp3Valid = mp3Data?.success && mp3Data?.data && mp3Data.data.length > 0;

  if (!mp4Valid && !mp3Valid) {
    throw new Error(mp4Data?.error || mp3Data?.error || 'Video not found');
  }

  // Prefer MP4 metadata
  const meta = mp4Valid ? mp4Data!.data![0] : mp3Data!.data![0];
  const downloads: DownloadLink[] = [];

  if (mp4Valid) {
    const v = mp4Data!.data![0];
    if (v.downloadUrl) {
      downloads.push({
        label: `Download Video (MP4) ${v.fileSize ? `(${v.fileSize})` : ''}`,
        url: v.downloadUrl,
        type: 'video'
      });
    }
  }

  if (mp3Valid) {
    const a = mp3Data!.data![0];
    if (a.downloadUrl) {
      downloads.push({
        label: `Download Audio (MP3) ${a.fileSize ? `(${a.fileSize})` : ''}`,
        url: a.downloadUrl,
        type: 'audio'
      });
    }
  }

  return {
    success: true,
    platform: 'YouTube',
    title: meta.title || 'YouTube Video',
    downloads
  };
};

const transformX = (data: XResponse): UnifiedResult => {
  if (!data.success || !data.found || !data.media) throw new Error(data.error || 'Tweet not found');
  
  return {
    success: true,
    platform: 'X (Twitter)',
    title: `Post by ${data.authorName || 'User'}`,
    downloads: data.media.map((item, idx) => ({
      label: `Download ${item.type} ${idx + 1}`,
      url: item.url,
      type: item.type as any
    }))
  };
};

const transformMediaFire = (data: MediaFireResponse): UnifiedResult => {
  if (!data.success || !data.download) throw new Error(data.error || 'File not found');
  
  return {
    success: true,
    platform: 'MediaFire',
    title: data.name || 'File',
    downloads: [{
      label: `Download File (${data.size || 'Unknown'})`,
      url: data.download,
      type: 'file'
    }]
  };
};

const transformPinterest = (data: PinterestResponse): UnifiedResult => {
  // Pinterest endpoint returns source: 'pinterest' on success
  if (data.source !== 'pinterest' || !data.medias) throw new Error(data.error || 'Pin not found');
  
  return {
    success: true,
    platform: 'Pinterest',
    title: data.title || 'Pinterest Pin',
    downloads: data.medias.map(item => ({
      label: `Download ${item.quality} (${item.extension})`,
      url: item.url,
      type: item.extension === 'mp4' ? 'video' : 'image',
      size: item.formattedSize
    }))
  };
};

// Main Processor
export const processUrl = async (url: string): Promise<UnifiedResult> => {
  const platform = detectPlatform(url);
  
  try {
    switch (platform) {
      case 'instagram':
        return transformInstagram(await fetchData<InstagramResponse>('insta', url));
      case 'facebook':
        return transformFacebook(await fetchData<FacebookResponse>('fb', url));
      case 'spotify':
        return transformSpotify(await fetchData<SpotifyResponse>('spotify', url));
      case 'tiktok':
        return transformTikTok(await fetchData<TikTokResponse>('tiktok', url));
      case 'x':
        return transformX(await fetchData<XResponse>('x', url));
      case 'youtube':
        // Fetch both MP4 and MP3 formats in parallel
        const [mp4Res, mp3Res] = await Promise.allSettled([
          fetchData<YouTubeResponse>('yt', url, { format: 'mp4' }),
          fetchData<YouTubeResponse>('yt', url, { format: 'mp3' })
        ]);
        
        const mp4Data = mp4Res.status === 'fulfilled' ? mp4Res.value : null;
        const mp3Data = mp3Res.status === 'fulfilled' ? mp3Res.value : null;

        return transformYouTubeCombined(mp4Data, mp3Data);

      case 'mediafire':
        return transformMediaFire(await fetchData<MediaFireResponse>('mediafire', url));
      case 'pinterest':
        return transformPinterest(await fetchData<PinterestResponse>('pinterest', url));
      case 'capcut':
      case 'soundcloud':
      case 'threads':
        // These platforms often return data without direct download links in this specific API or are inconsistent.
        throw new Error(`${platform.charAt(0).toUpperCase() + platform.slice(1)} support is currently limited to preview only.`);
      default:
        throw new Error("Unsupported platform or invalid URL.");
    }
  } catch (err: any) {
    console.error("Processing Error:", err);
    return {
      success: false,
      platform: platform || 'Unknown',
      downloads: [],
      error: err.message || "Failed to process URL"
    };
  }
};