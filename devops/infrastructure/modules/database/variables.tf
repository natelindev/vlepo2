variable "location" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "db_tunnel_ip" {
  type      = string
  sensitive = true
}
