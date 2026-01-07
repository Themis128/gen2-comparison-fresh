'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { signInWithRedirect } from 'aws-amplify/auth';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { twMerge } from 'tailwind-merge';

import { AuthLogo } from '../../../components/Logo';
import { signInWithFlow, checkAuthStatus, signOutUser } from '../../../lib/useAuth';
import { getCurrentAuthUser, getRoleBasedRedirect } from '../../../lib/roleBasedAuth';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Gradient Mesh Component
const vert = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
}
`;

const frag = (distortion: number) => `
precision highp float;
uniform float uTime;
uniform float uSwirl;
uniform float uSpeed;
uniform float uScale;
uniform float uOffsetX;
uniform float uOffsetY;
uniform float uRotation;
uniform float uWaveAmp;
uniform float uWaveFreq;
uniform float uWaveSpeed;
uniform float uGrain;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uResolution;
varying vec2 vUv;

float wave(vec2 uv, float freq, float speed, float time) {
    return sin(uv.x * freq + time * speed) * cos(uv.y * freq + time * speed);
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec3 colorDodge(vec3 base, vec3 blend) {
    return min(base / (1.0 - blend + 0.0001), 1.0);
}

void main() {
    float mr = min(uResolution.x, uResolution.y);
    vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
    uv = uv * uScale + vec2(uOffsetX, uOffsetY);
    float cosR = cos(uRotation);
    float sinR = sin(uRotation);
    uv = vec2(uv.x * cosR - uv.y * sinR, uv.x * sinR + uv.y * cosR);
    uv.x += wave(uv, uWaveFreq, uWaveSpeed, uTime) * uWaveAmp;
    uv.y += wave(uv + 10.0, uWaveFreq * 1.5, uWaveSpeed * 0.8, uTime) * uWaveAmp * 0.5;
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    angle += uSwirl * radius;
    uv = vec2(cos(angle), sin(angle)) * radius;
    float d = -uTime * 0.5 * uSpeed;
    float a = 0.0;
    for (float i = 0.0; i < ${distortion.toFixed(1)}; ++i) {
        a += cos(i - d - a * uv.x);
        d += sin(uv.y * i + a);
    }
    d += uTime * 0.5 * uSpeed;
    float mix1 = (sin(d) + 1.0) * 0.5;
    float mix2 = (cos(a) + 1.0) * 0.5;
    vec3 col = mix(uColorA, uColorB, mix1);
    col = mix(col, uColorC, mix2);
    float grain = (random(gl_FragCoord.xy + uTime) - 0.5) * uGrain;
    vec3 grainCol = vec3(0.5 + grain);
    col = colorDodge(col, grainCol);
    gl_FragColor = vec4(col, 1.0);
}
`;

interface GradientMeshProps {
  colors?: string[];
  distortion?: number;
  swirl?: number;
  speed?: number;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  rotation?: number;
  waveAmp?: number;
  waveFreq?: number;
  waveSpeed?: number;
  grain?: number;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return [r, g, b];
};

function GradientMesh({
  colors = ['#3b2a8d', '#aaa7d7', '#f75092'],
  distortion = 5,
  swirl = 0.5,
  speed = 1.0,
  scale = 1,
  offsetX = 0.0,
  offsetY = 0.0,
  rotation = 90,
  waveAmp = 0.1,
  waveFreq = 10.0,
  waveSpeed = 0.2,
  grain = 0.06,
}: GradientMeshProps) {
  const ctnDom = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ctnDom.current) return;

    const ctn = ctnDom.current;
    const renderer = new Renderer();
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    function resize() {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
    }
    window.addEventListener('resize', resize, false);
    resize();

    const geometry = new Triangle(gl);
    const rgbColors = colors.slice(0, 3).map(hexToRgb);
    const uniforms: Record<string, { value: number | Color }> = {
      uTime: { value: 0 },
      uSwirl: { value: swirl },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uOffsetX: { value: offsetX },
      uOffsetY: { value: offsetY },
      uRotation: { value: rotation },
      uWaveAmp: { value: waveAmp },
      uWaveFreq: { value: waveFreq },
      uWaveSpeed: { value: waveSpeed },
      uResolution: {
        value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height),
      },
      uGrain: { value: grain },
    };

    const labels = ['A', 'B', 'C'];
    rgbColors.forEach((c, i) => {
      uniforms[`uColor${labels[i]}`] = { value: new Color(...c) };
    });

    const program = new Program(gl, {
      vertex: vert,
      fragment: frag(distortion),
      uniforms,
    });

    const mesh = new Mesh(gl, { geometry, program });

    let animateId: number;
    function update(t: number) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    }
    animateId = requestAnimationFrame(update);

    ctn.appendChild(gl.canvas);

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    colors,
    distortion,
    swirl,
    speed,
    scale,
    offsetX,
    offsetY,
    rotation,
    waveAmp,
    waveFreq,
    waveSpeed,
    grain,
  ]);

  return (
    <div
      ref={ctnDom}
      style={{ width: '100%', height: '100%', position: 'absolute', overflow: 'hidden' }}
    />
  );
}

// Label Component
const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

// Button Component
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium outline-offset-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm shadow-black/5 hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm shadow-black/5 hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm shadow-black/5 hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm shadow-black/5 hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-11 rounded-lg px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

// Input Component
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'shadow-xs flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

// Password Input Component
interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    return (
      <div className="grid w-full items-center gap-2">
        {label && <Label>{label}</Label>}
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            className={cn('pe-10', className)}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center text-muted-foreground/80 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

// Main Sign In Component
function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const checkIfAlreadySignedIn = async () => {
      const authUser = await getCurrentAuthUser();
      if (authUser) {
        const redirectPath = getRoleBasedRedirect(authUser.role);
        router.replace(redirectPath);
      }
    };
    checkIfAlreadySignedIn();
  }, [router, redirectPath]);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Check if user is already authenticated before attempting sign in
      const authUser = await getCurrentAuthUser();
      if (authUser) {
        console.log('User is already authenticated, redirecting...');
        const redirectPath = getRoleBasedRedirect(authUser.role);
        router.replace(redirectPath);
        return;
      }

      // Use USER_SRP_AUTH flow for secure password authentication
      const result = await signInWithFlow(email, password, {
        authFlowType: 'USER_SRP_AUTH',
      });

      if (result.nextStep.signInStep === 'DONE') {
        const authUser = await getCurrentAuthUser();
        const redirectPath = authUser ? getRoleBasedRedirect(authUser.role) : '/dashboard';
        router.replace(redirectPath);
      }
    } catch (err: any) {
      // Handle case where user is already authenticated (fallback)
      const errorMessage = err.message || '';
      const errorName = err.name || '';
      if (
        errorName.includes('UserAlreadyAuthenticatedException') ||
        errorMessage.includes('already a signed in user') ||
        errorMessage.includes('already signed in') ||
        errorName.includes('AlreadyAuthenticated')
      ) {
        console.log('User is already authenticated, redirecting...');
        const authUser = await getCurrentAuthUser();
        const redirectPath = authUser ? getRoleBasedRedirect(authUser.role) : '/dashboard';
        router.replace(redirectPath);
        return;
      }

      console.error('Sign in error:', err);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Check if user is already authenticated
      const currentUser = await checkAuthStatus();
      if (currentUser) {
        // Sign out the current user before signing in with Google
        await signOutUser();
      }
      await signInWithRedirect({ provider: { custom: 'Google' } });
    } catch (error) {
      console.error('Google sign in error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center">
          <AuthLogo href="/" />
        </div>

        <div className="flex w-full flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <form onSubmit={handleSignIn} className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  Sign in to your account to continue
                </p>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-primary underline-offset-4 hover:underline"
                      data-testid="forgot-password-link"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <PasswordInput
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  data-testid="sign-up-link"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <GradientMesh
          colors={['#6366f1', '#8b5cf6', '#ec4899']}
          distortion={8}
          swirl={0.3}
          speed={1.2}
          rotation={45}
          waveAmp={0.15}
          waveFreq={15}
          waveSpeed={0.3}
          grain={0.08}
        />
        <div className="bg-linear-to-t absolute inset-0 from-background/80 via-background/20 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end p-8 pb-12">
          <blockquote className="space-y-4 text-center">
            <p className="text-2xl font-semibold text-foreground">
              &ldquo;Secure authentication powered by AWS Amplify&rdquo;
            </p>
            <cite className="block text-sm not-italic text-muted-foreground">
              Enterprise-grade security for your applications
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;