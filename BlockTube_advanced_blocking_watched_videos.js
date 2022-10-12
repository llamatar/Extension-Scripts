// Block watched videos in certain pages
(video, objectType) => {
  //console.log(video);
  
  const hideVideosWatchedMoreThanPercentage = 80; 
  
  // Do not block videos in pages other than blockedPathnames
  const blockedPathnames = [
    /^\/$/                      // homepage
    , /\/feed\/subscriptions/   // subscriptions
    , /\/watch/                 // related videos sidebar
  ];
  if (!blockedPathnames.some(blockedPathname => blockedPathname.test(window.location.pathname)))
    return false;
  
  // Do not block unwatched videos
  if (video.percentWatched === undefined || parseInt(video.percentWatched) < hideVideosWatchedMoreThanPercentage)
    return false;
  
  // Do not block videos in playlists
  if (objectType === "playlistPanelVideoRenderer")
    return false;
  
  console.log(`BlockTube custom blocking function: "${video.title}" (${video.percentWatched}% watched)`);
  //console.log(video);
  //console.log(objectType);
  //console.log(window);
  return true;
}