# build docker images and push to azure container registry

# read secrets from azure key vault
eval $(packages/scripts/index.ts azure/read-secret vlepo-env env-staging --env)

# read azure container registry keys from key vault
eval $(packages/scripts/index.ts azure/read-secret vlepo-secrets acr-credentials --env)

echo $ACR_PASSWORD | docker login -u$ACR_USERNAME --password-stdin vlepoacr.azurecr.io

# build vlepo services
echo "building vlepo services"
docker build . -f devops/docker/web.dockerfile -t vlepoacr.azurecr.io/vlepo/web --network host \
--build-arg AZURE_STORAGE_ACCOUNT="$AZURE_STORAGE_ACCOUNT" \
--build-arg AZURE_STORAGE_ACCOUNT_KEY="$AZURE_STORAGE_ACCOUNT_KEY" \
--build-arg NEXT_PUBLIC_ALGOLIA_API_KEY="$NEXT_PUBLIC_ALGOLIA_API_KEY" \
--build-arg NEXT_PUBLIC_ALGOLIA_APP_ID="$NEXT_PUBLIC_ALGOLIA_APP_ID" \
--build-arg NEXT_PUBLIC_ALGOLIA_INDEX_NAME="$NEXT_PUBLIC_ALGOLIA_INDEX_NAME" \
--build-arg NEXT_PUBLIC_API_ENDPOINT="$NEXT_PUBLIC_API_ENDPOINT" \
--build-arg NEXT_PUBLIC_CDN_URL="$NEXT_PUBLIC_CDN_URL" \
--build-arg NEXT_PUBLIC_DEFAULT_BLOG_ID="$NEXT_PUBLIC_DEFAULT_BLOG_ID" \
--build-arg NEXT_PUBLIC_DEFAULT_BLOG_NAME="$NEXT_PUBLIC_DEFAULT_BLOG_NAME" \
--build-arg NEXT_PUBLIC_DEFAULT_BLOG_SLOGAN="$NEXT_PUBLIC_DEFAULT_BLOG_SLOGAN" \
--build-arg NEXT_PUBLIC_DEFAULT_CLIENT_ID="$NEXT_PUBLIC_DEFAULT_CLIENT_ID" \
--build-arg NEXT_PUBLIC_SITE_URL="$NEXT_PUBLIC_SITE_URL" \
--build-arg NEXT_PUBLIC_SUPPORTED_OAUTH_PROVIDERS="$NEXT_PUBLIC_SUPPORTED_OAUTH_PROVIDERS" &
docker build . -f devops/docker/api.dockerfile -t vlepoacr.azurecr.io/vlepo/api --network host &
wait

# push to azure container registry
echo "pushing to azure container registry"
docker push vlepoacr.azurecr.io/vlepo/web &
docker push vlepoacr.azurecr.io/vlepo/api &
wait