import Link from 'next/link';
import { AuthWrapper } from '../components/AuthWrapper';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Home() {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              AWS Amplify Gen2 Authentication Demo
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription>
                Sign in or create an account to explore the authentication features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/auth/signin" className="w-full">
                <Button className="w-full" size="lg">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="w-full">
                <Button variant="outline" className="w-full" size="lg">
                  Create Account
                </Button>
              </Link>
              <div className="pt-4 border-t">
                <Link href="/test-page" className="w-full">
                  <Button variant="ghost" className="w-full text-sm" size="sm">
                    View Demo Features →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Built with AWS Amplify Gen2, Next.js, and TypeScript</p>
            <p className="mt-1">Featuring Google & GitHub OAuth authentication</p>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
