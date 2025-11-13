// src/pages/Login.tsx
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [, navigate] = useLocation();

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // RESET ERRORS
    setEmailError('');
    setPasswordError('');

    let valid = true;

    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email');
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be 6+ characters');
      valid = false;
    }

    if (!valid) return;

    // SUCCESS — SILENT LOGIN
    localStorage.setItem('user', JSON.stringify({
      email,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
    }));

    navigate('/');
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#693e1e] font-bold text-lg">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@halisi.co.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-14 text-lg border-2 rounded-xl ${
                    emailError 
                      ? "border-red-500 focus:border-red-500 ring-red-500/30" 
                      : "border-[#693e1e]/30 focus:border-[#ced000] focus:ring-[#ced000]/30"
                  }`}
                />
                {emailError && <p className="text-red-600 text-sm font-medium">{emailError}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#693e1e] font-bold text-lg">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-14 text-lg border-2 rounded-xl ${
                    passwordError 
                      ? "border-red-500 focus:border-red-500 ring-red-500/30" 
                      : "border-[#693e1e]/30 focus:border-[#ced000] focus:ring-[#ced000]/30"
                  }`}
                />
                {passwordError && <p className="text-red-600 text-sm font-medium">{passwordError}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-16 text-xl font-bold bg-[#ced000] hover:bg-[#b8b800] text-[#693e1e] shadow-xl rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                {isSignup ? "CREATE HALISI ACCOUNT" : "LOG IN TO HALISI"}
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
              className="w-full h-14 text-lg font-medium border-2 border-[#693e1e]/50 text-[#693e1e] hover:bg-[#ced000]/10 rounded-xl"
              onClick={() => setIsSignup(!isSignup)}
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