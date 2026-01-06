# AWS Deployment Configuration

## Infrastructure Overview

### Backend (us-east-1)
- **Region**: us-east-1
- **Stack**: amplify-gen2comparisonfresh-tbaltzakis-sandbox-1ce557e9e4
- **GraphQL API**: https://esqoprnopnhgja3zcezo3k2vfu.appsync-api.us-east-1.amazonaws.com/graphql
- **User Pool**: us-east-1_m7QOCwEqs
- **User Pool Client**: 4koi2qju8s48arhrnhuu4p2vm4

### Frontend (eu-central-1)
- **S3 Bucket**: gen2-static-site-1767625048
- **CloudFront**: E134SCTR0QGQKJ
- **Domain**: d1947b4i8egesz.cloudfront.net
- **Custom Domain**: baltzakisthemis.com, www.baltzakisthemis.com

### Active S3 Buckets
- `gen2-static-site-1767625048` (Frontend - eu-central-1)
- `amplify-gen2comparisonfre-amplifydataamplifycodege-ctmj20opvhhc` (Backend - us-east-1)
- `amplify-gen2comparisonfre-modelintrospectionschema-oat1ouyayji9` (Schema - us-east-1)

### OAuth Configuration
- **Google Client ID**: 252848180858-rlv4jkvs95a4ct9gs2bf0kggm8tc4rq6.apps.googleusercontent.com
- **Stored in**: AWS Secrets Manager (us-east-1)
- **Callback URLs**: 
  - http://localhost:50000/auth/callback
  - https://baltzakisthemis.com/auth/callback
  - https://www.baltzakisthemis.com/auth/callback

### Admin Access
- **Admin Domains**: @cloudless.gr
- **Specific Admin**: tbaltzakis@cloudless.com
- **Admin Route**: /admin
- **User Route**: /app

## Deployment Commands

### 1. Build Application
```bash
npm run build
```

### 2. Deploy Backend
```bash
export AWS_REGION=us-east-1 && npx ampx sandbox --once
```

### 3. Deploy Frontend
```bash
# Sync static assets
aws s3 sync .next/static s3://gen2-static-site-1767625048/_next/static --delete

# Sync server files
aws s3 sync .next/server s3://gen2-static-site-1767625048/_next/server --delete

# Sync HTML pages
aws s3 sync .next/server/app s3://gen2-static-site-1767625048/ --exclude "*.js" --exclude "*.json" --exclude "*.map" --exclude "*.rsc" --exclude "*.meta" --include "*.html" --delete
```

### 4. Invalidate CloudFront
```bash
aws cloudfront create-invalidation --distribution-id E134SCTR0QGQKJ --paths "/*"
```

### 5. Update OAuth Secrets (if needed)
```bash
aws secretsmanager put-secret-value --region us-east-1 --secret-id GOOGLE_CLIENT_ID --secret-string "YOUR_CLIENT_ID"
aws secretsmanager put-secret-value --region us-east-1 --secret-id GOOGLE_CLIENT_SECRET --secret-string "YOUR_CLIENT_SECRET"
```

## Development Commands

### Start Development
```bash
npm run dev:sandbox
```

### Test Authentication
- **Local**: http://localhost:50000
- **Production**: https://baltzakisthemis.com

## Monthly Cost Estimate
- **AWS Secrets Manager**: $0.80/month (2 secrets)
- **All other services**: $0.00 (Free Tier)
- **Total**: ~$0.80/month

## Troubleshooting

### OAuth Issues
1. Check Google Cloud Console OAuth client configuration
2. Verify callback URLs match exactly
3. Wait 10-15 minutes for changes to propagate
4. Clear browser cache

### Deployment Issues
1. Ensure backend is deployed first
2. Build frontend with `npm run build`
3. Sync all files to S3
4. Invalidate CloudFront cache
5. Wait 10-15 minutes for invalidation

### Access Denied Errors
- Usually means HTML files are missing from S3
- Run the full deployment commands above
- Check CloudFront invalidation status