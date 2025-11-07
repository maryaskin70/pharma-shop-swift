import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Star, ShieldCheck, Truck, Minus, Plus } from "lucide-react";
import { useState } from "react";

// WordPress/WooCommerce Product Detail page pattern
// Product data will be fetched from: /wp-json/wc/v3/products/{id}

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product && product.inStock) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
        category: product.category,
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs 
          items={[
            { label: "Shop", href: "/shop" },
            { label: product.category, href: "/shop" },
            { label: product.name }
          ]} 
        />

        {/* Product Detail */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-4xl font-bold text-primary mb-2">
                ${product.price.toFixed(2)}
              </p>
              {product.inStock ? (
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Product Details</h3>
              <p className="text-muted-foreground">{product.description}</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[140px]">Brand:</span>
                  <span className="text-muted-foreground">{product.brand}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[140px]">Active Ingredient:</span>
                  <span className="text-muted-foreground">{product.activeIngredient}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[140px]">Dosage:</span>
                  <span className="text-muted-foreground">{product.dosage}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="font-semibold">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!product.inStock}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!product.inStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full" 
                size="lg" 
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Link to="/checkout">
                <Button 
                  variant="secondary" 
                  className="w-full" 
                  size="lg" 
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                >
                  Buy Now
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-accent" />
                    <span className="text-sm">Pharmacy Grade</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-accent" />
                    <span className="text-sm">Free Shipping</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Tabs - WordPress/WooCommerce pattern */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="additional">Additional Info</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-6 space-y-2">
                  <h3 className="font-semibold text-lg mb-3">Key Features</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Pharmacy grade quality from original manufacturers</li>
                    <li>Tested and verified for purity and potency</li>
                    <li>Discreet packaging and delivery</li>
                    <li>30-day money-back guarantee</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="additional" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 py-3 border-b">
                    <span className="font-medium">Brand</span>
                    <span className="text-muted-foreground">{product.brand}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3 border-b">
                    <span className="font-medium">Active Ingredient</span>
                    <span className="text-muted-foreground">{product.activeIngredient}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3 border-b">
                    <span className="font-medium">Dosage</span>
                    <span className="text-muted-foreground">{product.dosage}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3">
                    <span className="font-medium">Category</span>
                    <span className="text-muted-foreground">{product.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">Be the first to review this product</p>
                  <Button variant="outline" className="mt-4">Write a Review</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-3">
                      <div className="aspect-square mb-3 bg-muted rounded-md overflow-hidden">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span className="text-xs">{relatedProduct.rating}</span>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          ${relatedProduct.price.toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
