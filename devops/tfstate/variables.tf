variable "AZURE_LOCATION" {
  type    = string
  default = "Korea Central"
}

variable "USER_PRINCIPAL_ID" {
  sensitive = true
  type      = string
}
