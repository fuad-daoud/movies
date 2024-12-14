namespace=movies
release=marco
image=registry.digitallands.cloud/movies:v0.0.3
upgrade:
	helm upgrade --install $(release) helm --timeout 1200s --create-namespace --namespace $(namespace) --set image=$(image)

template:
	rm -rf tmp
	helm template $(release) helm --output-dir tmp --namespace $(namespace) --debug --dependency-update --dry-run --validate --set image=$(image)

clean:
	helm uninstall $(release) --namespace $(namespace)
	# kubectl delete namespace $(namespace)

build:
	helm dependency build helm

docker-build:;
	docker build . --tag $(image)
	docker push $(image)

full:
	make docker-build
	make upgrade