// ==UserScript==
// @name        Custom YouTube Shortcuts
// @namespace   Tampermonkey Scripts
// @match       *://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      llamatar
// @description Customize keyboard shortcuts for controlling YouTube behavior
// @icon        https://icons.duckduckgo.com/ip2/youtube.com.ico
// ==/UserScript==

const log = (...inputs) => console.log("[Custom YouTube Shortcuts]:", ...inputs);

function interruptKeys(e) {
	if (document.activeElement.hasAttribute("contenteditable")) return;

	switch (e.key) {
		case "u": adjustVideoTime(-3); break;
		case "i": adjustVideoTime(-1); break;
		case "o": adjustVideoTime(+1); break;
		case "p": adjustVideoTime(+3); break;

		case "x": scrollToVideo(); break;

		// Remove default behavior
		case "+":
		case "-":
		case "w":
		case "t":
			break;

		default:
			return;
	}

	e.stopPropagation();
}

function adjustVideoTime(seconds) {
	const video = document.querySelector("video");
	if (video) video.currentTime += seconds;
}

function scrollToVideo() {
	const player = document.querySelector("ytd-player");
	if (player) player.scrollIntoView();
}

document.addEventListener("keydown", interruptKeys, true);

log("Init");