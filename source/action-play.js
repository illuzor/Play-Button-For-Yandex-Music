var playButton = document
    .querySelector("svg[class*='BaseSonataControlsDesktop_playButtonIcon_']")
    .closest('button');

if (playButton) {
    playButton.click();
    listenForPlayState(playButton);

    playButton.addEventListener('click', function () {
        setTimeout(function () {
            const use = document.querySelector("svg[class*='BaseSonataControlsDesktop_playButtonIcon_'] use");
            if (use) {
                const isPlaying = use.getAttribute("xlink:href") === "#pause_filled_l";
                postButtonState(isPlaying);
            }
        }, 50);
    });
}

function listenForPlayState(playButton) {
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

    function handleButtonMutation(mutations) {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-label') {
                const isPlaying = mutation.target.getAttribute('aria-label') === 'Пауза';
                postButtonState(isPlaying);
            }
        }
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
    const EXT_ID = "ofiimbenfigghacebjfkihnklgifkcnh"
    const EXT_ID_LOCAL = "hjocpbbmnildbfmheenhbgopfobjlegj"
    let extensionIds = [EXT_ID, EXT_ID_LOCAL]

    if (isPlaying) {
        extensionIds.forEach(id => {
                chrome.runtime.sendMessage({state: "Pause"})
            }
        )
    } else {
        extensionIds.forEach(id => {
                chrome.runtime.sendMessage({state: "Play"})
            }
        )
    }
}
