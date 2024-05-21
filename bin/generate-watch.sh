#!/bin/bash

# Credit to Daddy Hirsch on this one

set -e

# Note: We `sleep 1` before running `pnpm generate --watch` so that the dev
#       server has a chance to start before the generated Prisma client gets
#       nuked (which would otherwise cause an ugly exception on init)

# sleep 2

# Watch for any change to schema.prisma and re-runs the generate command
# - Kills the existing test run if there is one

onchange -i -k \
  './prisma/schema.prisma' \
  -- \
  pnpm generate

