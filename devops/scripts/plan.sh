#!/bin/bash

cd devops/infrastructure
terraform init -backend-config=./${ENVIRONMENT}.conf -reconfigure
terraform plan -var-file=./${ENVIRONMENT}.tfvars -out "plan-${ENVIRONMENT}.tfplan"
