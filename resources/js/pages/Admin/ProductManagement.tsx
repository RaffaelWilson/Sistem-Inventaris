import React, { useState, useMemo } from "react"
import { Head, useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Management Produk",
        href: "/admin/product-management",
    },
]

interface Category {
    id: number
    name: string
}

interface Product {
    id: number
    name: string
    stock: number
    price: string
    minimum_stock_level: number
    category: Category
}

interface Props {
    products: Product[]
    categories: Category[]
}

const ITEMS_PER_PAGE = 5

export default function ProductManagement({ products, categories }: Props) {
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [searchProduct, setSearchProduct] = useState("")
    const [searchCategory, setSearchCategory] = useState("")
    const [currentProductPage, setCurrentProductPage] = useState(1)
    const [currentCategoryPage, setCurrentCategoryPage] = useState(1)

    const productForm = useForm({
        name: "",
        stock: 0,
        price: "",
        category_id: categories[0]?.id || "",
        minimum_stock_level: 0,
    })

    const categoryForm = useForm({
        name: "",
    })

    const handleEditClick = (product: Product) => {
        setEditingProduct(product)
        productForm.setData({
            name: product.name,
            stock: product.stock,
            price: product.price,
            category_id: product.category?.id || "",
            minimum_stock_level: product.minimum_stock_level,
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingProduct) {
            productForm.put(`/admin/product/${editingProduct.id}`, {
                onSuccess: () => {
                    productForm.reset()
                    setEditingProduct(null)
                    setShowForm(false)
                },
            })
        } else {
            productForm.post("/admin/product", {
                onSuccess: () => {
                    productForm.reset()
                    setShowForm(false)
                },
            })
        }
    }

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (editingCategory) {
            categoryForm.put(`/admin/category/${editingCategory.id}`, {
                onSuccess: () => {
                    categoryForm.reset()
                    setEditingCategory(null)
                },
            })
        } else {
            categoryForm.post("/admin/category", {
                onSuccess: () => categoryForm.reset(),
            })
        }
    }


    const filteredProducts = useMemo(() => {
        return products.filter((p) =>
            p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
            p.category?.name?.toLowerCase().includes(searchProduct.toLowerCase())
        )
    }, [searchProduct, products])

    const filteredCategories = useMemo(() => {
        return categories.filter((c) => c.name.toLowerCase().includes(searchCategory.toLowerCase()))
    }, [searchCategory, categories])

    const paginatedProducts = useMemo(() => {
        const start = (currentProductPage - 1) * ITEMS_PER_PAGE
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredProducts, currentProductPage])

    const paginatedCategories = useMemo(() => {
        const start = (currentCategoryPage - 1) * ITEMS_PER_PAGE
        return filteredCategories.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredCategories, currentCategoryPage])

    const totalProductPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
    const totalCategoryPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Produk" />
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <Input
                        placeholder="Cari produk..."
                        className="w-1/2"
                        value={searchProduct}
                        onChange={(e) => {
                            setSearchProduct(e.target.value)
                            setCurrentProductPage(1)
                        }}
                    />
                    <Dialog open={showForm} onOpenChange={(open) => {
                        setShowForm(open)
                        if (!open) {
                            setEditingProduct(null)
                            productForm.reset()
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button>{editingProduct ? "Edit Produk" : "Tambah Produk"}</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Produk</Label>
                                    <Input id="name" value={productForm.data.name} onChange={(e) => productForm.setData("name", e.target.value)} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="price">Harga</Label>
                                    <Input id="price" type="number" value={productForm.data.price} onChange={(e) => productForm.setData("price", e.target.value)} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="stock">Stok</Label>
                                    <Input id="stock" type="number" value={productForm.data.stock} onChange={(e) => productForm.setData("stock", Number(e.target.value))} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="minimum_stock_level">Minimum Stok</Label>
                                    <Input id="minimum_stock_level" type="number" value={productForm.data.minimum_stock_level} onChange={(e) => productForm.setData("minimum_stock_level", Number(e.target.value))} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <Select value={String(productForm.data.category_id)} onValueChange={(value) => productForm.setData("category_id", Number(value))}>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={String(cat.id)}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button type="submit" className="w-full">
                                    {editingProduct ? "Update Produk" : "Simpan Produk"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Daftar Produk</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Stok</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.category?.name || "-"}</TableCell>
                                        <TableCell>Rp{Number(product.price).toLocaleString()}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            {product.stock < product.minimum_stock_level ? (
                                                <Badge variant="destructive">Stok Rendah</Badge>
                                            ) : (
                                                <Badge variant="outline">Aman</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => {
                                                    handleEditClick(product)
                                                    setShowForm(true)
                                                }}>Edit</Button>
                                                <Button variant="destructive" size="sm" onClick={() => productForm.delete(`/admin/product/${product.id}`)}>
                                                    Hapus
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-end items-center mt-4 gap-2">
                            <Button disabled={currentProductPage === 1} onClick={() => setCurrentProductPage((p) => p - 1)}>Sebelumnya</Button>
                            <span>Halaman {currentProductPage} dari {totalProductPages}</span>
                            <Button disabled={currentProductPage === totalProductPages} onClick={() => setCurrentProductPage((p) => p + 1)}>Berikutnya</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Daftar Kategori</CardTitle>
                        <br />
                        <Label>Tambah Kategori : </Label>
                        <form onSubmit={handleCategorySubmit} className="flex items-center gap-2 mt-4">
                            <Input
                                placeholder="Nama kategori"
                                value={categoryForm.data.name}
                                onChange={(e) => categoryForm.setData("name", e.target.value)}
                            />
                            <Button type="submit">
                                {editingCategory ? "Update" : "Tambah"}
                            </Button>
                            {editingCategory && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        categoryForm.reset()
                                        setEditingCategory(null)
                                    }}
                                >
                                    Batal
                                </Button>
                            )}
                        </form>
                        <br />
                        <Label>Cari Kategori : </Label>
                        <Input
                            placeholder="Cari kategori..."
                            className="mt-4"
                            value={searchCategory}
                            onChange={(e) => {
                                setSearchCategory(e.target.value)
                                setCurrentCategoryPage(1)
                            }}
                        />
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedCategories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingCategory(category)
                                                        categoryForm.setData("name", category.name)
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => categoryForm.delete(`/admin/category/${category.id}`)}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="flex justify-end items-center mt-4 gap-2">
                            <Button disabled={currentCategoryPage === 1} onClick={() => setCurrentCategoryPage((p) => p - 1)}>Sebelumnya</Button>
                            <span>Halaman {currentCategoryPage} dari {totalCategoryPages}</span>
                            <Button disabled={currentCategoryPage === totalCategoryPages} onClick={() => setCurrentCategoryPage((p) => p + 1)}>Berikutnya</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
