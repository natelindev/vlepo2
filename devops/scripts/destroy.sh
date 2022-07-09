#!/bin/bash

cd devops/infrastructure
terraform destroy -auto-approve -var-file=./${ENVIRONMENT}.tfvars
