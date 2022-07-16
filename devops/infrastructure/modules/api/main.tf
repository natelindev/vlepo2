terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.12.0"
    }
  }
}

resource "azurerm_service_plan" "vlepo_api_plan" {
  name                = "vlepo-api-plan"
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "B1"
}

data "azurerm_key_vault" "vlepo_env" {
  name                = "vlepo-env"
  resource_group_name = "tfstate"
}

data "azurerm_key_vault_secret" "vlepo_env" {
  name         = "env-staging"
  key_vault_id = data.azurerm_key_vault.vlepo_env.id
}

data "azurerm_container_registry" "vlepo_acr" {
  name                = "vlepoacr"
  resource_group_name = var.resource_group_name
}

locals {
  additional_config = {
    DOCKER_REGISTRY_SERVER_URL          = "https://${data.azurerm_container_registry.vlepo_acr.name}.azurecr.io"
    DOCKER_REGISTRY_SERVER_USERNAME     = data.azurerm_container_registry.vlepo_acr.admin_username
    DOCKER_REGISTRY_SERVER_PASSWORD     = data.azurerm_container_registry.vlepo_acr.admin_password
    WEBSITES_PORT                       = 3001
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = false
  }
  env_staging = merge(
    jsondecode(data.azurerm_key_vault_secret.vlepo_env.value),
    local.additional_config
  )
}

resource "azurerm_linux_web_app" "vlepo_api" {
  name                = "vlepo-api"
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.vlepo_api_plan.id

  site_config {
    health_check_path = "/.well-known/apollo/server-health"
    application_stack {
      docker_image     = "${data.azurerm_container_registry.vlepo_acr.name}.azurecr.io/vlepo/api"
      docker_image_tag = "latest"
    }
  }

  logs {
    application_logs {
      file_system_level = "Information"
    }
  }

  app_settings = local.env_staging
}
