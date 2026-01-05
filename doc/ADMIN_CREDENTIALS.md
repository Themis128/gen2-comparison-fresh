# Admin User Credentials

## Admin User Details

**Username/Email:** admin@admin.com
**Password:** Admin123!@#
**Role:** Administrator

## How to Use

1. **Sign Up** (if user doesn't exist):
   - Go to `/auth/signup`
   - Use the email `admin@admin.com`
   - Set password to `Admin123!@#`
   - Complete email verification

2. **Sign In**:
   - Go to `/auth/signin`
   - Enter email: `admin@admin.com`
   - Enter password: `Admin123!@#`

3. **Admin Detection**:
   - The application automatically detects admin users based on email patterns
   - Emails containing "admin", ending with "@admin.com", or ending with "@company.com" are treated as admin users
   - Admin users are automatically redirected to `/admin` after sign-in

## Admin Features Available

- **Admin Panel** (`/admin`): Full administrative dashboard
- **User Management**: Add, edit, delete users
- **System Monitoring**: View system health, performance metrics
- **Security Alerts**: Monitor and resolve security issues
- **Audit Logs**: Track all administrative actions
- **Main App Access**: Navigate back to main application via "Main App" button

## Alternative Admin Emails

You can also create admin users with these email patterns:
- `admin@company.com`
- `superadmin@admin.com`
- `administrator@company.com`
- Any email containing the word "admin"

## Security Notes

- Change the default password after first login
- Use strong, unique passwords in production
- Enable multi-factor authentication when available
- Regularly rotate admin credentials

## Creating Additional Admin Users

To create more admin users:

1. Use the admin panel user management interface
2. Or sign up with an email matching the admin pattern
3. Or modify the admin detection logic in the codebase if needed

---

*Generated on: January 4, 2026*
*Application: AWS Amplify Gen2 Authentication Demo*
