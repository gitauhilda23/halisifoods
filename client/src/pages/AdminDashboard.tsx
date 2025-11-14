// client/src/pages/AdminDashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, ShoppingBag, BookOpen, Mail, Plus, Trash2, Upload, Image as ImageIcon, FileText } from "lucide-react";
import { useState, useEffect } from "react";

interface Ebook {
  id: string;
  title: string;
  price: number; // KES as number (e.g. 30)
  coverUrl: string;
  pdfUrl: string;
  category: string; // NEW
  sales: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [ebooks, setEbooks] = useState<Ebook[]>(() => {
    const saved = localStorage.getItem("halisi-ebooks");
    if (!saved) return [];
    return JSON.parse(saved).map((book: any) => ({
      ...book,
      price: typeof book.price === "string"
        ? parseInt(book.price.replace(/[^0-9]/g, ""), 10) || 0
        : book.price,
      category: book.category || "Uncategorized",
    }));
  });

  useEffect(() => {
    localStorage.setItem("halisi-ebooks", JSON.stringify(ebooks));
  }, [ebooks]);

  // Form state
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Traditional Dishes");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleAddEbook = async () => {
    if (!title || !price || !coverFile || !pdfFile) return;
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
    };

    setEbooks([...ebooks, newBook]);
    resetForm();
    setOpen(false);
    setIsUploading(false);
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setCategory("Traditional Dishes");
    setCoverFile(null);
    setPdfFile(null);
    setCoverPreview("");
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
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Upload New eBook</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          placeholder="Kenyan Desserts Masterclass"
                        />
                      </div>
                      <div>
                        <Label>Price (KES)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="30"
                          className="font-mono text-lg"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Enter amount in KES (e.g. 30 = KSh 30)
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label>Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Traditional Dishes">Traditional Dishes</SelectItem>
                          <SelectItem value="Modern Fusion">Modern Fusion</SelectItem>
                          <SelectItem value="Quick and Easy">Quick and Easy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Cover Image (JPG/PNG)</Label>
                      <div className="mt-2">
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
                          <img
                            src={coverPreview}
                            alt="Preview"
                            className="mt-3 w-full h-64 object-cover rounded-lg border"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>eBook PDF</Label>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => e.target.files?.[0] && setPdfFile(e.target.files[0])}
                      />
                      {pdfFile && (
                        <p className="mt-2 text-sm text-green-600">
                          PDF ready: {pdfFile.name}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => { setOpen(false); resetForm(); }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddEbook}
                        disabled={isUploading || !title || !price || !coverFile || !pdfFile}
                      >
                        {isUploading ? "Uploading..." : "Publish eBook"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ebooks.map((book) => (
                <Card key={book.id} className="overflow-hidden">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.category}</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      KSh {book.price.toLocaleString()}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-muted-foreground">
                        {book.sales} sales
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(book.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {ebooks.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No eBooks yet. Click "Add New eBook" to publish your first one!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="overview">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-3xl font-bold">{ebooks.length}</p>
                <p>eBooks Published</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Orders coming soon
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                2,456 subscribers
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}