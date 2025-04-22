(video, objectType) => {
	// 2024-10-03_16:36:50
	const blockRelatedVideosWithLessThanViews = 0;
	const blockVideosWatchedMoreThanPercentage = 75;
	const allowVideosPublishedYearsAgo = 4;
  
  	//console.log(video);

	// Allow videos except on certain pages
	const blockablePages = [
		/^\/$/						// homepage (exactly "/")
		, /\/feed\/subscriptions/	// subscriptions (contains "/feed/subscriptions")
		, /\/watch/					// related videos sidebar (contains "/watch")
		, /\/live/					// ongoing livestream (contains "/live")
	];
	if (!blockablePages.some(page => page.test(window.location.pathname)))
		return false;

	// Block related videos with too few views
	if (/\/watch/.test(window.location.pathname)
		&& typeof video.viewCount !== "undefined"
		&& (isNaN(video.viewCount)
			|| video.viewCount < blockRelatedVideosWithLessThanViews)) {
		console.log(`[BlockTube]: ${video.viewCount} < ${blockRelatedVideosWithLessThanViews} views, ${video.title}`, video);
		return true;
	}

	// Allow unwatched videos
	if (video.percentWatched === undefined
		|| video.percentWatched <= blockVideosWatchedMoreThanPercentage)
		return false;

	// Allow ongoing livestreams
	if (video.hasOwnProperty("badges")
		&& video.badges.includes("live"))
		return false;

	// Allow livestream VODs
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

	// Block everything else (watched videos on certain pages)
	console.log(`[BlockTube]: ${video.percentWatched}% > ${blockVideosWatchedMoreThanPercentage}% watched, ${video.title}`);
	return true;
}