import { useParams, Link } from "react-router-dom";
import { products, ProductVariation } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Star, ShieldCheck, Truck, Minus, Plus, Share2, Tag, Package, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// WordPress/WooCommerce Product Detail page pattern
// Product data will be fetched from: /wp-json/wc/v3/products/{id}

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // WooCommerce Variation State
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [currentSku, setCurrentSku] = useState("");
  
  // Initialize default attributes and variation
  useEffect(() => {
    if (product) {
      if (product.type === "variable" && product.attributes && product.variations) {
        // Set default attributes
        const defaults = product.defaultAttributes || {};
        product.attributes.forEach(attr => {
          if (attr.variation && !defaults[attr.name] && attr.options.length > 0) {
            defaults[attr.name] = attr.options[0];
          }
        });
        setSelectedAttributes(defaults);
      } else {
        // Simple product
        setCurrentPrice(product.price);
        setCurrentStock(product.stockQuantity || 0);
        setCurrentSku(product.sku);
      }
    }
  }, [product]);
  
  // Update variation image when variation changes
  useEffect(() => {
    if (selectedVariation?.image) {
      const imageIndex = product?.gallery?.indexOf(selectedVariation.image);
      if (imageIndex !== undefined && imageIndex >= 0) {
        setSelectedImage(imageIndex);
      }
    }
  }, [selectedVariation, product]);
  
  // Update variation when attributes change
  useEffect(() => {
    if (product && product.type === "variable" && product.variations) {
      const variation = product.variations.find(v => {
        return Object.entries(selectedAttributes).every(([key, value]) => {
          return v.attributes[key] === value;
        });
      });
      
      if (variation) {
        setSelectedVariation(variation);
        setCurrentPrice(variation.salePrice || variation.price);
        setCurrentStock(variation.stockQuantity);
        setCurrentSku(variation.sku);
      } else {
        setSelectedVariation(null);
        setCurrentPrice(product.price);
        setCurrentStock(0);
        setCurrentSku(product.sku);
      }
    }
  }, [selectedAttributes, product]);

  const handleAddToCart = () => {
    if (product && (product.type === "simple" || product.type === undefined ? product.inStock : selectedVariation?.inStock)) {
      // Check if quantity exceeds stock
      if (quantity > currentStock) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${currentStock} units available in stock.`,
          variant: "destructive",
        });
        return;
      }
      
      const variationName = product.type === "variable" && selectedVariation
        ? `${product.name} - ${Object.values(selectedAttributes).join(", ")}`
        : product.name;
      
      addToCart({
        id: selectedVariation ? selectedVariation.id : product.id,
        name: variationName,
        price: currentPrice,
        quantity,
        image: selectedVariation?.image || product.image,
        category: product.category,
      });
      
      toast({
        title: "Added to Cart",
        description: `${quantity}x ${variationName} added to your cart.`,
      });
    }
  };
  
  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeName]: value
    }));
  };
  
  const isInStock = product?.type === "variable" 
    ? selectedVariation?.inStock && currentStock > 0
    : product?.inStock;
    
  const handleShare = async () => {
    const shareData = {
      title: product?.name,
      text: product?.shortDescription,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({ title: "Shared successfully!" });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
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
      {/* JSON-LD Schema for SEO */}
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.name,
              image: product.image,
              description: product.description,
              sku: currentSku,
              brand: {
                "@type": "Brand",
                name: product.brand,
              },
              offers: {
                "@type": "Offer",
                url: window.location.href,
                priceCurrency: "USD",
                price: currentPrice,
                availability: isInStock
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                reviewCount: product.reviews,
              },
            }),
          }}
        />
      )}
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs 
          items={[
            { label: "Shop", href: "/shop" },
            { label: product.category, href: "/shop" },
            { label: product.name }
          ]} 
        />

        {/* Product Detail */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 mb-8 lg:mb-12">
          {/* Product Gallery - WooCommerce pattern */}
          <div className="space-y-2 lg:space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-muted rounded-lg overflow-hidden relative group">
              <img
                src={product.gallery?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Zoom indicator - WordPress/WooCommerce feature placeholder */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  Click to zoom
                </span>
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="grid grid-cols-4 lg:grid-cols-4 gap-2 lg:gap-2">
                {product.gallery.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-muted rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 lg:space-y-6">
            <div>
              <Badge className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
              
              {/* Rating and Reviews */}
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
                  {product.rating} ({product.reviews} customer reviews)
                </span>
              </div>
            </div>

            <Separator />

            {/* Price and Stock */}
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="text-4xl font-bold text-primary">
                  ${currentPrice.toFixed(2)}
                </p>
                {selectedVariation?.regularPrice && selectedVariation.salePrice && (
                  <p className="text-2xl text-muted-foreground line-through">
                    ${selectedVariation.regularPrice.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isInStock ? (
                  <>
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      In Stock
                    </Badge>
                    {currentStock > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {currentStock} units available
                      </span>
                    )}
                  </>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            {/* Short Description - WooCommerce pattern */}
            {product.shortDescription && (
              <div className="text-muted-foreground leading-relaxed">
                {product.shortDescription}
              </div>
            )}

            <Separator />

            {/* Product Meta - WooCommerce pattern */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">SKU:</span>
                <span className="text-muted-foreground">{currentSku}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Category:</span>
                <Link to="/shop" className="text-primary hover:underline">
                  {product.category}
                </Link>
              </div>
              {product.tags && product.tags.length > 0 && (
                <div className="flex items-start gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="font-medium">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((tag, index) => (
                      <span key={index}>
                        <Link to="/shop" className="text-primary hover:underline">
                          {tag}
                        </Link>
                        {index < product.tags!.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share this product</span>
                </button>
              </div>
            </div>

            <Separator />

            {/* WooCommerce Product Attributes / Variations */}
            {product.type === "variable" && product.attributes && (
              <div className="space-y-4">
                {product.attributes
                  .filter(attr => attr.variation && attr.visible)
                  .map(attribute => (
                    <div key={attribute.id} className="space-y-2">
                      <label className="text-sm font-medium">
                        {attribute.name}
                      </label>
                      <Select
                        value={selectedAttributes[attribute.name] || ""}
                        onValueChange={(value) => handleAttributeChange(attribute.name, value)}
                      >
                        <SelectTrigger className="w-full h-12">
                          <SelectValue placeholder={`Choose ${attribute.name.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border z-[100]">
                          {attribute.options.map(option => (
                            <SelectItem key={option} value={option} className="bg-popover">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                
                {/* Variation Details */}
                {selectedVariation && (
                  <div className="p-3 bg-muted/50 rounded-md text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Selected:</span>
                      <span className="font-medium">{Object.values(selectedAttributes).join(" / ")}</span>
                    </div>
                    {selectedVariation.regularPrice && selectedVariation.salePrice && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">You save:</span>
                        <span className="font-medium text-accent">
                          ${(selectedVariation.regularPrice - selectedVariation.salePrice).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="font-semibold">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!isInStock}
                  className="h-12 w-12"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={!isInStock || quantity >= currentStock}
                  className="h-12 w-12"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {currentStock > 0 && quantity >= currentStock && (
                <p className="text-sm text-amber-600">Maximum stock reached</p>
              )}
            </div>

            {/* Action Buttons - Sticky on mobile */}
            <div className="space-y-3 lg:space-y-3">
              <Button 
                className="w-full min-h-[48px]" 
                size="lg" 
                disabled={!isInStock}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Link to="/checkout">
                <Button 
                  variant="secondary" 
                  className="w-full min-h-[48px]" 
                  size="lg" 
                  disabled={!isInStock}
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
        <Tabs defaultValue="description" className="mb-8 lg:mb-12">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="description" className="text-xs sm:text-sm py-3">Description</TabsTrigger>
            <TabsTrigger value="additional" className="text-xs sm:text-sm py-3">Additional Info</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs sm:text-sm py-3">Reviews ({product.reviews})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-4 lg:mt-6">
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
          
          <TabsContent value="additional" className="mt-4 lg:mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 py-3 border-b">
                    <span className="font-medium">SKU</span>
                    <span className="text-muted-foreground">{product.sku}</span>
                  </div>
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
                  {product.weight && (
                    <div className="grid grid-cols-2 gap-4 py-3 border-b">
                      <span className="font-medium">Weight</span>
                      <span className="text-muted-foreground">{product.weight}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="grid grid-cols-2 gap-4 py-3 border-b">
                      <span className="font-medium">Dimensions</span>
                      <span className="text-muted-foreground">{product.dimensions}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 py-3 border-b">
                    <span className="font-medium">Category</span>
                    <span className="text-muted-foreground">{product.category}</span>
                  </div>
                  {product.tags && product.tags.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 py-3">
                      <span className="font-medium">Tags</span>
                      <span className="text-muted-foreground">{product.tags.join(", ")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-4 lg:mt-6">
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
