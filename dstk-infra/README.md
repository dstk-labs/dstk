## Prerequisites

- Docker or Podman
- Minikube
- kubectl
- Skaffold

## Development Usage

To spin up the infrastructure for development, just run the provided bootstrap script
```bash
[dstk/dstk-infra] $ ./bootstrap.sh
```

Optionally you can monitor the deployed K8s resources with
```bash
minikube dashboard --profile dstk
```

## Available Services

The development cluster will automatically expose the following services and endpoints:

- MinIO at `127.0.0.1:9001`; the default credentials are supplied in `src/minio/minio.k8s.yml`
- Postgres at `127.0.0.1:5432`; the default credentials are supplied in `src/postgres/postgres.k8s.yml`. Note that you will need to install the appropriate Postgres utilities (`psql`, jdbc/odbc driver, whatever) on your host machine in order to connect.