if [[ $SKIP_READ_SECRETS != "true" ]]; then
    echo "reading secrets"
    eval $(packages/scripts/index.ts azure/read-secret vlepo-env env-staging --env)
    eval $(packages/scripts/index.ts azure/read-secret vlepo-secrets acr-credentials --env)
fi

echo $ACR_PASSWORD | docker login -u $ACR_USERNAME --password-stdin vlepoacr.azurecr.io

echo "building vlepo services"
docker build . -f devops/docker/api.dockerfile -t vlepoacr.azurecr.io/vlepo/api --network host

echo "pushing to azure container registry"
docker push vlepoacr.azurecr.io/vlepo/api

echo "restart api"
az webapp restart --name vlepo-api --resource-group vlepo-resources-${ENVIRONMENT}