.PHONY: db-init
db-init:
	chmod +x ./scripts/database-init.sh
	./scripts/database-init.sh
	

.PHONY: start
start:
	docker-compose up -d

.PHONY: stop
stop:
	docker-compose down

.PHONY: build-ui
build-ui:
	docker build -t cube-dashboard Dockerfile.frontend
