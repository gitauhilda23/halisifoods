// client/src/pages/AdminDashboard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Gift, Flame, FileText } from "lucide-react";
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
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [ebooks, setEbooks] = useState<Ebook[]>(() => {
    const saved = localStorage.getItem("halisi-ebooks");
    if (!saved) return [];
    return JSON.parse(saved).map((book: any) => ({
      ...book,
      price: typeof book.price === "string" ? parseInt(book.price.replace(/[^0-9]/g, ""), 10) || 0 : book.price,
      category: book.category || "Uncategorized",
      isFreeEbook: book.isFreeEbook ?? false,
      isBestSeller: book.isBestSeller ?? false,
    }));
  });

  useEffect(() => {
    localStorage.setItem("halisi-ebooks", JSON.stringify(ebooks));
  }, [ebooks]);

  // Form state
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Kenyan Recipes");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [isFreeEbook, setIsFreeEbook] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddEbook = () => {
    if (!title || !coverFile || !pdfFile) return;
    setIsUploading(true);

    const coverUrl = URL.createObjectURL(coverFile);
    const pdfUrl = URL.createObjectURL(pdfFile);

    const newBook: Ebook = {
      id: Date.now().toString(),
      title,
      price: parseInt(price, 10) || 0,
      coverUrl,
      pdfUrl,
      category,
      sales: 0,
      isFreeEbook,
      isBestSeller,
    };

    setEbooks([...ebooks, newBook]);
    resetForm();
    setOpen(false);
    setIsUploading(false);
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setCategory("Kenyan Recipes");
    setCoverFile(null);
    setPdfFile(null);
    setCoverPreview("");
    setIsFreeEbook(false);
    setIsBestSeller(false);
  };

  const handleDelete = (id: string) => {
    setEbooks(ebooks.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline">Logout</Button>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ebooks">eBooks</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          </TabsList>

          <TabsContent value="ebooks" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <Plus className="h-5 w-5 mr-2" /> Add New eBook
                  </Button>
                </DialogTrigger>

                {/* FIXED: Scrollable dialog */}
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Upload New eBook</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Kenyan Desserts Masterclass" />
                      </div>
                      <div>
                        <Label>Price (KES)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={price}
                          onChange={e => setPrice(e.target.value)}
                          placeholder="30"
                          className="font-mono text-lg"
                        />
                        <p className="text-sm text-muted-foreground mt-1">Enter amount in KES (0 = free)</p>
                      </div>
                    </div>

                    <div>
                      <Label>Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kenyan Recipes">Kenyan Recipes</SelectItem>
                          <SelectItem value="Baby Meal Recipes">Baby Meal Recipes</SelectItem>
                          <SelectItem value="Quick and Easy">Quick and Easy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4 p-5 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="font-bold text-amber-900 flex items-center gap-2">
                        <Flame className="w-6 h-6" /> Promotion Options
                      </p>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="free"
                          checked={isFreeEbook}
                          onCheckedChange={(checked) => {
                            setIsFreeEbook(checked === true);
                            if (checked) setPrice("0");
                          }}
                        />
                        <label htmlFor="free" className="flex items-center gap-2 cursor-pointer text-sm">
                          <Gift className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Offer as Free Download</span>
                          <span className="text-muted-foreground">(Appears in homepage hero)</span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="bestseller"
                          checked={isBestSeller}
                          onCheckedChange={(checked) => setIsBestSeller(checked === true)}
                        />
                        <label htmlFor="bestseller" className="flex items-center gap-2 cursor-pointer text-sm">
                          <Flame className="w-5 h-5 text-orange-600" />
                          <span className="font-medium">Mark as Best Seller</span>
                          <span className="text-muted-foreground">(Shows in Best Sellers section)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <Label>Cover Image</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCoverFile(file);
                            setCoverPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      {coverPreview && (
                        <img src={coverPreview} alt="Cover preview" className="mt-4 w-full h-80 object-cover rounded-lg border shadow-md" />
                      )}
                    </div>

                    <div>
                      <Label>eBook PDF</Label>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => e.target.files?.[0] && setPdfFile(e.target.files[0])}
                      />
                      {pdfFile && (
                        <p className="mt-2 text-sm text-green-600 font-medium">
                          PDF ready: {pdfFile.name}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t">
                      <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddEbook}
                        disabled={isUploading || !title || !coverFile || !pdfFile}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        {isUploading ? "Publishing..." : "Publish eBook"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* eBooks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ebooks.map((book) => (
                <Card key={book.id} className="overflow-hidden relative">
                  {book.isFreeEbook && (
                    <div className="absolute top-3 left-3 bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold z-10 shadow-lg">
                      FREE GIFT
                    </div>
                  )}
                  {book.isBestSeller && (
                    <div className="absolute top-3 right-3 bg-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold z-10 flex items-center gap-1 shadow-lg">
                      <Flame className="w-4 h-4" /> BEST SELLER
                    </div>
                  )}
                  <img src={book.coverUrl} alt={book.title} className="w-full h-64 object-cover" />
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg truncate">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.category}</p>
                    <p className="text-2xl font-bold text-amber-600 mt-2">
                      {book.isFreeEbook ? "FREE" : `KSh ${book.price.toLocaleString()}`}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-muted-foreground">{book.sales} sales</span>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(book.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {ebooks.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No eBooks yet. Click "Add New eBook" to publish your first one!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="overview">
            <Card><CardContent className="py-16 text-center"><p className="text-5xl font-bold">{ebooks.length}</p><p className="text-xl mt-2">eBooks Published</p></CardContent></Card>
          </TabsContent>
          <TabsContent value="orders"><Card><CardContent className="py-16 text-center text-muted-foreground">Orders coming soon</CardContent></Card></TabsContent>
          <TabsContent value="newsletter"><Card><CardContent className="py-16 text-center text-muted-foreground">2,456 subscribers</CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}