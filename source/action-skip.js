function performSkip(type) {
    let button = null;

    const controlButtons = document.querySelectorAll("button.BaseSonataControlsDesktop_sonataButton__GbwFt");
    if (controlButtons.length >= 3) {
        if (type === "prev") {
            button = controlButtons[0];
        } else if (type === "next") {
            button = controlButtons[2];
        }
    }

    if (button) {
        button.click();
    }
}
