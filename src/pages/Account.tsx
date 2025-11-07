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
// Customer data: GET /wp-json/wc/v3/customers/{id}
// Orders: GET /wp-json/wc/v3/orders?customer={id}
// Update customer: PUT /wp-json/wc/v3/customers/{id}
// Addresses: Billing and shipping stored in customer meta
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

        <Tabs defaultValue="orders" className="space-y-4 lg:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="orders" className="py-3 text-xs sm:text-sm">
              <Package className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="py-3 text-xs sm:text-sm">
              <MapPin className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="py-3 text-xs sm:text-sm">
              <User className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Account Details</span>
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab - WooCommerce pattern */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left text-sm">
                        <th className="pb-3 font-semibold">Order</th>
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Total</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orders.map((order) => (
                        <tr key={order.id} className="text-sm">
                          <td className="py-4">
                            <span className="font-medium">#{order.id}</span>
                          </td>
                          <td className="py-4 text-muted-foreground">
                            {new Date(order.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </td>
                          <td className="py-4">
                            <Badge className={getStatusColor(order.status)} variant="secondary">
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <span className="font-semibold">${order.total.toFixed(2)}</span>
                            <span className="text-muted-foreground"> for {order.items} item{order.items > 1 ? 's' : ''}</span>
                          </td>
                          <td className="py-4 text-right">
                            <Button variant="outline" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab - WooCommerce pattern */}
          <TabsContent value="addresses">
            <p className="text-sm text-muted-foreground mb-6">
              The following addresses will be used on the checkout page by default.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">Billing Address</h3>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{userData.firstName} {userData.lastName}</p>
                    <p className="text-muted-foreground">123 Pharmacy Street</p>
                    <p className="text-muted-foreground">Medical District</p>
                    <p className="text-muted-foreground">New York, NY 10001</p>
                    <p className="text-muted-foreground">United States</p>
                    <p className="text-muted-foreground mt-2">{userData.phone}</p>
                    <p className="text-muted-foreground">{userData.email}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{userData.firstName} {userData.lastName}</p>
                    <p className="text-muted-foreground">123 Pharmacy Street</p>
                    <p className="text-muted-foreground">Medical District</p>
                    <p className="text-muted-foreground">New York, NY 10001</p>
                    <p className="text-muted-foreground">United States</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Account Details Tab - WooCommerce pattern */}
          <TabsContent value="details">
            <Card>
              <CardContent className="p-6">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={userData.firstName}
                        onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={userData.lastName}
                        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">
                      Display Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="displayName"
                      value={`${userData.firstName} ${userData.lastName}`}
                      placeholder="This will be how your name will be displayed"
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be how your name will be displayed in the account section and in reviews
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      required
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Password Change</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        Current Password (leave blank to leave unchanged)
                      </Label>
                      <Input id="currentPassword" type="password" autoComplete="current-password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">
                        New Password (leave blank to leave unchanged)
                      </Label>
                      <Input id="newPassword" type="password" autoComplete="new-password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" autoComplete="new-password" />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="min-h-[48px]">
                    Save Changes
                  </Button>
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
