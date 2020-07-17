document.getElementById('play_enabled_label').innerHTML += chrome.i18n.getMessage('enable_play_pause');
document.getElementById('skip_enabled_label').innerHTML += chrome.i18n.getMessage('enable_play_prev_next');
document.getElementById('pin_tab_label').innerHTML += chrome.i18n.getMessage('pin_tab');
document.getElementById('save').innerHTML = chrome.i18n.getMessage('save');
document.getElementById('shortcuts').innerHTML = chrome.i18n.getMessage('shortcuts');

function saveOptions() {
    chrome.storage.sync.set({
        play_enabled: document.getElementById('play_enabled').checked,
        skip_enabled: document.getElementById('skip_enabled').checked,
        pin_tab: document.getElementById('pin_tab').checked
    }, function() {
        window.close();
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
            play_enabled: true,
            skip_enabled: true,
            pin_tab: false
        },
        function(items) {
            document.getElementById('play_enabled').checked = items.play_enabled;
            document.getElementById('skip_enabled').checked = items.skip_enabled;
            document.getElementById('pin_tab').checked = items.pin_tab;
        });
}

function openShortcuts() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true
        },
        function(tabs) {
            chrome.tabs.update(tabs[0].id, { url: "chrome://extensions/configureCommands" });
        });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('shortcuts').addEventListener('click', openShortcuts);
