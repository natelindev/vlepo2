variable "AZURE_LOCATION" {
  type    = string
  default = "Korea Central"
}

variable "ENVIRONMENT" {
  type = string
}

variable "USER_PRINCIPAL_ID" {
  sensitive = true
  type      = string
}

variable "DB_TUNNEL_IP" {
  sensitive = true
  type      = string
}
