# AWS Lightsail Deployment Guide for NoteArc

## Prerequisites

1.  **AWS Lightsail Instance**: creates an instance (OS Only > Amazon Linux 2 or Ubuntu).
2.  **Static IP**: Attach a static IP to your instance.
3.  **Domain DNS**: Point your domain (e.g., `notearc.info`) to the Static IP.
4.  **SSH Access**: Ensure you can SSH into the instance.

## Server Setup

SSH into your Lightsail instance:
```bash
ssh -i /path/to/key.pem ubuntu@<your-static-ip>
```

### 1. Install Docker & Git
**For Ubuntu:**
```bash
sudo apt-get update
sudo apt-get install -y docker.io git
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
# Log out and log back in for group changes to take effect
exit
ssh ...
```

**For Amazon Linux 2:**
```bash
sudo yum update -y
sudo amazon-linux-extras install docker
sudo service docker start
sudo usermod -a -G docker ec2-user
# Log out and log back in
exit
ssh ...
```

## Deployment Steps

1.  **Clone the Repository**
    ```bash
    git clone <your-repo-url> notearc
    cd notearc
    ```

2.  **Environment Variables**
    Create a `.env` file in the root directory with your production secrets:
    ```bash
    nano .env
    ```
    Paste your environment variables (DB_HOST, NEXTAUTH_SECRET, etc.).

3.  **Run Deployment Script**
    Make the script executable and run it:
    ```bash
    chmod +x deploy/deploy.sh
    ./deploy/deploy.sh
    ```

4.  **Verify**
    Visit `http://<your-static-ip>:3000` to see the app.

## HTTPS (SSL) Setup (Optional but Recommended)

To serve over HTTPS using Nginx and Certbot:

1.  **Install Nginx**: `sudo apt install nginx` (Ubuntu) or `sudo amazon-linux-extras install nginx1` (AL2).
2.  **Configure Nginx** to reverse proxy port 80/443 to 3000.
3.  **Install Certbot** to obtain free SSL certificates.
