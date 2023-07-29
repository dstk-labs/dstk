## Prerequisites

- Docker or Podman
- Minikube
- kubectl
- Skaffold

# Usage

```bash
minikube start
skaffold dev -p dstk-dev
```

Optionally you can monitor K8s resources with
```bash
minikube dashboard --profile dstk
```