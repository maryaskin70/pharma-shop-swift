import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// This component follows WordPress/WooCommerce product card pattern
// Product data will be fetched from WordPress REST API or WooCommerce API
interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export const ProductCard = ({
  id,
  name,
  price,
  image,
  category,
  rating,
  reviews,
  inStock,
}: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inStock) {
      addToCart({
        id,
        name,
        price,
        quantity: 1,
        image,
        category,
      });
    }
  };

  return (
    <Link to={`/product/${id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-3">
          <div className="aspect-square mb-3 bg-muted rounded-md overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            <h3 className="font-semibold text-sm line-clamp-2">{name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="text-xs">{rating}</span>
              <span className="text-xs text-muted-foreground">({reviews})</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-primary">${price.toFixed(2)}</p>
              {!inStock && (
                <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
              )}
            </div>
            {inStock && (
              <Button className="w-full" size="sm" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
