import { useState } from "react"
import { Head, useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Management Supplier",
        href: "/admin/supplier-management",
    },
]

interface Supplier {
    id: number
    name: string
    phone: string
    address: string
}

interface Props {
    suppliers: Supplier[]
}

export default function SupplierManagement({ suppliers }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const { data, setData, reset, post, put, delete: destroy } = useForm({
        name: "",
        phone: "",
        address: "",
    })

    const openModal = () => {
        setIsDialogOpen(true)
    }

    const closeModal = () => {
        reset()
        setEditingId(null)
        setIsDialogOpen(false)
    }

    const handleEdit = (supplier: Supplier) => {
        setData({
            name: supplier.name,
            phone: supplier.phone,
            address: supplier.address,
        })
        setEditingId(supplier.id)
        openModal()
    }

    const handleSubmit = () => {
        if (editingId) {
            put(route("supplier.update", editingId), {
                preserveScroll: true,
                onSuccess: closeModal,
            })
        } else {
            post(route("supplier.store"), {
                preserveScroll: true,
                onSuccess: closeModal,
            })
        }
    }

    const handleDelete = (id: number) => {
        if (confirm("Yakin ingin menghapus supplier ini?")) {
            destroy(route("supplier.destroy", id), {
                preserveScroll: true,
            })
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Supplier" />
            <Card className="m-6">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">Manajemen Supplier</CardTitle>
                        <Button onClick={openModal}>Tambah Supplier</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Telepon</TableHead>
                                <TableHead>Alamat</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suppliers.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell>{s.name}</TableCell>
                                    <TableCell>{s.phone}</TableCell>
                                    <TableCell>{s.address}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button size="sm" onClick={() => handleEdit(s)}>Edit</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id)}>Hapus</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <div className="space-y-4">
                        <div>
                            <Label>Nama</Label>
                            <Input name="name" value={data.name} onChange={(e) => setData("name", e.target.value)} className="mt-1" />
                        </div>
                        <div>
                            <Label>Telepon</Label>
                            <Input name="phone" value={data.phone} onChange={(e) => setData("phone", e.target.value)} className="mt-1" />
                        </div>
                        <div>
                            <Label>Alamat</Label>
                            <Input name="address" value={data.address} onChange={(e) => setData("address", e.target.value)} className="mt-1" />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={closeModal}>Batal</Button>
                            <Button onClick={handleSubmit}>{editingId ? "Update" : "Simpan"}</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    )
}
