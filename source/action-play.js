var playButton
if(!playButton){
    let controlButtons = document.querySelectorAll("button.BaseSonataControlsDesktop_sonataButton__GbwFt");
    playButton = controlButtons[2];
}

playButton.click();

function postButtonState(isPlaying) {
    const EXT_ID = "ofiimbenfigghacebjfkihnklgifkcnh";
    const EXT_ID_LOCAL = "hjocpbbmnildbfmheenhbgopfobjlegj";
    let extensionIds = [EXT_ID, EXT_ID_LOCAL];

    extensionIds.forEach(id => {
        chrome.runtime.sendMessage({state: isPlaying ? "Pause" : "Play"});
    });
}
