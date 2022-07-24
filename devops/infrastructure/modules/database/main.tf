terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.15.0"
    }
  }
}

resource "random_password" "password" {
  length           = 32
  override_special = "!#$%&*()-_=+[]{}<>:?"
  special          = true
}

resource "random_string" "db_name" {
  length  = 4
  special = false
  upper   = false
}

resource "azurerm_postgresql_flexible_server" "vlepo_psql_flex_server" {
  name                   = "vlepo-psql-flex-server"
  resource_group_name    = var.resource_group_name
  location               = var.location
  version                = "13"
  administrator_login    = "psqladmin_${random_string.db_name.result}"
  administrator_password = random_password.password.result
  zone                   = "1"

  storage_mb = 32768

  sku_name = "B_Standard_B1ms"
}

resource "azurerm_postgresql_flexible_server_database" "vlepo_db" {
  name      = "vlepo-db"
  server_id = azurerm_postgresql_flexible_server.vlepo_psql_flex_server.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "tunnel" {
  name             = "db-tunnel-fw"
  server_id        = azurerm_postgresql_flexible_server.vlepo_psql_flex_server.id
  start_ip_address = var.db_tunnel_ip
  end_ip_address   = var.db_tunnel_ip
}

data "azurerm_linux_web_app" "api" {
  name                = "vlepo-api"
  resource_group_name = var.resource_group_name
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "api" {
  for_each         = toset(data.azurerm_linux_web_app.api.outbound_ip_address_list)
  name             = "db-api-fw-${replace(each.key, ".", "-")}"
  server_id        = azurerm_postgresql_flexible_server.vlepo_psql_flex_server.id
  start_ip_address = each.value
  end_ip_address   = each.value
}

