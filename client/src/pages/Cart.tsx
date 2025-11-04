import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import breakfastCover from "@assets/generated_images/Breakfast_recipes_eBook_cover_9d71df24.png";
import mainDishCover from "@assets/generated_images/Main_dishes_eBook_cover_27176a57.png";

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      title: "Kenyan Breakfast Delights",
      price: 12.99,
      quantity: 1,
      image: breakfastCover,
    },
    {
      id: "2",
      title: "Classic Main Dishes",
      price: 15.99,
      quantity: 2,
      image: mainDishCover,
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={cartItems.length} />
      
      <main className="flex-1">
        <div className="bg-muted py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-heading text-4xl font-bold" data-testid="text-cart-title">
              Shopping Cart
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-6">Your cart is empty</p>
                <Link href="/catalog">
                  <Button data-testid="button-continue-shopping-empty">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} data-testid={`card-cart-item-${item.id}`}>
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="w-24 h-32 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            data-testid={`img-cart-item-${item.id}`}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-heading font-semibold text-lg mb-2" data-testid={`text-cart-item-title-${item.id}`}>
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4">
                              Digital Download
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, -1)}
                                data-testid={`button-decrease-quantity-${item.id}`}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                className="w-16 text-center"
                                readOnly
                                data-testid={`input-quantity-${item.id}`}
                              />
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, 1)}
                                data-testid={`button-increase-quantity-${item.id}`}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-heading text-xl font-bold" data-testid={`text-cart-item-price-${item.id}`}>
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeItem(item.id)}
                                data-testid={`button-remove-item-${item.id}`}
                              >
                                <Trash2 className="h-5 w-5 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h2 className="font-heading text-xl font-semibold mb-6" data-testid="text-order-summary">
                      Order Summary
                    </h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (10%)</span>
                        <span data-testid="text-tax">${tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-4 flex justify-between font-heading text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary" data-testid="text-total">${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <Link href="/checkout">
                      <Button size="lg" className="w-full mb-4" data-testid="button-proceed-checkout">
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <Link href="/catalog">
                      <Button size="lg" variant="outline" className="w-full" data-testid="button-continue-shopping">
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
