output "primary_access_key" {
  sensitive = true
  value     = azurerm_storage_account.multimedia.primary_access_key
}

output "name" {
  value = azurerm_storage_account.multimedia.name
}
