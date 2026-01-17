#!/usr/bin/env bash

set -euo pipefail

# Convenience functions
info () {
  printf "\r[ \033[00;34m..\033[0m ] $1\n"
}

success () {
  printf "\r\033[2K[ \033[00;32mOK\033[0m ] $1\n"
}

fail () {
  printf "\r\033[2K[\033[0;31mFAIL\033[0m] $1\n"
}

info "Waiting for Apollo GraphQL service..."
until nc -z dstk-apollo 4000; do
  info "Apollo not ready, retrying..."
  sleep 2
done

success "Apollo is ready!"
info "Starting development server..."
exec "$@"
