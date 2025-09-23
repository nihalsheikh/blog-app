#!/bin/bash
set -e

echo "Installing Bun..."
curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
export PATH="$HOME/.bun/bin:$PATH"

echo "Bun version:"
bun --version

echo "Installing dependencies with Bun..."
bun install

echo "Building with Bun..."
bun run build

echo "Build complete!"
