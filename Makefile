lint-frontend:
	make -C frontend lint

install:
	npm ci

start-frontend:
	make -C frontend start

start-backend:
	npx start-server

develop:
	make start-backend & make start-frontend

build:
	npm run build

start:
	npm start
