#!/bin/bash
set -e
set -o pipefail

cd devops/infrastructure
terraform init -backend-config=./${ENVIRONMENT}.conf -reconfigure
terraform plan -out "plan-${ENVIRONMENT}.tfplan"
