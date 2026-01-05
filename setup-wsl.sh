#!/bin/bash

# WSL Setup & Optimization Script for Fresh Gen2 Amplify Todo App

echo "🔍 Checking WSL Environment..."

# Check if running in WSL
if ! grep -qi microsoft /proc/version; then
  echo "⚠️ Warning: This script is intended for WSL2. You appear to be running on a different Linux distribution."
fi

# Check Node.js version
NODE_VERSION=$(node -v 2>/dev/null)
if [[ $NODE_VERSION == v18* ]] || [[ $NODE_VERSION == v20* ]] || [[ $NODE_VERSION == v22* ]]; then
  echo "✅ Node.js $NODE_VERSION is installed."
else
  echo "❌ Node.js 18+ is required. Current: $NODE_VERSION"
fi

# Check pnpm
if command -v pnpm &> /dev/null; then
  echo "✅ pnpm is installed."
else
  echo "❌ pnpm is not installed. Run: curl -fsSL https://get.pnpm.io/install.sh | sh -"
fi

# Check AWS CLI
if command -v aws &> /dev/null; then
  echo "✅ AWS CLI is installed."
else
  echo "❌ AWS CLI is not installed. Please install it to use Amplify."
fi

# Check inotify limits
WATCH_LIMIT=$(cat /proc/sys/fs/inotify/max_user_watches)
if [ "$WATCH_LIMIT" -lt 524288 ]; then
  echo "⚠️ inotify max_user_watches is low ($WATCH_LIMIT). Recommended: 524288"
  echo "👉 Run: echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p"
else
  echo "✅ inotify max_user_watches is sufficient ($WATCH_LIMIT)."
fi

# Check project location
if [[ $(pwd) == /mnt/* ]]; then
  echo "❌ Project is located on a Windows drive (/mnt/c/...). Performance will be poor."
  echo "👉 Move the project to your Linux home directory (e.g., ~/projects/)."
else
  echo "✅ Project is located in the Linux file system."
fi

echo "🚀 Setup check complete!"
