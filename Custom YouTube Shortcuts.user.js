// ==UserScript==
// @name        Custom YouTube Shortcuts
// @namespace   Tampermonkey Scripts
// @match       *://www.youtube.com/*
// @grant       GM_setClipboard
// @version     1.0
// @author      llamatar
// @description Customize keyboard shortcuts for controlling YouTube behavior
// @icon        https://icons.duckduckgo.com/ip2/youtube.com.ico
// ==/UserScript==

const log = (...inputs) => console.log("[Custom YouTube Shortcuts]:", ...inputs);
const DEFAULT_TOAST_TIME = 1000;
const MIN_SPEED = 0.5;
let video;
let toast;
let hideTimeout;

main();

function main() {
	setUpToast();
	document.addEventListener("keydown", interruptKeys, true);
	log("Init");
}

function interruptKeys(event) {
	if (isEditableElement(document.activeElement)) return;

	if (!video) {
		setVideo();
		if (!video) return;
	}

	switch (event.key) {
		case "u": adjustTime(-3); break;
		case "i": adjustTime(-1); break;
		case "o": adjustTime(+1); break;
		case "p": adjustTime(+3); break;

		case "w": copyTimeToClipboard(); break;

		case "a": adjustSpeed(-0.5); break;
		case "s": resetSpeed(); break;
		case "d": adjustSpeed(+0.5); break;

		//case "z": setVideo(); break;
		case "x": scrollToVideo(); break;

		// Remove default behavior
		case "+":
		case "-":
		case "t":
			break;

		default: return;
	}

	event.stopPropagation();
}

function copyTimeToClipboard() {
	let copyText = Math.floor(video.currentTime);
	GM_setClipboard(copyText);
	//document.execCommand("paste");
}

function setVideo() {
	/*
	if (!pages.some(page => page.test(path))) {
		video = null;
	} else {
		video = document.getElementsByTagName("video")[0];
	}
	log("setVideo: " + video);*/
	video = document.getElementsByTagName("video")[0];
	//if (video) showToast("Video Found");
	//return !!video;
}

function adjustTime(seconds) {
	video.currentTime += seconds;
	showToast(((seconds > 0) ? "+" : "") + seconds + "s");
}

function adjustSpeed(rate) {
	video.playbackRate = Math.max(MIN_SPEED, video.playbackRate + rate);
	showToast(video.playbackRate + "x");
}

function resetSpeed() {
	video.playbackRate = 1.0;
	showToast(video.playbackRate + "x");
}

function scrollToVideo() {
	document.documentElement.scrollTop = 56;
}

function showToast(message, displayTime = DEFAULT_TOAST_TIME) {
	toast.textContent = message;
	toast.style.display = "block";
	clearTimeout(hideTimeout);
	hideTimeout = setTimeout(() => {
		toast.style.display = "none";
	}, displayTime);
}

function setUpToast() {
	toast = document.createElement("div");

	toast.style.position = "fixed";
	// style copied from Enhancer For YouTube™ extension's playback speed notification
	toast.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
	toast.style.color = "#fff";
	toast.style.fontSize = "17px";
	toast.style.padding = "7px 0";
	toast.style.zIndex = "2147483647";
	toast.style.textAlign = "center";
	toast.style.top = "0";
	toast.style.left = "0";
	toast.style.width = "100%";
	toast.style.display = "none";

	document.body.appendChild(toast);
}

function isEditableElement(element) {
	// See for more thorough code: https://stackoverflow.com/questions/26723648/check-whether-an-html-element-is-editable-or-not-using-js
	return element.isContentEditable || ["input", "textarea"].includes(element.nodeName.toLowerCase())
}