// client/src/pages/AdminDashboard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Gift, Flame, Lock, Percent, Tag } from "lucide-react";
import { useState, useEffect } from "react";

interface Ebook {
  id: string;
  title: string;
  price: number;
  coverUrl: string;
  pdfUrl: string;
  category: string;
  sales: number;
  isFreeEbook?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
}

interface Discount {
  id: string;
  code: string;
  name: string;
  type: "percentage" | "fixed" | "bxgy";
  value: number;
  minBooks?: number;
  getFree?: number;
  appliesTo: "all" | string[];
  requireLogin: boolean;
  isActive: boolean;
  usedCount: number;
}

const ADMIN_PASSWORD = "halisi2025";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  // Ebook form states
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Kenyan Recipes");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isFreeEbook, setIsFreeEbook] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Discount form states
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountName, setDiscountName] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed" | "bxgy">("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [minBooks, setMinBooks] = useState(3);
  const [getFree, setGetFree] = useState(1);
  const [appliesToSelectValue, setAppliesToSelectValue] = useState<"all" | "specific">("all");
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [requireLogin, setRequireLogin] = useState(false);

  // Load data
  useEffect(() => {
    const savedEbooks = localStorage.getItem("halisi-ebooks");
    if (savedEbooks) setEbooks(JSON.parse(savedEbooks));
    const savedDiscounts = localStorage.getItem("halisi-discounts");
    if (savedDiscounts) setDiscounts(JSON.parse(savedDiscounts));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("halisi-ebooks", JSON.stringify(ebooks));
    localStorage.setItem("halisi-discounts", JSON.stringify(discounts));
  }, [ebooks, discounts]);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Wrong password");
    }
  };

  const handleAddEbook = () => {
    if (!title || !coverFile || !pdfFile) return;
    setIsUploading(true);

    const newBook: Ebook = {
      id: Date.now().toString(),
      title,
      price: parseInt(price, 10) || 0,
      coverUrl: URL.createObjectURL(coverFile),
      pdfUrl: URL.createObjectURL(pdfFile),
      category,
      sales: 0,
      isFreeEbook,
      isBestSeller,
      isFlashSale,
    };

    setEbooks(prev => [...prev, newBook]);
    setOpen(false);
    setTitle(""); setPrice(""); setCategory("Kenyan Recipes");
    setCoverFile(null); setPdfFile(null);
    setIsFreeEbook(false); setIsBestSeller(false); setIsFlashSale(false);
    setIsUploading(false);
  };

  const handleDelete = (id: string) => {
    const book = ebooks.find(b => b.id === id);
    if (book) {
      URL.revokeObjectURL(book.coverUrl);
      URL.revokeObjectURL(book.pdfUrl);
    }
    setEbooks(prev => prev.filter(b => b.id !== id));
  };

  const handleSaveDiscount = () => {
    if (!discountCode.trim()) return;
    const finalAppliesTo: "all" | string[] = appliesToSelectValue === "all" ? "all" : selectedBookIds;

    const newDiscount: Discount = {
      id: editingDiscount?.id || Date.now().toString(),
      code: discountCode.toUpperCase(),
      name: discountName || discountCode,
      type: discountType,
      value: discountValue,
      minBooks: discountType === "bxgy" ? minBooks : undefined,
      getFree: discountType === "bxgy" ? getFree : undefined,
      appliesTo: finalAppliesTo,
      requireLogin,
      isActive: true,
      usedCount: editingDiscount?.usedCount || 0,
    };

    if (editingDiscount) {
      setDiscounts(prev => prev.map(d => d.id === editingDiscount.id ? newDiscount : d));
    } else {
      setDiscounts(prev => [...prev, newDiscount]);
    }

    setShowDiscountDialog(false);
    resetDiscountForm();
  };

  const resetDiscountForm = () => {
    setEditingDiscount(null);
    setDiscountCode(""); setDiscountName(""); setDiscountType("percentage");
    setDiscountValue(0); setMinBooks(3); setGetFree(1);
    setSelectedBookIds([]); setRequireLogin(false);
    setAppliesToSelectValue("all");
  };

  const openEditDiscount = (d: Discount) => {
    setEditingDiscount(d);
    setDiscountCode(d.code);
    setDiscountName(d.name);
    setDiscountType(d.type);
    setDiscountValue(d.value);
    setMinBooks(d.minBooks || 3);
    setGetFree(d.getFree || 1);
    setRequireLogin(d.requireLogin);
    setSelectedBookIds(d.appliesTo === "all" ? [] : d.appliesTo);
    setAppliesToSelectValue(d.appliesTo === "all" ? "all" : "specific");
    setShowDiscountDialog(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          <Lock className="w-20 h-20 mx-auto text-amber-600 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Halisi Admin</h1>
          <Input type="password" placeholder="Enter password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="mb-4 text-center text-lg" />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button onClick={handleLogin} className="w-full bg-amber-600 hover:bg-amber-700" size="lg">Enter Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>Logout</Button>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ebooks">eBooks</TabsTrigger>
            <TabsTrigger value="discounts">Discounts</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card><CardContent className="py-10 text-center"><p className="text-5xl font-bold">{ebooks.length}</p><p className="text-xl mt-2">eBooks</p></CardContent></Card>
              <Card><CardContent className="py-10 text-center"><p className="text-5xl font-bold">{discounts.length}</p><p className="text-xl mt-2">Active Discounts</p></CardContent></Card>
              <Card><CardContent className="py-10 text-center"><p className="text-5xl font-bold text-green-600">KSh 48,920</p><p className="text-xl mt-2">Total Sales</p></CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="ebooks" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg"><Plus className="h-5 w-5 mr-2" /> Add New eBook</Button>
                </DialogTrigger>

                {/* FULLY RESTORED & BEAUTIFUL UPLOAD DIALOG */}
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Upload New eBook</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Kenyan Desserts Masterclass" /></div>
                      <div><Label>Price (KES)</Label><Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="350" /></div>
                    </div>

                    <div>
                      <Label>Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kenyan Recipes">Kenyan Recipes</SelectItem>
                          <SelectItem value="Baby Meal Recipes">Baby Meal Recipes</SelectItem>
                          <SelectItem value="Quick and Easy">Quick and Easy</SelectItem>
                          <SelectItem value="Healthy Eating">Healthy Eating</SelectItem>
                          <SelectItem value="Festive Recipes">Festive Recipes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label>Cover Image</Label>
                        <Input type="file" accept="image/*" onChange={e => e.target.files?.[0] && setCoverFile(e.target.files[0])} />
                      </div>
                      <div>
                        <Label>PDF File</Label>
                        <Input type="file" accept=".pdf" onChange={e => e.target.files?.[0] && setPdfFile(e.target.files[0])} />
                      </div>
                    </div>

                    <div className="p-5 bg-amber-50 rounded-xl border border-amber-200 space-y-4">
                      <p className="font-semibold text-amber-900">Promotion Options (optional)</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox checked={isFreeEbook} onCheckedChange={c => setIsFreeEbook(c === true)} />
                          <span className="text-sm font-medium">Free eBook</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox checked={isBestSeller} onCheckedChange={c => setIsBestSeller(c === true)} />
                          <span className="text-sm font-medium">Best Seller</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox checked={isFlashSale} onCheckedChange={c => setIsFlashSale(c === true)} />
                          <span className="text-sm font-medium">Flash Sale</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                      <Button
                        onClick={handleAddEbook}
                        disabled={!title || !coverFile || !pdfFile || isUploading}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        {isUploading ? "Publishing..." : "Publish eBook"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* eBook Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {ebooks.map(book => (
                <Card key={book.id} className="overflow-hidden relative hover:shadow-xl transition-shadow">
                  {book.isFreeEbook && <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold z-10">FREE GIFT</div>}
                  {book.isBestSeller && <div className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold z-10 flex items-center gap-1"><Flame className="w-4 h-4" /> BEST SELLER</div>}
                  <div className="relative w-full aspect-[3/4] bg-gray-100">
                    <img src={book.coverUrl} alt={book.title} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{book.category}</p>
                    <p className="text-2xl font-bold text-amber-600 mt-3">{book.isFreeEbook ? "FREE" : `KSh ${book.price.toLocaleString()}`}</p>
                    <div className="flex justify-between items-center mt-5">
                      <span className="text-sm text-muted-foreground">{book.sales} sales</span>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(book.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Discounts Tab */}
          <TabsContent value="discounts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold flex items-center gap-3"><Tag className="w-8 h-8 text-amber-600" /> Discount Codes</h2>
              <Button onClick={() => { resetDiscountForm(); setShowDiscountDialog(true); }}>
                <Plus className="h-5 w-5 mr-2" /> Create Discount
              </Button>
            </div>

            <div className="space-y-4">
              {discounts.length === 0 ? (
                <Card><CardContent className="py-16 text-center text-muted-foreground">
                  <Gift className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No discount codes yet. Create your first one!</p>
                </CardContent></Card>
              ) : (
                discounts.map(d => (
                  <Card key={d.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="bg-amber-100 p-3 rounded-full"><Percent className="w-6 h-6 text-amber-600" /></div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold">{d.code}</h3>
                            <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">Active</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {d.type === "percentage" && `${d.value}% off`}
                            {d.type === "fixed" && `KSh ${d.value} off`}
                            {d.type === "bxgy" && `Buy ${d.minBooks}, Get ${d.getFree} ${d.value === 100 ? "FREE" : `${d.value}% off`}`}
                            {Array.isArray(d.appliesTo) && ` · ${d.appliesTo.length} book${d.appliesTo.length > 1 ? "s" : ""}`}
                            {d.requireLogin && " · Login required"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDiscount(d)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => setDiscounts(prev => prev.filter(x => x.id !== d.id))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          </Tabs>
      </div>

      {/* DISCOUNT DIALOG – PERFECTLY PLACED, NO ERRORS */}
      <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingDiscount ? "Edit" : "Create"} Discount Code
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Code</Label>
                <Input value={discountCode} onChange={e => setDiscountCode(e.target.value)} placeholder="HALISI2025" />
              </div>
              <div>
                <Label>Name (internal)</Label>
                <Input value={discountName} onChange={e => setDiscountName(e.target.value)} placeholder="Black Friday 2025" />
              </div>
            </div>

            <div>
              <Label>Type</Label>
              <Select value={discountType} onValueChange={v => setDiscountType(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Off</SelectItem>
                  <SelectItem value="fixed">Fixed Amount Off (KSh)</SelectItem>
                  <SelectItem value="bxgy">Buy X Get Y Free</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {discountType === "bxgy" ? (
              <div className="grid grid-cols-3 gap-4 p-5 bg-purple-50 rounded-xl border border-purple-200">
                <div><Label>Buy</Label><Input type="number" value={minBooks} onChange={e => setMinBooks(+e.target.value)} /></div>
                <div><Label>Get</Label><Input type="number" value={getFree} onChange={e => setGetFree(+e.target.value)} /></div>
                <div><Label>Discount on free items</Label><Input type="number" min="0" max="100" value={discountValue} onChange={e => setDiscountValue(+e.target.value)} placeholder="100 = free" /></div>
              </div>
            ) : (
              <div>
                <Label>{discountType === "percentage" ? "Percentage Off" : "Amount Off (KSh)"}</Label>
                <Input type="number" value={discountValue} onChange={e => setDiscountValue(+e.target.value)} />
              </div>
            )}

            <div>
              <Label>Applies to</Label>
              <Select value={appliesToSelectValue} onValueChange={v => {
                const val = v as "all" | "specific";
                setAppliesToSelectValue(val);
                if (val === "all") setSelectedBookIds([]);
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Books</SelectItem>
                  <SelectItem value="specific">Specific Books</SelectItem>
                </SelectContent>
              </Select>

              {appliesToSelectValue === "specific" && (
                <div className="mt-4 max-h-60 overflow-y-auto border rounded-lg p-4 space-y-2">
                  {ebooks.map(book => (
                    <label key={book.id} className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={selectedBookIds.includes(book.id)}
                        onCheckedChange={checked => {
                          if (checked) {
                            setSelectedBookIds(prev => [...prev, book.id]);
                          } else {
                            setSelectedBookIds(prev => prev.filter(id => id !== book.id));
                          }
                        }}
                      />
                      <span className="text-sm">{book.title}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Checkbox id="loginreq" checked={requireLogin} onCheckedChange={c => setRequireLogin(c === true)} />
              <label htmlFor="loginreq" className="cursor-pointer font-medium">Require login to use this code</label>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button variant="outline" onClick={() => { setShowDiscountDialog(false); resetDiscountForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleSaveDiscount} className="bg-amber-600 hover:bg-amber-700">
                {editingDiscount ? "Update" : "Create"} Discount
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
      