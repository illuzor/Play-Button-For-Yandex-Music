function handleButtonMutation(mutations) {
    for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-label') {
            const button = mutation.target;
            const svgUse = button.querySelector("svg use");
            if (svgUse) {
                const href = svgUse.getAttribute("xlink:href");
                const isPlaying = href && href.includes("pause");
                postButtonState(isPlaying);
            }
        }
    }
}

function listenForPlayState(playButton) {
    checkAndUpdateState();

    function checkAndUpdateState() {
        const use = document.querySelector("svg[class*='playButtonIcon'] use");
        if (use) {
            const href = use.getAttribute("xlink:href");
            const isPlaying = href && href.includes("pause");
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

var playButton = document
    .querySelector("svg[class*='BaseSonataControlsDesktop_playButtonIcon_']")
    ?.closest('button');

if (!playButton) {
    const playButtonSvg = document.querySelector("svg[class*='playButtonIcon']");
    if (playButtonSvg) {
        playButton = playButtonSvg.closest('button');
    }
}

if (playButton) {
    playButton.click();
    listenForPlayState(playButton);

    playButton.addEventListener('click', function () {
        setTimeout(function () {
            const use = document.querySelector("svg[class*='playButtonIcon'] use");
            if (use) {
                const href = use.getAttribute("xlink:href");
                const isPlaying = href && href.includes("pause");
                postButtonState(isPlaying);
            }
        }, 50);
    });
} else {
    console.log("Play button not found");
}
