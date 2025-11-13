// src/components/PurchaseModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: ({ email, phone }: { email: string; phone: string }) => void;
  packageName: string;
  price: number;
}

export default function PurchaseModal({
  isOpen,
  onClose,
  onSubmit,
  packageName,
  price,
}: PurchaseModalProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email");
      return;
    }

    if (!/^07\d{8}$/.test(phone) && !/^01\d{8}$/.test(phone)) {
      alert("Please enter a valid Kenyan phone number (07xxxxxxxx or 01xxxxxxxx)");
      return;
    }

    setIsLoading(true);

    // Simulate payment initiation
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      // Trigger Paystack after success animation
      setTimeout(() => {
        onSubmit({ email, phone });
        onClose();
        setIsSuccess(false);
        setEmail("");
        setPhone("");
      }, 2000);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-900 text-center">
            Complete Your Purchase
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-75"></div>
              <CheckCircle className="w-24 h-24 text-green-600 relative" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold text-gray-800">Payment Request Sent!</p>
              <p className="text-gray-600">Check your phone and approve the M-Pesa prompt</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="bg-amber-100 border-2 border-amber-300 rounded-xl p-4 text-center">
              <p className="text-sm text-amber-700 font-medium">You are buying</p>
              <p className="text-lg font-bold text-amber-900 mt-1">{packageName}</p>
              <p className="text-3xl font-bold text-amber-900 mt-3">
                KSh {price.toLocaleString()}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-12 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  M-Pesa Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="mt-2 h-12 border-amber-300 focus:border-amber-500 focus:ring-amber-500 font-mono text-lg tracking-wider"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter number registered with M-Pesa</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 border-gray-300"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  "Pay with M-Pesa"
                )}
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>After clicking, approve the prompt on your phone</p>
              <p className="font-medium text-amber-700">You will receive your download link instantly</p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}