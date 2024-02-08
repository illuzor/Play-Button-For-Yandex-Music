var playButtons = document.getElementsByClassName("player-controls__btn deco-player-controls__button player-controls__btn_play");
var playButton

if (typeof playButton === 'undefined') {
    playButton = playButtons[0]
    listenForPlayState(playButton)
}

if (playButton != null) {
    playButton.click();
}

function listenForPlayState(playButton) {

    function handleClassChange(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.attributeName === 'class') {
                postButtonState(mutation.target.classList.contains('player-controls__btn_pause'))
            }
        }
    }

    const observer = new MutationObserver(handleClassChange);
    const config = {attributes: true, attributeFilter: ['class']};
    observer.observe(playButton, config);
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
