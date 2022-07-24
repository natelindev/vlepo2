terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.15.0"
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

# TODO: use new front door after rest of resources released

# resource "azurerm_cdn_frontdoor_profile" "vlepofd" {
#   name                = "vlepofd-cdn-profile"
#   resource_group_name = var.resource_group_name
#   sku_name            = "Standard_AzureFrontDoor"
# }

# resource "azurerm_cdn_frontdoor_endpoint" "vlepofd" {
#   name                     = "vlepofd-endpoint"
#   cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.vlepofd.id
# }

# resource "azurerm_cdn_endpoint_custom_domain" "vlepofd" {
#   name            = "vlepofd-custom-domain"
#   cdn_endpoint_id = azurerm_cdn_frontdoor_endpoint.vlepofd.id
#   host_name       = "blog.nate-lin.com"
#   cdn_managed_https {
#     certificate_type = "Shared"
#     protocol_type    = "ServerNameIndication"
#   }
# }

# resource "azurerm_cdn_frontdoor_origin_group" "web" {
#   name                     = "vlepo-web-group"
#   cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.vlepofd.id
# }

# resource "azurerm_cdn_frontdoor_origin_group" "api" {
#   name                     = "vlepo-api-group"
#   cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.vlepofd.id
# }

# resource "azurerm_cdn_frontdoor_origin_group" "static" {
#   name                     = "vlepo-static-group"
#   cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.vlepofd.id
# }

# resource "azurerm_cdn_frontdoor_origin" "web" {
#   name                          = "static-origin"
#   cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.web.id

#   health_probes_enabled          = true
#   certificate_name_check_enabled = true
#   host_name                      = data.azurerm_linux_web_app.vlepo_web.default_hostname
#   origin_host_header             = data.azurerm_linux_web_app.vlepo_web.default_hostname
#   priority                       = 1
#   weight                         = 40

#   health_probe {
#     interval_in_seconds = 240
#     path                = "/health"
#     protocol            = "Https"
#   }
# }

# resource "azurerm_cdn_frontdoor_origin" "api" {
#   name                                  = "api-origin"
#   cdn_frontdoor_profile_origin_group_id = azurerm_cdn_frontdoor_origin_group.api.id

#   health_probes_enabled          = true
#   certificate_name_check_enabled = true
#   host_name                      = data.azurerm_linux_web_app.vlepo_api.default_hostname
#   origin_host_header             = data.azurerm_linux_web_app.vlepo_api.default_hostname
#   priority                       = 2
#   weight                         = 30

#   health_probe {
#     interval_in_seconds = 240
#     path                = "/.well-known/apollo/server-health"
#     protocol            = "Https"
#   }
# }

# resource "azurerm_cdn_frontdoor_origin" "static" {
#   name                          = "static-origin"
#   cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.static.id

#   health_probes_enabled          = true
#   certificate_name_check_enabled = true
#   host_name                      = data.azurerm_storage_account.vlepomm.primary_blob_host
#   origin_host_header             = data.azurerm_storage_account.vlepomm.primary_blob_host
#   priority                       = 3
#   weight                         = 30
# }

# resource "azurerm_cdn_frontdoor_rule_set" "vlepo" {
#   name                     = "vlepo-rule-set"
#   cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.vlepofd.id
# }

# resource "azurerm_cdn_frontdoor_rule" "static" {
#   name                          = "vlepofd-rule-static"
#   cdn_frontdoor_ruleset_id      = azurerm_cdn_frontdoor_rule_set.vlepo.id
#   cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.static.id
#   patterns                      = ["/images/*", "/models/*", "/user-images/*", "/next/*"]
# }

# resource "azurerm_cdn_frontdoor_rule" "api" {
#   name                          = "vlepofd-rule-static"
#   cdn_frontdoor_ruleset_id      = azurerm_cdn_frontdoor_rule_set.vlepo.id
#   cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.api.id
#   patterns                      = ["/api/*", "/graphql"]
# }

# resource "azurerm_cdn_frontdoor_rule" "web" {
#   name                          = "vlepofd-rule-static"
#   cdn_frontdoor_ruleset_id      = azurerm_cdn_frontdoor_rule_set.vlepo.id
#   cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.web.id
#   patterns                      = ["/*"]
# }

resource "azurerm_frontdoor" "vlepofd" {
  name                = "vlepo-fd"
  resource_group_name = var.resource_group_name

  routing_rule {
    name               = "static"
    accepted_protocols = ["Https"]
    patterns_to_match  = ["/images/*", "/models/*", "/user-images/*", "/next/*"]
    frontend_endpoints = ["vlepoFrontendEndpointDefault", "vlepoFrontendEndpointCustom"]
    forwarding_configuration {
      forwarding_protocol           = "HttpsOnly"
      backend_pool_name             = "vlepoBackendPoolStatic"
      cache_enabled                 = true
      cache_use_dynamic_compression = true
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

  backend_pool_load_balancing {
    name = "vlepoLoadBalancingDefault"
  }

  backend_pool_health_probe {
    name = "vlepoHealthProbeDefault"
  }

  backend_pool_health_probe {
    name = "vlepoHealthProbeApi"
    path = "/.well-known/apollo/server-health"
  }

  backend_pool_health_probe {
    name = "vlepoHealthProbeWeb"
    path = "/health"
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

    load_balancing_name = "vlepoLoadBalancingDefault"
    health_probe_name   = "vlepoHealthProbeWeb"
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

    load_balancing_name = "vlepoLoadBalancingDefault"
    health_probe_name   = "vlepoHealthProbeApi"
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

    load_balancing_name = "vlepoLoadBalancingDefault"
    health_probe_name   = "vlepoHealthProbeDefault"
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
