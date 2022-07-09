output "admin_username" {
  value     = azurerm_container_registry.vlepo_acr.admin_username
  sensitive = true
}

output "admin_password" {
  value     = azurerm_container_registry.vlepo_acr.admin_password
  sensitive = true
}
