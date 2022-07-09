output "db_username" {
  value     = azurerm_postgresql_flexible_server.vlepo_psql_flex_server.administrator_login
  sensitive = true
}

output "db_password" {
  value     = azurerm_postgresql_flexible_server.vlepo_psql_flex_server.administrator_password
  sensitive = true
}

output "db_connection_string" {
  value     = "postgres://${azurerm_postgresql_flexible_server.vlepo_psql_flex_server.administrator_login}:${azurerm_postgresql_flexible_server.vlepo_psql_flex_server.administrator_password}@${azurerm_postgresql_flexible_server.vlepo_psql_flex_server.fqdn}/${azurerm_postgresql_flexible_server_database.vlepo_db.name}?sslmode=require"
  sensitive = true
}
