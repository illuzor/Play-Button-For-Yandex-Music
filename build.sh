#!/bin/bash

SOURCE_FOLDER="source/"
RELEASE_FOLDER="release"

pack_chrome() {
  echo "Packing Chrome extension..."
  mkdir -p "$RELEASE_FOLDER"
  zip -r "${RELEASE_FOLDER}/chrome.zip" "$SOURCE_FOLDER"
}

main() {
  pack_chrome
}

main "$@"