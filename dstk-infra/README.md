## Prerequisites

- Docker or Podman
- Minikube
- kubectl
- Skaffold
- `psql` command line utility (for now, at least)

## Development Usage

To spin up the infrastructure for development, just run the provided bootstrap script
```bash
[dstk/dstk-infra] $ ./bootstrap.sh
```

Optionally you can monitor the deployed K8s resources with
```bash
minikube dashboard --profile dstk
```

## Bootstrapping the database

Although some initial databases are created whenever the Postgres container is built, we do not apply patches by default. To apply these yourself, run

```bash
./bin/storage upgrade
```

This will apply any new patches present in `postgres/patches`

## Available Services

The development cluster will automatically expose the following services and endpoints:

- MinIO at `127.0.0.1:9001`; the default credentials are supplied in `src/minio/minio.k8s.yml`
- Postgres at `127.0.0.1:5432`; the default credentials are supplied in `src/postgres/postgres.k8s.yml`. Note that you will need to install the appropriate Postgres utilities (`psql`, jdbc/odbc driver, whatever) on your host machine in order to connect.