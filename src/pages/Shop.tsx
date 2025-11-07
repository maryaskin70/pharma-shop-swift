import { useState } from "react";
import { Link } from "react-router-dom";
import { products, categories, brands } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Star, ShieldCheck, CreditCard, Truck, RefreshCcw, Search } from "lucide-react";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === "All Products" || product.category === selectedCategory;
    const brandMatch = selectedBrand === "All Brands" || product.brand === selectedBrand;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    const searchMatch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && brandMatch && priceMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Why Choose Us - Desktop Only */}
      <section className="hidden lg:block bg-card border-b py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-5 gap-6">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="h-10 w-10 text-primary mb-3" />
              <h3 className="font-semibold text-sm mb-1">Pharmacy Grade</h3>
              <p className="text-xs text-muted-foreground">Sourced from original manufacturers</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Star className="h-10 w-10 text-primary mb-3" />
              <h3 className="font-semibold text-sm mb-1">Customer Service</h3>
              <p className="text-xs text-muted-foreground">24/7 professional support</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <CreditCard className="h-10 w-10 text-primary mb-3" />
              <h3 className="font-semibold text-sm mb-1">Crypto Payment</h3>
              <p className="text-xs text-muted-foreground">Secure cryptocurrency accepted</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Truck className="h-10 w-10 text-primary mb-3" />
              <h3 className="font-semibold text-sm mb-1">Discreet Delivery</h3>
              <p className="text-xs text-muted-foreground">Private packaging guaranteed</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <RefreshCcw className="h-10 w-10 text-primary mb-3" />
              <h3 className="font-semibold text-sm mb-1">Refund Policy</h3>
              <p className="text-xs text-muted-foreground">30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-6 space-y-6">
              {/* Categories */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <Checkbox
                          id={category}
                          checked={selectedCategory === category}
                          onCheckedChange={() => setSelectedCategory(category)}
                        />
                        <Label htmlFor={category} className="ml-2 text-sm cursor-pointer">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Brands */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Brands</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <Checkbox
                          id={brand}
                          checked={selectedBrand === brand}
                          onCheckedChange={() => setSelectedBrand(brand)}
                        />
                        <Label htmlFor={brand} className="ml-2 text-sm cursor-pointer">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Price Range */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-4 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Shop Products</h1>
                <p className="text-sm text-muted-foreground">{filteredProducts.length} products found</p>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products by name, category, or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-3">
                      <div className="aspect-square mb-3 bg-muted rounded-md overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span className="text-xs">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">({product.reviews})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                          {!product.inStock && (
                            <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                          )}
                        </div>
                        {product.inStock && (
                          <Button className="w-full" size="sm">
                            Add to Cart
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
