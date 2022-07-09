#!/bin/bash

cd devops/tfstate
terraform init -backend-config=./${ENVIRONMENT}.conf -reconfigure
terraform plan -var-file=./${ENVIRONMENT}.tfvars -out "plan-${ENVIRONMENT}.tfplan"
terraform apply -auto-approve plan-${ENVIRONMENT}.tfplan