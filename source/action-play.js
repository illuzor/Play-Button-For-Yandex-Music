function handleButtonMutation(mutations) {
    for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-label') {
            const isPlaying = mutation.target.getAttribute('aria-label') === 'Пауза';
            postButtonState(isPlaying);
        }
    }
}

function listenForPlayStateNewDesign(playButton) {
    checkAndUpdateState();

    function checkAndUpdateState() {
        const use = document.querySelector("svg[class*='BaseSonataControlsDesktop_playButtonIcon_'] use");
        if (use) {
            const isPlaying = use.getAttribute("xlink:href") === "#pause_filled_l";
            postButtonState(isPlaying);
            return isPlaying;
        }
        return false;
    }

    const buttonObserver = new MutationObserver(handleButtonMutation);
    buttonObserver.observe(playButton, {
        attributes: true,
        attributeFilter: ['aria-label']
    });

    const container = document.querySelector(".player-controls") ||
        document.querySelector("[class*='player-controls']") ||
        document.querySelector("[class*='Controls']") ||
        (playButton ? playButton.closest("div[class*='Controls']") ||
            playButton.closest("div.player") ||
            playButton.parentElement.parentElement : null);

    if (container) {
        const containerObserver = new MutationObserver(function () {
            checkAndUpdateState();
        });
        containerObserver.observe(container, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }
}

function handleClassChange(mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.attributeName === 'class') {
            const isPlaying = mutation.target.classList.contains('player-controls__btn_pause');
            postButtonState(isPlaying);
        }
    }
}

function listenForPlayStateOldDesign(playButton) {
    const observer = new MutationObserver(handleClassChange);
    const config = { attributes: true, attributeFilter: ['class'] };
    observer.observe(playButton, config);
}

function postButtonState(isPlaying) {
    const EXT_ID = "ofiimbenfigghacebjfkihnklgifkcnh";
    const EXT_ID_LOCAL = "hjocpbbmnildbfmheenhbgopfobjlegj";
    let extensionIds = [EXT_ID, EXT_ID_LOCAL];

    extensionIds.forEach(id => {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage({ state: isPlaying ? "Pause" : "Play" });
        } else {
            console.warn("chrome.runtime is not available.  The code is likely running outside of a Chrome extension environment.");
        }
    });
}

var playButtonNew = document
    .querySelector("svg[class*='BaseSonataControlsDesktop_playButtonIcon_']")
    ?.closest('button');

var playButtonsOld = document.getElementsByClassName("player-controls__btn deco-player-controls__button player-controls__btn_play");
var playButtonOld = playButtonsOld[0];

if (playButtonNew) {
    playButtonNew.click();
    listenForPlayStateNewDesign(playButtonNew);

    playButtonNew.addEventListener('click', function () {
        setTimeout(function () {
            const use = document.querySelector("svg[class*='BaseSonataControlsDesktop_playButtonIcon_'] use");
            if (use) {
                const isPlaying = use.getAttribute("xlink:href") === "#pause_filled_l";
                postButtonState(isPlaying);
            }
        }, 50);
    });
}
else if (playButtonOld) {
    playButtonOld.click();
    listenForPlayStateOldDesign(playButtonOld);
}
else {
    console.log("Play button not found in either design.");
}
