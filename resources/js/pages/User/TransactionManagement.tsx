import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { router } from "@inertiajs/react";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tranksaksi Penjualan',
        href: '/user/transactions'
    },
];

type Product = {
    id: number | string;
    name: string;
    [key: string]: unknown;
};

type Customer = {
    id: number | string;
    name: string;
    [key: string]: unknown;
};

type Transaction = {
    id: number | string;
    created_at: string;
    customer?: Customer;
    total_price: number;
    details?: {
        product: Product;
        qty: number;
        subtotal: number;
    }[];
    [key: string]: unknown;
};

interface TransactionManagementProps {
    products: Product[];
    customers: Customer[];
    transactions: Transaction[];
}

export default function TransactionManagement({ products, customers, transactions }: TransactionManagementProps) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        customer_id: "",
        created_at: new Date().toISOString().slice(0, 10),
        items: [{ product_id: "", qty: 1, price: 0 }],
    });

    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const total = form.items.reduce((sum, item) => sum + item.qty * item.price, 0);

    const handleAddItem = () => {
        setForm({ ...form, items: [...form.items, { product_id: "", qty: 1, price: 0 }] });
    };

    const handleItemChange = (index: number, field: string, value: string) => {
        const items = [...form.items];
        items[index][field] = field === "qty" || field === "price" ? parseFloat(value) : value;
        setForm({ ...form, items });
    };

    const handleSubmit = () => {
        router.post("/user/transactions", {
            ...form,
        }, {
            onSuccess: () => setOpen(false),
        });
    };

    const handleDelete = (id: number | string) => {
        if (confirm("Yakin ingin menghapus transaksi ini?")) {
            router.delete(`/user/transactions/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-6 space-y-6">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Transaksi Penjualan</CardTitle>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>Tambah Transaksi</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                    <DialogTitle>Form Tambah Transaksi</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Customer</Label>
                                            <Select value={form.customer_id} onValueChange={(val) => setForm({ ...form, customer_id: val })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Customer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {customers.map((c) => (
                                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Tanggal</Label>
                                            <Input
                                                type="date"
                                                value={form.created_at}
                                                onChange={(e) => setForm({ ...form, created_at: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {form.items.map((item, index) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div>
                                                    <Label>Produk</Label>
                                                    <Select
                                                        value={item.product_id}
                                                        onValueChange={(val) => handleItemChange(index, "product_id", val)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Produk" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {products.map((p) => (
                                                                <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Qty</Label>
                                                    <Input
                                                        type="number"
                                                        value={item.qty}
                                                        onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Harga Satuan</Label>
                                                    <Input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => handleItemChange(index, "price", e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <p className="font-semibold">Subtotal: Rp{(item.qty * item.price).toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <Button type="button" variant="outline" onClick={handleAddItem}>
                                            + Tambah Produk
                                        </Button>
                                    </div>
                                    <div className="text-right font-bold text-lg mt-4">
                                        Total: Rp{total.toLocaleString('id-ID')}
                                    </div>
                                    <div className="text-right">
                                        <Button onClick={handleSubmit}>Simpan Transaksi</Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Total Harga</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((trx) => (
                                    <TableRow key={trx.id}>
                                        <TableCell>{format(new Date(trx.created_at), "dd MMMM yyyy", { locale: id })}</TableCell>
                                        <TableCell>{trx.customer?.name ?? '-'}</TableCell>
                                        <TableCell>Rp{trx.total_price.toLocaleString('id-ID')}</TableCell>
                                        <TableCell className="space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedTransaction(trx);
                                                    setDetailOpen(true);
                                                }}
                                            >
                                                Detail
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(trx.id)}
                                            >
                                                Hapus
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Detail Dialog */}
                <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Detail Transaksi</DialogTitle>
                        </DialogHeader>
                        {selectedTransaction && (
                            <div className="space-y-4">
                                <p><strong>Tanggal:</strong> {format(new Date(selectedTransaction.created_at), "dd MMMM yyyy", { locale: id })}</p>
                                <p><strong>Customer:</strong> {selectedTransaction.customer?.name ?? '-'}</p>
                                <p><strong>Total:</strong> Rp{selectedTransaction.total_price.toLocaleString('id-ID')}</p>
                                <div>
                                    <p className="font-semibold mb-2">Item Transaksi:</p>
                                    <ul className="space-y-1">
                                        {selectedTransaction.details?.map((item, i) => (
                                            <li key={i} className="border p-2 rounded">
                                                {item.product.name} - Qty: {item.qty} - Subtotal: Rp{item.subtotal.toLocaleString('id-ID')}
                                            </li>
                                        )) ?? <li>(Data tidak tersedia)</li>}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
