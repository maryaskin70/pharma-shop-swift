import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold text-foreground">PharmaCare Online</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Your trusted source for pharmacy-grade medications and supplements
        </p>
        <Link to="/shop">
          <Button size="lg" className="text-lg px-8">
            Browse Products
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
