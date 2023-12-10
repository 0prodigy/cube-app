## Getting Started

Clone the repo and install dependencies:

```bash
git clone
cd cube-app/frontend
yarn install
```

## Running the app

# Prequsites

- Node.js
- Yarn
- Docker
- Postgres

# If you prefer running the app in docker container

```bash
docker build -t frontend Dockerfile.frontend
docker-compose up cube
docker run -p 3000:3000 frontend
```

# there is a make file to run the docker container

```bash
make init ---(this command will initialize the database and migrate the schema and data)
make start ---(this command will start the docker container)
make stop ---(this command will stop the docker container)
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
