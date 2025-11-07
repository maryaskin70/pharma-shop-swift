import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, User, LogOut } from "lucide-react";

// WordPress/WooCommerce My Account page pattern
// User data and orders will be fetched from WordPress/WooCommerce REST API
const Account = () => {
  // TODO: Replace with actual user data from WordPress
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
  });

  // TODO: Fetch from WooCommerce REST API /wp-json/wc/v3/orders
  const orders = [
    {
      id: "1234",
      date: "2024-01-15",
      status: "completed",
      total: 125.99,
      items: 3,
    },
    {
      id: "1235",
      date: "2024-01-20",
      status: "processing",
      total: 89.50,
      items: 2,
    },
    {
      id: "1236",
      date: "2024-01-25",
      status: "on-hold",
      total: 245.00,
      items: 5,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-accent text-accent-foreground";
      case "processing":
        return "bg-primary text-primary-foreground";
      case "on-hold":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: "My Account" }]} />
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Account</h1>
          <Button variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">
              <Package className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="mr-2 h-4 w-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="details">
              <User className="mr-2 h-4 w-4" />
              Account Details
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Order #{order.id}</span>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.date).toLocaleDateString()} • {order.items} items
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-primary">${order.total.toFixed(2)}</span>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-semibold">{userData.firstName} {userData.lastName}</p>
                  <p className="text-sm text-muted-foreground">123 Pharmacy Street</p>
                  <p className="text-sm text-muted-foreground">Medical District</p>
                  <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                  <Button variant="outline" className="mt-4">Edit Address</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-semibold">{userData.firstName} {userData.lastName}</p>
                  <p className="text-sm text-muted-foreground">123 Pharmacy Street</p>
                  <p className="text-sm text-muted-foreground">Medical District</p>
                  <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                  <Button variant="outline" className="mt-4">Edit Address</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Account Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={userData.firstName}
                        onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={userData.lastName}
                        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    />
                  </div>

                  <Separator className="my-6" />

                  <h3 className="text-lg font-semibold">Password Change</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>

                  <Button type="submit" className="mt-6">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;
