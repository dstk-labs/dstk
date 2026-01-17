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

info "Waiting for PostgreSQL database..."
until pg_isready -h dstk-postgres -p 5432 -U postgres > /dev/null 2>&1; do
  info "PostgreSQL not ready, retrying..."
  sleep 2
done

success "PostgreSQL is ready!"
info "Starting Apollo server..."
exec "$@"
