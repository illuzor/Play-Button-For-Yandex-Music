function performSkip(type) {
    const controlButtons = document.querySelectorAll("button.BaseSonataControlsDesktop_sonataButton__GbwFt");

    if (type === "prev") {
        controlButtons[1].click();
    } else if (type === "next") {
        controlButtons[3].click();
    }
}
