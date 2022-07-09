terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.12.0"
    }
  }

  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

# Create a resource group
resource "azurerm_resource_group" "vlepo" {
  name     = "vlepo-resources-${var.ENVIRONMENT}"
  location = var.AZURE_LOCATION
}

# Create a virtual network within the resource group
resource "azurerm_virtual_network" "vlepo" {
  name                = "vlepo-network"
  resource_group_name = azurerm_resource_group.vlepo.name
  location            = azurerm_resource_group.vlepo.location
  address_space       = ["10.0.0.0/16"]
}

module "blob-storage" {
  source              = "./modules/blob-storage"
  resource_group_name = azurerm_resource_group.vlepo.name
  location            = azurerm_resource_group.vlepo.location
}

module "key-vault" {
  source              = "./modules/key-vault"
  resource_group_name = azurerm_resource_group.vlepo.name
  location            = azurerm_resource_group.vlepo.location
  user_principal_id   = var.USER_PRINCIPAL_ID
}

module "cdn" {
  source              = "./modules/cdn"
  resource_group_name = azurerm_resource_group.vlepo.name
  location            = azurerm_resource_group.vlepo.location
}

module "database" {
  source              = "./modules/database"
  resource_group_name = azurerm_resource_group.vlepo.name
  location            = azurerm_resource_group.vlepo.location
  db_tunnel_ip        = var.DB_TUNNEL_IP
}

module "container-registry" {
  source              = "./modules/container-registry"
  resource_group_name = azurerm_resource_group.vlepo.name
  location            = azurerm_resource_group.vlepo.location
}

module "api" {
  source              = "./modules/api"
  resource_group_name = azurerm_resource_group.vlepo.name
  location            = azurerm_resource_group.vlepo.location
}

module "web" {
  source              = "./modules/web"
  resource_group_name = azurerm_resource_group.vlepo.name
  location            = azurerm_resource_group.vlepo.location
}
