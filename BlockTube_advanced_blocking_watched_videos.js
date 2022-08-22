// Block watched videos in certain pages
(video, objectType) => {
  const hideVideosWatchedMoreThanPercentage = 90; 
  
  // Block only in certain pages
  const blockedPathnames = [
    /^\/$/                      // homepage
    , /\/feed\/subscriptions/   // subscriptions
    , /\/watch/                 // recommendations side panel
  ];
  if (!blockedPathnames.some(p => p.test(window.location.pathname)))
    return false;
  
  // Block only watched videos
  if (video.percentWatched === undefined || parseInt(video.percentWatched) < hideVideosWatchedMoreThanPercentage)
    return false;
  
  console.log(`BlockTube custom blocking function: "${video.title}" (${video.percentWatched}% watched)`);
  return true;
}