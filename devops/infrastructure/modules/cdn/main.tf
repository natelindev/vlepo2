terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.12.0"
    }
  }
}

data "azurerm_storage_account" "vlepomm" {
  name                = "vlepomm"
  resource_group_name = var.resource_group_name
}

data "azurerm_linux_web_app" "vlepo_api" {
  name                = "vlepo-api"
  resource_group_name = var.resource_group_name
}

data "azurerm_linux_web_app" "vlepo_web" {
  name                = "vlepo-web"
  resource_group_name = var.resource_group_name
}

resource "azurerm_frontdoor" "vlepofd" {
  name                = "vlepo-fd"
  resource_group_name = var.resource_group_name

  routing_rule {
    name               = "static"
    accepted_protocols = ["Https"]
    patterns_to_match  = ["/images/*", "/models/*", "/user-images/*", "/next/*"]
    frontend_endpoints = ["vlepoFrontendEndpointDefault", "vlepoFrontendEndpointCustom"]
    forwarding_configuration {
      forwarding_protocol = "HttpsOnly"
      backend_pool_name   = "vlepoBackendPoolStatic"
    }
  }

  routing_rule {
    name               = "api"
    accepted_protocols = ["Https"]
    patterns_to_match  = ["/api/*", "/graphql"]
    frontend_endpoints = ["vlepoFrontendEndpointDefault", "vlepoFrontendEndpointCustom"]
    forwarding_configuration {
      forwarding_protocol = "HttpsOnly"
      backend_pool_name   = "vlepoBackendPoolApi"
    }
  }

  routing_rule {
    name               = "web"
    accepted_protocols = ["Https"]
    patterns_to_match  = ["/*"]
    frontend_endpoints = ["vlepoFrontendEndpointDefault", "vlepoFrontendEndpointCustom"]
    forwarding_configuration {
      forwarding_protocol = "HttpsOnly"
      backend_pool_name   = "vlepoBackendPoolWeb"
    }
  }

  routing_rule {
    name               = "httpsRedirect"
    accepted_protocols = ["Http"]
    patterns_to_match  = ["/*"]
    frontend_endpoints = ["vlepoFrontendEndpointDefault", "vlepoFrontendEndpointCustom"]
    redirect_configuration {
      redirect_protocol = "HttpsOnly"
      redirect_type     = "PermanentRedirect"
    }
  }

  backend_pool_load_balancing {
    name = "vlepoLoadBalancingSettingsDefault"
  }

  backend_pool_health_probe {
    name = "vlepoHealthProbeSettingDefault"
  }

  backend_pool_settings {
    backend_pools_send_receive_timeout_seconds   = 0
    enforce_backend_pools_certificate_name_check = false
  }

  backend_pool {
    name = "vlepoBackendPoolWeb"
    backend {
      host_header = data.azurerm_linux_web_app.vlepo_web.default_hostname
      address     = data.azurerm_linux_web_app.vlepo_web.default_hostname
      http_port   = 80
      https_port  = 443
      priority    = 1
      weight      = 40
    }

    load_balancing_name = "vlepoLoadBalancingSettingsDefault"
    health_probe_name   = "vlepoHealthProbeSettingDefault"
  }

  backend_pool {
    name = "vlepoBackendPoolApi"
    backend {
      host_header = data.azurerm_linux_web_app.vlepo_api.default_hostname
      address     = data.azurerm_linux_web_app.vlepo_api.default_hostname
      http_port   = 80
      https_port  = 443
      priority    = 2
      weight      = 30
    }

    load_balancing_name = "vlepoLoadBalancingSettingsDefault"
    health_probe_name   = "vlepoHealthProbeSettingDefault"
  }

  backend_pool {
    name = "vlepoBackendPoolStatic"
    backend {
      host_header = data.azurerm_storage_account.vlepomm.primary_blob_host
      address     = data.azurerm_storage_account.vlepomm.primary_blob_host
      http_port   = 80
      https_port  = 443
      priority    = 3
      weight      = 30
    }

    load_balancing_name = "vlepoLoadBalancingSettingsDefault"
    health_probe_name   = "vlepoHealthProbeSettingDefault"
  }

  frontend_endpoint {
    name      = "vlepoFrontendEndpointDefault"
    host_name = "vlepo-fd.azurefd.net"
  }

  frontend_endpoint {
    name      = "vlepoFrontendEndpointCustom"
    host_name = "blog.nate-lin.com"
  }
}

resource "azurerm_frontdoor_custom_https_configuration" "custom_https" {
  frontend_endpoint_id              = azurerm_frontdoor.vlepofd.frontend_endpoints["vlepoFrontendEndpointCustom"]
  custom_https_provisioning_enabled = true
  custom_https_configuration {
    certificate_source = "FrontDoor"
  }
}
