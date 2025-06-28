import { useState, useMemo } from "react"
import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import axios from "axios"
import { type BreadcrumbItem } from "@/types"


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Management Stock",
        href: "/admin/stock-management",
    },
]

interface Product {
    id: number
    name: string
    stock: number
    minimum_stock_level: number
}

interface Props {
    products: Product[]
}

export default function StockManagement({ products }: Props) {
    const [search, setSearch] = useState("")
    const [filterLowStock, setFilterLowStock] = useState(false)
    const [editStock, setEditStock] = useState<{ [id: number]: number }>({})

    const filtered = useMemo(() => {
        return products
            .filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase())
            )
            .filter(p =>
                filterLowStock ? p.stock < p.minimum_stock_level : true
            )
    }, [search, filterLowStock, products])

    const handleStockChange = (id: number, value: number) => {
        setEditStock((prev) => ({ ...prev, [id]: value }))
    }

    const handleStockUpdate = async (id: number) => {
        const value = editStock[id]

        if (typeof value !== "number" || isNaN(value)) {
            alert("Stok tidak valid")
            return
        }

        try {
            const res = await axios.put(`http://localhost:8000/admin/stock/${id}`, { stock: value })
            alert(res.data.message)
            setEditStock((prev) => ({ ...prev, [id]: undefined }))
            window.location.reload()
        } catch (error) {
            alert("Gagal update stok")
            console.error(error)
        }
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Stok" />
            <div className="p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Manajemen Stok</CardTitle>
                        <div className="mt-4 flex items-center gap-4">
                            <Input
                                placeholder="Cari produk..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="filter-low"
                                    checked={filterLowStock}
                                    onCheckedChange={setFilterLowStock}
                                />
                                <label htmlFor="filter-low" className="text-sm">Tampilkan Stok Rendah Saja</label>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Produk</TableHead>
                                    <TableHead>Stok</TableHead>
                                    <TableHead>Minimum</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell>
                                            <Input
                                                className="w-24"
                                                type="number"
                                                value={editStock[p.id] ?? p.stock}
                                                onChange={(e) => handleStockChange(p.id, Number(e.target.value))}
                                            />
                                        </TableCell>
                                        <TableCell>{p.minimum_stock_level}</TableCell>
                                        <TableCell>
                                            {p.stock < p.minimum_stock_level ? (
                                                <Badge variant="destructive">Perlu Restock</Badge>
                                            ) : (
                                                <Badge variant="outline">Aman</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button size="sm" onClick={() => handleStockUpdate(p.id)}>Update</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
