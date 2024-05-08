#!/bin/bash

set -e

concurrently \
  -n _BACKEND,FRONTEND \
  -c magenta,cyan \
  "pnpm dev:backend" \
  "pnpm dev:frontend" 
