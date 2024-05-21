#!/bin/bash

set -e

concurrently \
  -n _BACKEND,GENERATE,FRONTEND \
  -c magenta,green,cyan \
  "pnpm dev:backend" \
  "pnpm generate:watch" \
  "pnpm dev:frontend" 
