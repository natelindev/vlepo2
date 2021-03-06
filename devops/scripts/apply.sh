#!/bin/bash
set -e
set -o pipefail

cd devops/infrastructure
terraform init -backend-config=./${ENVIRONMENT}.conf -reconfigure
terraform apply -auto-approve plan-${ENVIRONMENT}.tfplan
