import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type FormEvent, useState } from "react";
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Produk',
        href: '/user/products'
    },
];

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    stock: number;
    price: number;
    category: Category;
    minimum_stock_level: number;
}

interface Props {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories: Category[];
    filters: {
        search?: string;
        category_id?: string;
    };
}

export default function ProductList({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [category, setCategory] = useState(filters.category_id || "all");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (category !== "all") query.append("category_id", category);
        window.location.href = `/user/products?${query.toString()}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Produk</CardTitle>
                        <CardDescription>Produk yang tersedia untuk dilihat oleh user</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap mb-4">
                            <Input
                                placeholder="Cari nama produk..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="max-w-sm"
                            />
                            <Select value={category} onValueChange={(val) => setCategory(val)}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type="submit">Filter</Button>
                        </form>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Stok</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Harga</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.data.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>
                                            {product.stock}
                                            {product.stock < product.minimum_stock_level && (
                                                <Badge variant="destructive" className="ml-2">
                                                    Stok Rendah
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{product.category?.name ?? "-"}</TableCell>
                                        <TableCell>Rp{product.price.toLocaleString("id-ID")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <div className="flex justify-end mt-4 gap-2 flex-wrap">
                            {products.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? "default" : "outline"}
                                    disabled={!link.url}
                                    onClick={() => link.url && (window.location.href = link.url)}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
