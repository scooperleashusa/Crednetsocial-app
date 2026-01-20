#!/bin/bash

# Deployment Verification Script
# This script verifies that all necessary configuration is in place for deployment

set -e

echo "🔍 CredNet Social App - Deployment Verification"
echo "================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
ERRORS=0
WARNINGS=0
SUCCESS=0

# Function to print status
print_status() {
    if [ "$1" = "error" ]; then
        echo -e "${RED}✗ $2${NC}"
        ((ERRORS++))
    elif [ "$1" = "warning" ]; then
        echo -e "${YELLOW}⚠ $2${NC}"
        ((WARNINGS++))
    elif [ "$1" = "success" ]; then
        echo -e "${GREEN}✓ $2${NC}"
        ((SUCCESS++))
    else
        echo "  $2"
    fi
}

echo "1. Checking Local Environment Setup"
echo "-----------------------------------"

# Check for .env.local
if [ -f ".env.local" ]; then
    print_status "success" ".env.local file exists"
    
    # Check for required variables
    required_vars=(
        "REACT_APP_FIREBASE_API_KEY"
        "REACT_APP_FIREBASE_AUTH_DOMAIN"
        "REACT_APP_FIREBASE_PROJECT_ID"
        "REACT_APP_FIREBASE_STORAGE_BUCKET"
        "REACT_APP_FIREBASE_MESSAGING_SENDER_ID"
        "REACT_APP_FIREBASE_APP_ID"
    )
    
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env.local; then
            value=$(grep "^${var}=" .env.local | cut -d '=' -f2)
            if [ -n "$value" ] && [ "$value" != "your_" ]; then
                print_status "success" "$var is set"
            else
                print_status "warning" "$var is empty or placeholder"
            fi
        else
            print_status "error" "$var is missing"
        fi
    done
else
    print_status "warning" ".env.local file not found (needed for local development)"
    print_status "info" "Run: cp .env.local.example .env.local"
fi

echo ""
echo "2. Checking Project Structure"
echo "----------------------------"

# Check critical files
critical_files=(
    "package.json"
    "firebase.json"
    ".github/workflows/deploy.yml"
    "public/index.html"
    "src/App.js"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "success" "$file exists"
    else
        print_status "error" "$file is missing"
    fi
done

echo ""
echo "3. Checking Dependencies"
echo "----------------------"

if [ -f "package.json" ]; then
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        print_status "success" "node_modules directory exists"
    else
        print_status "warning" "node_modules not found - run: npm install"
    fi
    
    # Check critical dependencies
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        print_status "success" "Node.js installed: $NODE_VERSION"
    else
        print_status "error" "Node.js is not installed"
    fi
    
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        print_status "success" "npm installed: $NPM_VERSION"
    else
        print_status "error" "npm is not installed"
    fi
fi

echo ""
echo "4. Checking Build Configuration"
echo "------------------------------"

# Check if build script exists in package.json
if [ -f "package.json" ]; then
    if grep -q '"build"' package.json; then
        print_status "success" "Build script is configured"
    else
        print_status "error" "Build script is missing in package.json"
    fi
fi

# Try to build (optional, only if requested)
if [ "$1" = "--build" ]; then
    echo ""
    echo "5. Testing Build Process"
    echo "----------------------"
    print_status "info" "Running build test..."
    
    if npm run build > /dev/null 2>&1; then
        print_status "success" "Build completed successfully"
        
        if [ -d "build" ]; then
            BUILD_SIZE=$(du -sh build | cut -f1)
            print_status "success" "Build directory created (size: $BUILD_SIZE)"
        fi
    else
        print_status "error" "Build failed - run 'npm run build' for details"
    fi
fi

echo ""
echo "5. Checking Git Configuration"
echo "----------------------------"

if command -v git &> /dev/null; then
    print_status "success" "Git is installed"
    
    # Check if in git repository
    if git rev-parse --git-dir > /dev/null 2>&1; then
        print_status "success" "Inside a Git repository"
        
        # Check current branch
        BRANCH=$(git branch --show-current)
        print_status "info" "Current branch: $BRANCH"
        
        # Check for uncommitted changes
        if git diff-index --quiet HEAD --; then
            print_status "success" "No uncommitted changes"
        else
            print_status "warning" "You have uncommitted changes"
        fi
        
        # Check remote
        if git remote get-url origin > /dev/null 2>&1; then
            REMOTE=$(git remote get-url origin)
            print_status "success" "Remote configured: $REMOTE"
        else
            print_status "warning" "No remote configured"
        fi
    else
        print_status "error" "Not in a Git repository"
    fi
else
    print_status "error" "Git is not installed"
fi

echo ""
echo "6. Checking GitHub Actions Configuration"
echo "---------------------------------------"

if [ -f ".github/workflows/deploy.yml" ]; then
    print_status "success" "GitHub Actions workflow exists"
    
    # Check for required secrets in workflow
    secrets=(
        "FIREBASE_API_KEY"
        "FIREBASE_AUTH_DOMAIN"
        "FIREBASE_PROJECT_ID"
        "FIREBASE_STORAGE_BUCKET"
        "FIREBASE_MESSAGING_SENDER_ID"
        "FIREBASE_APP_ID"
        "FIREBASE_SERVICE_ACCOUNT"
        "CLOUDFLARE_API_TOKEN"
        "CLOUDFLARE_ACCOUNT_ID"
    )
    
    print_status "info" "Ensure these secrets are set in GitHub:"
    for secret in "${secrets[@]}"; do
        if grep -q "$secret" .github/workflows/deploy.yml; then
            echo "    • $secret"
        fi
    done
else
    print_status "error" "GitHub Actions workflow not found"
fi

echo ""
echo "7. Checking Firebase Configuration"
echo "---------------------------------"

if [ -f "firebase.json" ]; then
    print_status "success" "firebase.json exists"
    
    # Check hosting configuration
    if grep -q '"hosting"' firebase.json; then
        print_status "success" "Firebase hosting is configured"
    else
        print_status "warning" "Firebase hosting configuration not found"
    fi
fi

if command -v firebase &> /dev/null; then
    print_status "success" "Firebase CLI is installed"
else
    print_status "warning" "Firebase CLI not installed - run: npm install -g firebase-tools"
fi

echo ""
echo "8. Checking Cloudflare Configuration"
echo "-----------------------------------"

if [ -f ".github/workflows/deploy.yml" ]; then
    if grep -q "cloudflare/pages-action" .github/workflows/deploy.yml; then
        print_status "success" "Cloudflare Pages action is configured"
    else
        print_status "error" "Cloudflare Pages action not found in workflow"
    fi
fi

echo ""
echo "================================================"
echo "Verification Summary"
echo "================================================"
echo -e "${GREEN}Success: $SUCCESS${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo -e "${RED}Errors: $ERRORS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Ready for deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Commit and push your changes: git push origin main"
    echo "2. Monitor GitHub Actions: https://github.com/[owner]/[repo]/actions"
    echo "3. Check deployments:"
    echo "   - Cloudflare: https://dash.cloudflare.com/"
    echo "   - Firebase: https://console.firebase.google.com/"
    exit 0
else
    echo -e "${RED}✗ Please fix the errors before deploying${NC}"
    echo ""
    echo "Common fixes:"
    echo "• Missing files: Ensure all source files are committed"
    echo "• Environment variables: Copy .env.example to .env.local and fill values"
    echo "• Dependencies: Run 'npm install'"
    echo "• Git setup: Initialize git repository if needed"
    exit 1
fi
