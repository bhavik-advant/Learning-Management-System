export const getEmbedUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace('www.', '');

    if (hostname === 'youtu.be') {
      const videoId = parsedUrl.pathname.split('/').filter(Boolean)[0];
      if (!videoId) return url;

      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      const videoId = parsedUrl.searchParams.get('v');

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      if (parsedUrl.pathname.startsWith('/shorts/')) {
        const shortsId = parsedUrl.pathname.split('/').filter(Boolean)[1];
        if (shortsId) {
          return `https://www.youtube.com/embed/${shortsId}`;
        }
      }
    }

    return url;
  } catch {
    return url;
  }
};