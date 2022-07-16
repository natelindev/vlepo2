terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.12.0"
    }
  }
}

resource "azurerm_storage_account" "multimedia" {
  name                            = "vlepomm"
  resource_group_name             = var.resource_group_name
  location                        = var.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  allow_nested_items_to_be_public = true

  blob_properties {
    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["GET", "HEAD", "POST", "OPTIONS", "PUT"]
      allowed_origins    = ["https://blog.nate-lin.com"]
      exposed_headers    = ["*"]
      max_age_in_seconds = 300
    }
  }
}

resource "azurerm_storage_container" "images" {
  name                  = "images"
  storage_account_name  = azurerm_storage_account.multimedia.name
  container_access_type = "blob"
}

resource "azurerm_storage_container" "models" {
  name                  = "models"
  storage_account_name  = azurerm_storage_account.multimedia.name
  container_access_type = "blob"
}

resource "azurerm_storage_container" "user_images" {
  name                  = "user-images"
  storage_account_name  = azurerm_storage_account.multimedia.name
  container_access_type = "blob"
}

// build outpout for nextjs
resource "azurerm_storage_container" "next" {
  name                  = "next"
  storage_account_name  = azurerm_storage_account.multimedia.name
  container_access_type = "blob"
}
