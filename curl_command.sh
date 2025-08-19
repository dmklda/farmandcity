#!/bin/bash

# Substitua TOKEN pelo token real do reCAPTCHA Enterprise
# Substitua API_KEY pela sua chave de API do Google Cloud

curl -X POST \
  -H "Content-Type: application/json" \
  -d @request.json \
  "https://recaptchaenterprise.googleapis.com/v1/projects/farmand/assessments?key=API_KEY"
