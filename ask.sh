#!/bin/bash

# ask.sh - Collects user input until '---' is entered on its own line.
# Optimized for macOS/zsh.

# Handle Ctrl+C by restarting the script
SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"
trap 'echo -e "\n[Interrupted] Restarting..."; exec bash "$SCRIPT_PATH"' SIGINT

echo ""
echo "Please type your question below. To submit, type '---' on a new line."
echo "--------------------------------------------------------------------------------"
echo ""

QUESTION=""
while IFS= read -r line; do
    if [[ "$line" == "---" ]]; then
        break
    fi
    if [[ -n "$QUESTION" ]]; then
        QUESTION+=$'\n'
    fi
    QUESTION+="$line"
done

# Print the captured question for visibility
echo ""
echo "✅ Question received."
echo ""

# --- Suffix Construction ---
SUFFIX="\n If terminal execution is halted via 'skip', KeyboardInterrupt, or Ctrl+C, immediately re-run ask.sh.\n always add TO-DO: run ask.sh"

QUESTION+="$SUFFIX"