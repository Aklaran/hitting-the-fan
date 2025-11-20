#!/bin/bash

set -e

# Watch for any change to files in the prisma/seed directory and re-runs the seed command
# - Kills the existing seed run if there is one

onchange -i -k \
  'app/backend/prisma/seed/**/*.ts' \
  -- \
  pnpm seed

