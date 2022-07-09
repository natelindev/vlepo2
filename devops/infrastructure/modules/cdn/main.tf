terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.12.0"
    }
  }
}

resource "azurerm_frontdoor" "vlepofd" {
  name                = "vlepo-fd"
  resource_group_name = var.resource_group_name

  routing_rule {
    name               = "defaultRoute"
    accepted_protocols = ["Http", "Https"]
    patterns_to_match  = ["/*"]
    frontend_endpoints = ["vlepoFrontendEndpointDefault"]
    forwarding_configuration {
      forwarding_protocol = "HttpsOnly"
      backend_pool_name   = "vlepoBackendPoolDefault"
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
    name = "vlepoBackendPoolDefault"
    backend {
      host_header = var.storage_account_hostname
      address     = var.storage_account_hostname
      http_port   = 80
      https_port  = 443
      priority    = 1
      weight      = 50
    }

    load_balancing_name = "vlepoLoadBalancingSettingsDefault"
    health_probe_name   = "vlepoHealthProbeSettingDefault"
  }

  frontend_endpoint {
    name      = "vlepoFrontendEndpointDefault"
    host_name = "vlepo-fd.azurefd.net"
  }
}
