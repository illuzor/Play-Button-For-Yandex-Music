var playButton
if(!playButton){
    let controlButtons = document.querySelectorAll("button.BaseSonataControlsDesktop_sonataButton__GbwFt");
    playButton = controlButtons[2];
}

playButton.click();

if (playButton) {
    listenForPlayState(playButton);
    const initialIsPlaying = !isPlayState(playButton);
    postButtonState(initialIsPlaying);
}

function isPlayState(button) {
    const svg = button.querySelector('svg use');
    if (svg) {
        const href = svg.getAttribute('xlink:href');
        return href && href.includes('play_filled_l');
    }
    return false;
}

function listenForPlayState(button) {
    let lastState = isPlayState(button);

    function handleChanges(mutationsList, observer) {
        const currentState = isPlayState(button);
        if (currentState !== lastState) {
            lastState = currentState;
            const isPlaying = !currentState;
            postButtonState(isPlaying);
        }
    }

    const observer = new MutationObserver(handleChanges);
    const config = {
        attributes: true,
        childList: true,
        subtree: true,
        attributeOldValue: true
    };
    observer.observe(button, config);
}

function postButtonState(isPlaying) {
    const EXT_ID = "ofiimbenfigghacebjfkihnklgifkcnh";
    const EXT_ID_LOCAL = "hjocpbbmnildbfmheenhbgopfobjlegj";
    let extensionIds = [EXT_ID, EXT_ID_LOCAL];

    extensionIds.forEach(id => {
        chrome.runtime.sendMessage(id, {state: isPlaying ? "Pause" : "Play"});
    });
}
