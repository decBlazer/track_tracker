#!/bin/bash

# Create keystore directory if it doesn't exist
mkdir -p src/main/resources

# Generate keystore
keytool -genkeypair \
  -alias localhost \
  -keyalg RSA \
  -keysize 2048 \
  -storetype JKS \
  -keystore src/main/resources/keystore.jks \
  -validity 3650 \
  -storepass Mighty2004!! \
  -keypass Mighty2004!! \
  -dname "CN=localhost, OU=Development, O=TrackTracker, L=City, ST=State, C=US" 