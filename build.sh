#!/bin/bash
# Build script to compile TypeScript to JavaScript
echo "Compiling TypeScript..."
npx tsc
echo "✅ Compilation complete! dist/script.js has been updated from script.ts"
