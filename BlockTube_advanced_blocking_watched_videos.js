(video, objectType) => {
  const blockVideosWithLessThanViews = 100;
  const blockVideosWatchedMoreThanPercentage = 75;
  const allowVideosPublishedYearsAgo = 10;

  //console.log(video);
  
  // Allow videos in all pages other than blockablePages
  const blockablePages = [
    /^\/$/                      // homepage (exactly "/")
    , /\/feed\/subscriptions/   // subscriptions (contains "/feed/subscriptions")
    , /\/watch/                 // related videos sidebar (contains "/watch")
  ];
  if (!blockablePages.some(page => page.test(window.location.pathname)))
    return false;
  
  // Block recommended videos with few views, even if unwatched
  if (/\/watch/.test(window.location.pathname) 
      && typeof video.viewCount !== "undefined" 
      && (isNaN(video.viewCount) || video.viewCount < blockVideosWithLessThanViews)) {
    console.log(`BlockTube: ${video.viewCount} < ${blockVideosWithLessThanViews} views`, video);
    return true;
  }
  
  // Allow unwatched videos
  if (video.percentWatched === undefined || parseInt(video.percentWatched) <= blockVideosWatchedMoreThanPercentage)
    return false;
  
  // Allow live livestreams
  if (video.hasOwnProperty("badges") && video.badges.includes("live"))
    return false;
  
  // Allow published livestreams
  if (video.publishTimeText.indexOf("Streamed") != -1)
    return false;
  
  // Allow videos in playlists
  if (objectType === "playlistPanelVideoRenderer")
    return false;
  
  // Allow videos published many years ago
  if (video.hasOwnProperty("publishTimeText") 
      && /year/.test(video.publishTimeText) 
      && video.publishTimeText.split(" ")[0] >= allowVideosPublishedYearsAgo)
    return false;
  
  console.log(`BlockTube: ${video.percentWatched}% > ${blockVideosWatchedMoreThanPercentage}% watched`, video);
  //console.log(video);
  //console.log(objectType);
  //console.log(window);
  
  // Block everything else
  return true;
}