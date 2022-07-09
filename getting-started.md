# Getting started

This guide teaches you how to setup the entire project

## 1. Creating infrastructure

### create service principal

Please follow [the official guide](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/service_principal_client_secret)
to set up a service principal for azure.
Please take note your `current user principle id` as well.

set up following environment variables in your shell profile:

```bash
export ARM_CLIENT_ID=""
export ARM_CLIENT_SECRET=""
export ARM_SUBSCRIPTION_ID=""
export ARM_TENANT_ID=""
export ENVIRONMENT="staging"
```

### create base infrastructure

use terraform to create azure storage account to store terraform backend state
and create a keyvault to store environment variables

create `staging.tfvars` under `devops/tfstate` with content:

```
ENVIRONMENT       = "staging"
USER_PRINCIPAL_ID = "YOUR_CURRENT_USER_PRINCIPAL_ID"
```

run

```bash
yarn run init
```

take note of `storage account name` from log:

```bash
Creation complete after 12s [id=/subscriptions/f57745aa-d5a1-44b1-b90a-628c840243fa/resourceGroups/tfstate/providers/Microsoft.Storage/storageAccounts/<YOUR_STORAGE_ACCOUNT_NAME>]
```

replace `storage_account_name` field in `devops/infrastructure/staging.conf` with it.

use command:

```bash
az storage account keys list --resource-group tfstate --account-name YOUR_STORAGE_ACCOUNT_NAME --query '[0].value' -o tsv
```

to obtain tfstate storage account access key
then set up following environment variable in your shell profile:

```bash
export ARM_ACCESS_KEY=""
```

### setting up environment variables

create your own secret in keyvault `vlepo-env`

create your own env file somewhere, with the format of `env.example.json`, then you can use

```
packages/scripts/index.ts azure/write-secret vlepo-env YOUR_SECRET_NAME PATH_TO_YOUR_ENV_FILE
```

and then use

```
eval "$(packages/scripts/index.ts azure/read-secret vlepo-env YOUR_SECRET_NAME --env)"
```

to set up environment variables needed for running the app locally.

you can add this to your profile or create a zsh-hook like me

### create main infrastructure

create `staging.tfvars` under `devops/infrastructure` with content:

```
ENVIRONMENT       = "staging"
USER_PRINCIPAL_ID = "YOUR_CURRENT_USER_PRINCIPAL_ID"
DB_TUNNEL_IP      = "IP_ADDRESS_YOU_ALLOW_TO_ACCESS_DB"
```

then use

```
yarn plan
```

and

```
yarn apply
```

to create all remaining infrastructures.

## 2. Start deveopment

Simply just

```
yarn dev
```

and you are good to go.
