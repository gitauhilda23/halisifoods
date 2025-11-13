// src/components/NewsletterSection.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-primary text-primary-foreground border-primary-border">
          <CardContent className="p-8 md:p-12">

            {/* Header */}
            <div className="text-center mb-6">
              {status === "success" ? (
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
              ) : (
                <Mail className="h-12 w-12 mx-auto mb-4" />
              )}

              <h2 className="font-heading text-3xl font-bold mb-3" data-testid="text-newsletter-title">
                {status === "success" ? "Asante Sana!" : "Get Fresh Recipes Weekly"}
              </h2>

              <p
                className="text-primary-foreground/90 max-w-2xl mx-auto"
                data-testid="text-newsletter-subtitle"
              >
                {status === "success"
                  ? "You're now part of the Halisi family. Check your inbox weekly for delicious Kenyan recipes ♡"
                  : "Join thousands of food lovers and receive new Kenyan recipes, cooking tips, and exclusive offers delivered to your inbox."}
              </p>
            </div>

            {/* Form or Success */}
            {status === "success" ? (
              <div className="text-center py-6">
                <p className="text-primary-foreground/80 text-sm">
                  Fresh recipes coming your way every week
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  className="bg-white text-foreground flex-1"
                  required
                  disabled={status === "loading"}
                  data-testid="input-newsletter-signup"
                />

                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  disabled={status === "loading"}
                  className="flex items-center gap-2"
                  data-testid="button-newsletter-signup"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
            )}

            {/* Error message */}
            {status === "error" && (
              <p className="text-center text-red-300 text-sm mt-4">
                Oops! Something went wrong. Please try again.
              </p>
            )}

            {/* Privacy note */}
            {status !== "success" && (
              <p className="text-center text-sm text-primary-foreground/70 mt-4">
                We respect your privacy. Unsubscribe anytime.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}