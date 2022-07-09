resource "azurerm_key_vault_secret" "blob_storage_access_key" {
  name = "blob-storage-access-key"
  value = jsonencode(
    {
      AZURE_STORAGE_ACCOUNT     = module.blob-storage.name
      AZURE_STORAGE_ACCOUNT_KEY = module.blob-storage.primary_access_key
    }
  )
  key_vault_id = module.key-vault.id

  depends_on = [
    module.blob-storage,
    module.key-vault
  ]
}

resource "azurerm_key_vault_secret" "db_credentials" {
  name = "db-credentials"
  value = jsonencode(
    {
      DB_USERNAME          = module.database.db_username
      DB_PASSWORD          = module.database.db_password
      DB_CONNECTION_STRING = module.database.db_connection_string
    }
  )
  key_vault_id = module.key-vault.id

  depends_on = [
    module.database,
    module.key-vault
  ]
}

resource "azurerm_key_vault_secret" "acr_credentials" {
  name = "acr-credentials"
  value = jsonencode(
    {
      ACR_USERNAME = module.container-registry.admin_username
      ACR_PASSWORD = module.container-registry.admin_password
    }
  )
  key_vault_id = module.key-vault.id

  depends_on = [
    module.container-registry,
    module.key-vault
  ]
}
