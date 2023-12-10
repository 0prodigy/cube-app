.PHONY: db-init
db-init:
	chmod +x ./scripts/database-init.sh
	./scripts/database-init.sh
	

.PHONY: start-server
start-server:
	docker-compose up -d

.PHONY: stop-server
stop-server:
	docker-compose down

.PHONY: build-ui
build-ui:
	docker build -t cube-dashboard Dockerfile.frontend
