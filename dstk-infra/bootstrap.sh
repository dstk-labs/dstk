#!/usr/bin/env bash

set -euo pipefail


SCRIPT_DIR="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"


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

check_binary () {
  which $1 > /dev/null 2>&1
  status=$?
  if [ $status -eq 0 ]; then
    success "Found binary ${1} in PATH"
  else
    fail "No valid binary for ${1} found in PATH. Please correct your installation"
    exit 1
  fi
}

function cleanup()
{
    success "Task failed successfully!"
}


# Setup checks
set +e

info "Checking for Docker installation..."
check_binary "docker"

info "Checking for minikube installation..."
check_binary "minikube"

info "Checking for kubectl installation"
check_binary "kubectl"

info "Checking for skaffold installation"
check_binary "skaffold"

set -e

# Minikube startup
minikube start --profile dstk

pushd src
skaffold dev --profile dstk-dev

trap cleanup SIGINT SIGTERM EXIT