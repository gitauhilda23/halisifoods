import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, ShoppingBag, Users, DollarSign, Mail, BookOpen, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "Total Sales", value: "$12,345", icon: DollarSign, change: "+12.5%" },
    { label: "Total Orders", value: "543", icon: ShoppingBag, change: "+8.2%" },
    { label: "eBooks Sold", value: "1,234", icon: BookOpen, change: "+15.3%" },
    { label: "Newsletter Subscribers", value: "2,456", icon: Mail, change: "+23.1%" },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", ebook: "Kenyan Breakfast Delights", amount: "$12.99", status: "Completed" },
    { id: "ORD-002", customer: "Jane Smith", ebook: "Classic Main Dishes", amount: "$15.99", status: "Completed" },
    { id: "ORD-003", customer: "Mike Johnson", ebook: "Vegetarian Favorites", amount: "$11.99", status: "Processing" },
    { id: "ORD-004", customer: "Sarah Williams", ebook: "Snacks & Street Food", amount: "$9.99", status: "Completed" },
  ];

  const ebooks = [
    { id: "1", title: "Kenyan Breakfast Delights", price: "$12.99", sales: 234 },
    { id: "2", title: "Classic Main Dishes", price: "$15.99", sales: 345 },
    { id: "3", title: "Vegetarian Favorites", price: "$11.99", sales: 178 },
    { id: "4", title: "Snacks & Street Food", price: "$9.99", sales: 156 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-2xl font-bold" data-testid="text-admin-title">
              Admin Dashboard
            </h1>
            <Button variant="outline" data-testid="button-admin-logout">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="ebooks" data-testid="tab-ebooks">eBooks</TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
            <TabsTrigger value="newsletter" data-testid="tab-newsletter">Newsletter</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary">{stat.change}</span> from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-semibold" data-testid={`order-id-${order.id}`}>{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{order.amount}</p>
                        <p className="text-sm text-muted-foreground">{order.ebook}</p>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === "Completed" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ebooks" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search eBooks..."
                  className="pl-9"
                  data-testid="input-search-ebooks"
                />
              </div>
              <Button data-testid="button-add-ebook">
                <Plus className="h-4 w-4 mr-2" />
                Add New eBook
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">Title</th>
                      <th className="text-left p-4">Price</th>
                      <th className="text-left p-4">Sales</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ebooks.map((ebook) => (
                      <tr key={ebook.id} className="border-b last:border-0">
                        <td className="p-4" data-testid={`ebook-title-${ebook.id}`}>{ebook.title}</td>
                        <td className="p-4">{ebook.price}</td>
                        <td className="p-4">{ebook.sales}</td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" data-testid={`button-edit-ebook-${ebook.id}`}>
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-semibold" data-testid={`all-order-id-${order.id}`}>{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer} - {order.ebook}</p>
                      </div>
                      <div className="text-right mr-6">
                        <p className="font-semibold">{order.amount}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === "Completed" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {order.status}
                        </span>
                        <Button variant="ghost" size="sm" data-testid={`button-view-order-${order.id}`}>
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscribers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input placeholder="Search subscribers..." data-testid="input-search-subscribers" />
                    <Button data-testid="button-export-subscribers">Export CSV</Button>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-center text-muted-foreground">
                      Total Subscribers: <span className="font-bold text-foreground">2,456</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
