# build docker images and push to azure container registry

# read secrets from azure key vault
eval $(packages/scripts/index.ts azure/read-secret vlepo-env env-staging --env)

# read azure container registry keys from key vault
eval $(packages/scripts/index.ts azure/read-secret vlepo-secrets acr-credentials --env)

echo $ACR_PASSWORD | docker login -u$ACR_USERNAME --password-stdin vlepoacr.azurecr.io

# build vlepo services
echo "building vlepo services"
docker build . -f devops/docker/web.dockerfile -t vlepoacr.azurecr.io/vlepo/web --network host \
--build-arg CDN_URL=$CDN_ENDPOINT \
--build-arg API_URL=$NEXT_PUBLIC_API_ENDPOINT \
--build-arg AZURE_STORAGE_ACCOUNT=$AZURE_STORAGE_ACCOUNT \
--build-arg AZURE_STORAGE_ACCOUNT_KEY=$AZURE_STORAGE_ACCOUNT_KEY &
docker build . -f devops/docker/api.dockerfile -t vlepoacr.azurecr.io/vlepo/api --network host &
wait

# push to azure container registry
echo "pushing to azure container registry"
docker push vlepoacr.azurecr.io/vlepo/web &
docker push vlepoacr.azurecr.io/vlepo/api &
wait