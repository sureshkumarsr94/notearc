#!/bin/bash

# AWS ECS EC2 Setup Script
# Run this script to set up the required AWS infrastructure for ECS deployment

set -e

# Configuration
AWS_REGION="ap-south-1"
CLUSTER_NAME="notearc-cluster"
SERVICE_NAME="notearc-service"
ECR_REPO="notearc"
INSTANCE_TYPE="t3.small"
KEY_PAIR_NAME="notearc-ecs-key"

echo "=== AWS ECS EC2 Setup for Notearc ==="
echo ""

# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "AWS Account ID: $ACCOUNT_ID"
echo "Region: $AWS_REGION"
echo ""

# Step 1: Create ECR Repository
echo "1. Creating ECR Repository..."
aws ecr create-repository \
  --repository-name $ECR_REPO \
  --region $AWS_REGION \
  2>/dev/null || echo "   ECR repository already exists"

# Step 2: Create ECS Cluster
echo "2. Creating ECS Cluster..."
aws ecs create-cluster \
  --cluster-name $CLUSTER_NAME \
  --region $AWS_REGION \
  2>/dev/null || echo "   ECS cluster already exists"

# Step 3: Create CloudWatch Log Group
echo "3. Creating CloudWatch Log Group..."
aws logs create-log-group \
  --log-group-name /ecs/notearc \
  --region $AWS_REGION \
  2>/dev/null || echo "   Log group already exists"

# Step 4: Create SSM Parameters (you need to update these values)
echo "4. Creating SSM Parameters..."
echo "   Please create these parameters in AWS Systems Manager Parameter Store:"
echo "   - /notearc/DB_HOST"
echo "   - /notearc/DB_NAME"
echo "   - /notearc/DB_USER"
echo "   - /notearc/DB_PASSWORD"
echo "   - /notearc/NEXTAUTH_SECRET"
echo "   - /notearc/NEXTAUTH_URL"
echo "   - /notearc/GOOGLE_CLIENT_ID"
echo "   - /notearc/GOOGLE_CLIENT_SECRET"
echo ""

# Step 5: Create IAM Role for ECS Task Execution
echo "5. Creating ECS Task Execution Role..."
cat > /tmp/ecs-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file:///tmp/ecs-trust-policy.json \
  2>/dev/null || echo "   Role already exists"

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy \
  2>/dev/null || true

# Attach SSM read policy for secrets
cat > /tmp/ssm-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameters",
        "ssm:GetParameter"
      ],
      "Resource": "arn:aws:ssm:${AWS_REGION}:${ACCOUNT_ID}:parameter/notearc/*"
    }
  ]
}
EOF

aws iam put-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-name ECSSSMReadPolicy \
  --policy-document file:///tmp/ssm-policy.json \
  2>/dev/null || true

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next Steps:"
echo "1. Create EC2 instances with ECS-optimized AMI and join them to '$CLUSTER_NAME'"
echo "2. Add the required SSM parameters listed above"
echo "3. Push code to main branch to trigger deployment"
echo ""
echo "To create EC2 instance manually:"
echo "  - Use AMI: Amazon ECS-optimized Amazon Linux 2023"
echo "  - Instance type: $INSTANCE_TYPE"
echo "  - User data:"
echo "    #!/bin/bash"
echo "    echo ECS_CLUSTER=$CLUSTER_NAME >> /etc/ecs/ecs.config"
echo "  - Security group: Allow inbound on port 80"
echo "  - IAM role: ecsInstanceRole"
