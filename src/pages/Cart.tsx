import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Minus, Plus, X, ShoppingCart } from "lucide-react";

// WordPress/WooCommerce Cart page pattern
// Cart data managed via React context, ready for WordPress integration
const Cart = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs items={[{ label: "Cart" }]} />
          
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="h-24 w-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add products to your cart to continue</p>
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: "Cart" }]} />
        
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-0">
                {/* Desktop Header */}
                <div className="hidden lg:grid grid-cols-12 gap-4 p-4 bg-muted font-semibold text-sm">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>
                <Separator className="hidden lg:block" />

                {/* Cart Items */}
                {items.map((item, index) => (
                  <div key={item.id}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
                      {/* Product Info */}
                      <div className="lg:col-span-6 flex gap-4">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex-1">
                          <Link to={`/product/${item.id}`}>
                            <h3 className="font-semibold hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                      </div>

                      {/* Price - Mobile */}
                      <div className="lg:hidden flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Price:</span>
                        <span className="font-semibold">${item.price.toFixed(2)}</span>
                      </div>

                      {/* Price - Desktop */}
                      <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
                        <span className="font-semibold">${item.price.toFixed(2)}</span>
                      </div>

                      {/* Quantity */}
                      <div className="lg:col-span-2 flex items-center justify-between lg:justify-center gap-3">
                        <span className="text-sm text-muted-foreground lg:hidden">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 h-8 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="lg:col-span-2 flex items-center justify-between lg:justify-center">
                        <span className="text-sm text-muted-foreground lg:hidden">Total:</span>
                        <span className="font-bold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {index < items.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-between items-center">
              <Link to="/shop">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
              <Button variant="destructive" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Cart Totals - WordPress/WooCommerce pattern */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold">Cart Totals</h2>
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${getCartTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="block">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
