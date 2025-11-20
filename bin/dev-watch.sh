#!/bin/bash

set -e

concurrently \
  -n _BACKEND,GENERATE,___SEED,FRONTEND \
  -c magenta,green,yellow,cyan \
  "pnpm dev:backend" \
  "pnpm generate:watch" \
  "pnpm seed:watch" \
  "pnpm dev:frontend" 
