# Environment Variables Documentation - Lovtiti Agro Mart

## Overview
This document outlines all environment variables required for the Lovtiti Agro Mart platform, supporting the comprehensive agricultural ecosystem with multiple user types and blockchain integration.

## Required Environment Variables

### Database Configuration
```bash
# Neon PostgreSQL Database URL
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

### Authentication (Clerk)
```bash
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."
```

### Blockchain (Hedera Hashgraph)
```bash
# Hedera Testnet Configuration
HEDERA_ACCOUNT_ID="0.0.123456"
HEDERA_PRIVATE_KEY="0x..."
HEDERA_NETWORK="testnet"
HEDERA_MIRROR_NODE_URL="https://testnet.mirrornode.hedera.com"

# Hedera Mainnet Configuration (for production)
HEDERA_MAINNET_ACCOUNT_ID="0.0.123456"
HEDERA_MAINNET_PRIVATE_KEY="0x..."
```

### Payment Processing
```bash
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_CONNECT_CLIENT_ID="ca_..."

# Alternative Payment Methods
PAYPAL_CLIENT_ID="..."
PAYPAL_CLIENT_SECRET="..."
PAYSTACK_PUBLIC_KEY="..."
PAYSTACK_SECRET_KEY="..."

# Mobile Money Integration
MPESA_CONSUMER_KEY="..."
MPESA_CONSUMER_SECRET="..."
MPESA_BUSINESS_SHORT_CODE="..."
MPESA_PASSKEY="..."
```

### File Storage (IPFS)
```bash
# IPFS Configuration
IPFS_GATEWAY_URL="https://ipfs.io/ipfs/"
IPFS_API_URL="https://api.pinata.cloud"
PINATA_API_KEY="..."
PINATA_SECRET_KEY="..."
```

### Caching & Session Management
```bash
# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD=""
REDIS_DB="0"

# Session Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Search & Analytics
```bash
# Elasticsearch Configuration
ELASTICSEARCH_URL="http://localhost:9200"
ELASTICSEARCH_USERNAME=""
ELASTICSEARCH_PASSWORD=""
ELASTICSEARCH_INDEX_PREFIX="lovittiagro"

# Google Analytics
GOOGLE_ANALYTICS_ID="GA-..."

# Mixpanel
MIXPANEL_TOKEN="..."
```

### Communication & Notifications
```bash
# STREAM API Configuration (Messaging & Video Calling)
STREAM_API_KEY="..."
STREAM_API_SECRET="..."
STREAM_APP_ID="..."
STREAM_REGION="us-east-1"

# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@lovittiagro.com"

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1234567890"

# Push Notifications (Firebase)
FIREBASE_PROJECT_ID="lovittiagro"
FIREBASE_PRIVATE_KEY="..."
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@lovittiagro.iam.gserviceaccount.com"
```

### USSD Service Configuration
```bash
# USSD Gateway Configuration
USSD_GATEWAY_URL="https://api.africastalking.com/version1/ussd"
USSD_USERNAME="sandbox"
USSD_API_KEY="..."
USSD_PORT="3001"
USSD_SESSION_TIMEOUT="300"
```

### External Services
```bash
# Google Maps API (for location services)
GOOGLE_MAPS_API_KEY="AIza..."

# Weather API (for agricultural insights)
WEATHER_API_KEY="..."
WEATHER_API_URL="https://api.openweathermap.org/data/2.5"

# Market Data API (for pricing information)
MARKET_DATA_API_KEY="..."
MARKET_DATA_API_URL="https://api.marketdata.com"
```

### Monitoring & Logging
```bash
# Sentry Configuration (Error Tracking)
SENTRY_DSN="https://..."
SENTRY_ORG="lovittiagro"
SENTRY_PROJECT="lovittiagro-mart"

# Logging Configuration
LOG_LEVEL="info"
LOG_FORMAT="json"
```

### Security & Encryption
```bash
# Encryption Keys
ENCRYPTION_KEY="your-32-character-encryption-key"
JWT_SECRET="your-jwt-secret-key"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"
```

### Development & Testing
```bash
# Environment
NODE_ENV="development"

# Debug Configuration
DEBUG="lovittiagro:*"

# Test Configuration
TEST_DATABASE_URL="postgresql://test_user:test_pass@localhost:5432/test_db"
```

### Deployment Configuration
```bash
# Vercel Configuration
VERCEL_URL=""
VERCEL_ENV="development"

# Domain Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# CDN Configuration
CDN_URL="https://cdn.lovittiagro.com"
CDN_API_KEY="..."
```

### Feature Flags
```bash
# Feature Toggles
ENABLE_USSD="true"
ENABLE_MOBILE_APP="true"
ENABLE_ANALYTICS="true"
ENABLE_REAL_TIME_TRACKING="true"
ENABLE_VETERINARY_SERVICES="true"
ENABLE_SUPPLY_CHAIN_TRACKING="true"
```

### Compliance & Regulatory
```bash
# GDPR Compliance
GDPR_ENABLED="true"
DATA_RETENTION_DAYS="2555"

# KYC/AML Configuration
KYC_REQUIRED="true"
AML_CHECK_ENABLED="true"

# Regulatory Compliance
REGULATORY_REGION="AFRICA"
COMPLIANCE_MODE="strict"
```

### Performance & Optimization
```bash
# Caching Configuration
CACHE_TTL="3600"
CACHE_MAX_SIZE="1000"

# Image Optimization
IMAGE_OPTIMIZATION_ENABLED="true"
IMAGE_MAX_SIZE="5242880"
IMAGE_ALLOWED_FORMATS="jpg,jpeg,png,webp"

# API Rate Limiting
API_RATE_LIMIT="1000"
API_RATE_LIMIT_WINDOW="3600"
```

### Backup & Disaster Recovery
```bash
# Backup Configuration
BACKUP_ENABLED="true"
BACKUP_SCHEDULE="0 2 * * *"
BACKUP_RETENTION_DAYS="30"

# Disaster Recovery
DR_ENABLED="true"
DR_REGION="us-east-1"
DR_BACKUP_URL="s3://lovittiagro-backups"
```

### Social Media Integration
```bash
# Social Media Integration
FACEBOOK_APP_ID="..."
FACEBOOK_APP_SECRET="..."
TWITTER_API_KEY="..."
TWITTER_API_SECRET="..."
LINKEDIN_CLIENT_ID="..."
LINKEDIN_CLIENT_SECRET="..."
```

### Business Intelligence
```bash
# Business Intelligence
BI_ENABLED="true"
BI_API_KEY="..."
BI_DASHBOARD_URL="https://bi.lovittiagro.com"
```

## Environment Setup Instructions

### 1. Development Environment
1. Copy the environment variables to your `.env` file
2. Fill in the required values for your development setup
3. Ensure all services (Redis, Elasticsearch) are running locally
4. Set `NODE_ENV="development"`

### 2. Production Environment
1. Use secure, production-grade values for all keys
2. Enable all security features and compliance settings
3. Set up proper monitoring and logging
4. Configure backup and disaster recovery
5. Set `NODE_ENV="production"`

### 3. Testing Environment
1. Use separate test databases and services
2. Set `NODE_ENV="test"`
3. Use test-specific API keys and configurations
4. Enable test mode for all external services

## Security Considerations

### Sensitive Data
- Never commit environment variables to version control
- Use secure key management systems in production
- Rotate keys regularly
- Use different keys for different environments

### Access Control
- Limit access to environment variables to authorized personnel only
- Use role-based access control for different environments
- Monitor access to sensitive configuration data

### Compliance
- Ensure all environment variables comply with relevant regulations
- Implement proper data retention policies
- Enable audit logging for sensitive operations

## Troubleshooting

### Common Issues
1. **Database Connection Errors**: Check `DATABASE_URL` format and credentials
2. **Authentication Issues**: Verify Clerk keys and webhook configuration
3. **Blockchain Errors**: Ensure Hedera account has sufficient HBAR balance
4. **Payment Failures**: Check Stripe keys and webhook configuration
5. **File Upload Issues**: Verify IPFS configuration and API keys

### Debug Mode
Enable debug mode by setting:
```bash
DEBUG="lovittiagro:*"
LOG_LEVEL="debug"
```

This will provide detailed logging for troubleshooting issues.

## Support
For environment configuration support:
- **Email**: dev-support@lovittiagro.com
- **Documentation**: https://docs.lovittiagro.com
- **Status Page**: https://status.lovittiagro.com
