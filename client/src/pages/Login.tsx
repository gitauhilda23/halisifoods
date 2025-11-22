import { useState } from 'react';
import { useLocation } from 'wouter';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, navigate] = useLocation();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(
        err.code === 'auth/email-already-in-use' ? 'Email already registered' :
        err.code === 'auth/invalid-credential' ? 'Wrong email or password' :
        err.code === 'auth/weak-password' ? 'Password should be at least 6 characters' :
        'Something went wrong. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      setError('Google sign-in failed. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <img src="/halisi-logo.png" alt="Halisi Foods & Recipes" className="mx-auto h-40 w-auto drop-shadow-2xl" />
          <p className="mt-4 text-xl font-medium text-[#693e1e]/80 tracking-wider">
            Authentic Kenyan Flavors
          </p>
        </div>

        <Card className="border-2 border-[#693e1e] shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-b from-[#ced000]/5 to-transparent pb-8">
            <CardTitle className="text-4xl font-bold text-[#693e1e]">
              {isSignup ? "Join Halisi" : "Welcome Back"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <form onSubmit={handleEmailAuth} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#693e1e] font-bold text-lg">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@halisi.co.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 text-lg border-2 rounded-xl border-[#693e1e]/30 focus:border-[#ced000] focus:ring-[#ced000]/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#693e1e] font-bold text-lg">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-14 text-lg border-2 rounded-xl border-[#693e1e]/30 focus:border-[#ced000] focus:ring-[#ced000]/30"
                />
              </div>

              {error && <p className="text-red-600 text-sm font-medium text-center">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 text-xl font-bold bg-[#ced000] hover:bg-[#b8b800] text-[#693e1e] shadow-xl rounded-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-70"
              >
                {loading ? 'Please wait...' : (isSignup ? "CREATE HALISI ACCOUNT" : "LOG IN TO HALISI")}
              </Button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t-2 border-[#693e1e]/20" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gray-50 px-6 text-[#693e1e]/70 font-bold text-lg">OR</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-14 text-lg font-medium border-2 border-[#693e1e]/50 text-[#693e1e] hover:bg-[#ced000]/10 rounded-xl flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-14 text-lg font-medium border-2 border-[#693e1e]/50 text-[#693e1e] hover:bg-[#ced000]/10 rounded-xl"
              onClick={() => setIsSignup(!isSignup)}
              disabled={loading}
            >
              {isSignup ? "Already have an account? Log In" : "New here? Create Account"}
            </Button>
          </CardContent>

          <CardFooter className="flex justify-center pb-10 bg-gradient-to-t from-[#ced000]/5 to-transparent">
            <p className="text-center text-[#693e1e]/80 font-medium text-lg">
              © 2025 Halisi Foods & Recipes • Proudly Kenyan
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}