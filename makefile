.DEFAULT_GOAL := build
.PHONY: build

SHELL := /bin/bash

info:
	@echo "Available make commands:"
	@echo
	@echo "  $$ make"
	@echo "  $$ make init"
	@echo "  $$ make clean"
	@echo "  $$ make dev"
	@echo "  $$ make run"
	@echo
	@echo "  $$ make todo"
	@echo "  $$ make info"
	@echo
	@echo "  $$ make start"
	@echo "  $$ make reload"
	@echo "  $$ make restart"
	@echo "  $$ make stop"
	@echo

build:
	./Taskfile build

init:
	./Taskfile init

clean:
	./Taskfile clean

dev:
	./Taskfile dev

run:
	./Taskfile run

todo:
	./Taskfile todo

start:
	./Taskfile start

reload:
	./Taskfile reload

restart:
	./Taskfile restart

stop:
	./Taskfile stop
