#!/bin/bash
# ✅ scripts/deploy.sh - SCRIPT DE DEPLOY SEGURO

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
VERSION=$(node -p "require('./package.json').version")
BUILD_DIR="dist"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
DEPLOY_HOST="${DEPLOY_HOST:-socdepoble.org}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/socdepoble}"

echo -e "${YELLOW}🏺 Sóc de Poble - Deploy Script${NC}"
echo -e "Environment: ${GREEN}${ENVIRONMENT}${NC}"
echo -e "Version: ${GREEN}${VERSION}${NC}"

# [STEP 1] Validate environment
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo -e "${RED}Error: Environment must be 'staging' or 'production'${NC}"
    exit 1
fi

# [STEP 2] Run tests (only for production)
if [ "$ENVIRONMENT" == "production" ]; then
    echo -e "${YELLOW}Running tests...${NC}"
    npm run test || {
        echo -e "${RED}Tests failed! Aborting deploy.${NC}"
        exit 1
    }
    echo -e "${GREEN}✓ Tests passed${NC}"
fi

# [STEP 3] Build application
echo -e "${YELLOW}Building application...${NC}"
npm run build || {
    echo -e "${RED}Build failed!${NC}"
    exit 1
}
echo -e "${GREEN}✓ Build completed${NC}"

# [STEP 4] Deploy via SSH
echo -e "${YELLOW}Deploying to ${ENVIRONMENT}...${NC}"

if [ "$ENVIRONMENT" == "production" ]; then
    # Production: Backup first
    echo -e "${YELLOW}Creating backup...${NC}"
    ssh ${DEPLOY_USER}@${DEPLOY_HOST} "cd ${DEPLOY_PATH} && tar -czf backup-${VERSION}.tar.gz current/" || true
fi

# Upload new build
scp -r ${BUILD_DIR}/* ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/current/

# Restart services (if needed)
ssh ${DEPLOY_USER}@${DEPLOY_HOST} "cd ${DEPLOY_PATH} && ./restart.sh ${ENVIRONMENT}" || true

echo -e "${GREEN}✓ Deploy completed successfully${NC}"
echo -e "${GREEN}Version ${VERSION} is now live on ${ENVIRONMENT}${NC}"

# [STEP 5] Notify (optional)
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 Sóc de Poble ${VERSION} deployed to ${ENVIRONMENT}\"}" \
        "$SLACK_WEBHOOK_URL" || true
fi
