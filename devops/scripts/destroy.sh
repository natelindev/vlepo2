#!/bin/bash
set -e
set -o pipefail

cd devops/infrastructure
terraform destroy -auto-approve
