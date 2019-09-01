#!/bin/bash

set -e

docker build -t eu.gcr.io/${PROJECT_PROD}/${NGINX_IMAGE}:$TRAVIS_COMMIT ./nginx
docker build -t eu.gcr.io/${PROJECT_PROD}/${ADMIN_IMAGE}:$TRAVIS_COMMIT ./packages/admin
docker build -t eu.gcr.io/${PROJECT_PROD}/${CLIENT_IMAGE}:$TRAVIS_COMMIT ./packages/client
docker build -t eu.gcr.io/${PROJECT_PROD}/${API_IMAGE}:$TRAVIS_COMMIT ./packages/api

echo $GCLOUD_SERVICE_KEY_PROD | base64 --decode -i > ${HOME}/gcloud-service-key.json
gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json

gcloud --quiet config set project $PROJECT_PROD
# gcloud --quiet config set container/cluster $CLUSTER
gcloud --quiet config set compute/zone ${ZONE}
# gcloud --quiet container clusters get-credentials $CLUSTER

gcloud docker -- push eu.gcr.io/${PROJECT_PROD}/${NGINX_IMAGE}
gcloud docker -- push eu.gcr.io/${PROJECT_PROD}/${ADMIN_IMAGE}
gcloud docker -- push eu.gcr.io/${PROJECT_PROD}/${CLIENT_IMAGE}
gcloud docker -- push eu.gcr.io/${PROJECT_PROD}/${API_IMAGE}

yes | gcloud beta container images add-tag eu.gcr.io/${PROJECT_PROD}/${NGINX_IMAGE}:$TRAVIS_COMMIT eu.gcr.io/${PROJECT_PROD}/${NGINX_IMAGE}:latest
yes | gcloud beta container images add-tag eu.gcr.io/${PROJECT_PROD}/${ADMIN_IMAGE}:$TRAVIS_COMMIT eu.gcr.io/${PROJECT_PROD}/${ADMIN_IMAGE}:latest
yes | gcloud beta container images add-tag eu.gcr.io/${PROJECT_PROD}/${CLIENT_IMAGE}:$TRAVIS_COMMIT eu.gcr.io/${PROJECT_PROD}/${CLIENT_IMAGE}:latest
yes | gcloud beta container images add-tag eu.gcr.io/${PROJECT_PROD}/${API_IMAGE}:$TRAVIS_COMMIT eu.gcr.io/${PROJECT_PROD}/${API_IMAGE}:latest
