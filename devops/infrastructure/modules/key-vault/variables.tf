variable "location" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "user_principal_id" {
  sensitive = true
  type      = string
}
