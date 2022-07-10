# build docker images and push to azure container registry

# read secrets from azure key vault
eval $(packages/scripts/index.ts azure/read-secret vlepo-env env-staging --env)

# read azure container registry keys from key vault
eval $(packages/scripts/index.ts azure/read-secret vlepo-secrets acr-credentials --env)

echo $ACR_PASSWORD | docker login -u$ACR_USERNAME --password-stdin vlepoacr.azurecr.io

# build vlepo services
echo "building vlepo services"
docker build . -f devops/docker/api.dockerfile -t vlepoacr.azurecr.io/vlepo/api --network host

# push to azure container registry
echo "pushing to azure container registry"
docker push vlepoacr.azurecr.io/vlepo/api