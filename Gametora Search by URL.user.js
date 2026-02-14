// ==UserScript==
// @name         Gametora Search by URL
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically inputs search into Gametora page with URL parameter
// @author       llamatar
// @match        https://gametora.com/umamusume/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');

    if (!searchTerm) return;

    function search(searchTerm) {
        const inputElement = document.querySelector('input[placeholder*="Search"]');
        inputElement.value = searchTerm;

        const reactProp = inputElement[Object.keys(inputElement).find(k => k.startsWith('__reactProps'))];
        reactProp.onChange({target: inputElement, currentTarget: inputElement, type: 'change', bubbles: true});

        if (window.location.href.includes("skills")) {
            setTimeout(() => {
                const intervalId = setInterval(() => {
                    const visibleSkills = document.querySelectorAll('[class*="skills_table_row_ja__"]:not([class*="skills_hidden__"])');

                    if (visibleSkills.length > 0) {
                        const lastMore = visibleSkills[visibleSkills.length - 1].lastChild?.lastChild?.lastChild;
                        lastMore.click();

                        clearInterval(intervalId);
                        setTimeout(adjustTooltip, 300);
                    }
                }, 100);
            }, 100);
        }
    }

    function adjustTooltip() {
        const tooltipContainer = document.querySelector('[data-tippy-root]');
        tooltipContainer.style.left = '50%';
        tooltipContainer.style.transform = 'translate3d(-50%, 0px, 0px)';

        const contentBox = document.querySelector('.tippy-content');
        contentBox.style.maxHeight = '100vh';
        contentBox.style.overflowY = 'auto';

        const innerContent = document.querySelector('.tooltips_tooltip__NxFYo');
        innerContent.style.maxHeight = '100%';
    }

    search(searchTerm);
})();