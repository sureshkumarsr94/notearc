# AWS Lightsail VM Deployment

## Architecture
- **Build**: GitHub Actions builds Docker image
- **Registry**: AWS ECR stores images
- **Host**: Lightsail VM ($5/month nano instance)
- **Proxy**: Nginx reverse proxy on port 80/443

## Server Details
- **IP**: 3.108.90.4
- **Instance**: notearc-server (Ubuntu 22.04)

## Deployment
Push to `main` branch triggers automatic deployment via GitHub Actions.

## Manual Access
```bash
ssh -i <key.pem> ubuntu@3.108.90.4
docker ps  # Check running containers
docker logs notearc  # View logs
```
