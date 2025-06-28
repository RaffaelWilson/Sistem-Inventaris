import { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import dayjs from 'dayjs';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Management Transaction',
        href: '/admin/transactions'
    },
];

interface Customer {
    id: number;
    name: string;
}
interface Product {
    id: number;
    name: string;
}
interface TransactionDetail {
    product_id: string;
    qty: number;
    subtotal: number;
}
interface Transaction {
    id: number;
    type: 'purchase' | 'sale';
    customer: Customer;
    total_price: number;
    created_at: string;
    details: TransactionDetail[];
}

interface Props {
    customers: Customer[];
    products: Product[];
    transactions: Transaction[];
}

export default function TransactionManagement({ customers, products, transactions }: Props) {
    const [open, setOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const { data, setData, post, put, processing, reset } = useForm({
        customer_id: '',
        type: 'sale',
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        items: [] as { product_id: string; qty: number; price: number }[],
    });

    const addItem = () => {
        setData('items', [...data.items, { product_id: '', qty: 1, price: 0 }]);
    };

    const updateItem = (index: number, key: string, value: any) => {
        const items = [...data.items];
        items[index] = { ...items[index], [key]: value };
        setData('items', items);
    };

    const removeItem = (index: number) => {
        const items = [...data.items];
        items.splice(index, 1);
        setData('items', items);
    };

    const total = data.items.reduce((sum, item) => sum + item.qty * item.price, 0);

    const openDetail = (tx: Transaction) => {
        setSelectedTransaction(tx);
        setDetailOpen(true);
    };

    const handleEdit = (tx: Transaction) => {
        setData({
            customer_id: tx.customer.id.toString(),
            type: tx.type,
            created_at: tx.created_at,
            items: tx.details.map((d) => ({
                product_id: d.product_id,
                qty: d.qty,
                price: d.subtotal / d.qty
            }))
        });
        setEditingId(tx.id);
        setOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus transaksi ini?')) {
            router.delete(`/admin/transactions/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className='space-y-6 p-6'>
                <Card className="p-5">
                    <CardHeader className="flex justify-between items-center">
                        <CardTitle>Manajemen Transaksi</CardTitle>
                        <Button onClick={() => { setOpen(true); reset(); setEditingId(null); }}>Tambah Transaksi</Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell>{tx.id}</TableCell>
                                        <TableCell>{tx.type}</TableCell>
                                        <TableCell>{tx.customer.name}</TableCell>
                                        <TableCell>Rp {tx.total_price.toLocaleString()}</TableCell>
                                        <TableCell>{tx.created_at}</TableCell>
                                        <TableCell className="space-x-1">
                                            <Button variant="outline" onClick={() => openDetail(tx)}>Detail</Button>
                                            <Button variant="secondary" onClick={() => handleEdit(tx)}>Edit</Button>
                                            <Button variant="destructive" onClick={() => handleDelete(tx.id)}>Hapus</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>


            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Transaksi' : 'Tambah Transaksi'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Customer</Label>
                            <Select value={data.customer_id} onValueChange={(val) => setData('customer_id', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Jenis Transaksi</Label>
                            <Select value={data.type} onValueChange={(val) => setData('type', val as 'purchase' | 'sale')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="purchase">Purchase</SelectItem>
                                    <SelectItem value="sale">Sale</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="secondary" onClick={addItem}>+ Tambah Produk</Button>
                        {data.items.map((item, i) => (
                            <div key={i} className="grid grid-cols-4 gap-4">
                                <Select value={item.product_id} onValueChange={(val) => updateItem(i, 'product_id', val)}>
                                    <SelectTrigger><SelectValue placeholder="Produk" /></SelectTrigger>
                                    <SelectContent>
                                        {products.map((p) => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input type="number" placeholder="Qty" value={item.qty} onChange={(e) => updateItem(i, 'qty', Number(e.target.value))} />
                                <Input type="number" placeholder="Harga" value={item.price} onChange={(e) => updateItem(i, 'price', Number(e.target.value))} />
                                <Button variant="destructive" onClick={() => removeItem(i)}>Hapus</Button>
                            </div>
                        ))}
                        <p><strong>Total: Rp {total.toLocaleString()}</strong></p>
                        <Button
                            onClick={() => {
                                if (data.items.length === 0 || !data.customer_id) return alert('Data belum lengkap');
                                const action = editingId ? put : post;
                                const url = editingId ? `/admin/transactions/${editingId}` : '/admin/transactions';
                                action(url, {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        reset();
                                        setOpen(false);
                                        setEditingId(null);
                                    },
                                });
                            }}
                            disabled={processing}
                        >
                            Simpan
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detail Transaksi</DialogTitle>
                    </DialogHeader>
                    {selectedTransaction && (
                        <div className="space-y-4">
                            <p><strong>ID:</strong> {selectedTransaction.id}</p>
                            <p><strong>Customer:</strong> {selectedTransaction.customer.name}</p>
                            <p><strong>Jenis:</strong> {selectedTransaction.type}</p>
                            <p><strong>Tanggal:</strong> {selectedTransaction.created_at}</p>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produk</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedTransaction.details.map((d, idx) => {
                                        const product = products.find((p) => p.id.toString() === d.product_id.toString());
                                        return (
                                            <TableRow key={idx}>
                                                <TableCell>{product?.name ?? 'Tidak ditemukan'}</TableCell>
                                                <TableCell>{d.qty}</TableCell>
                                                <TableCell>Rp {d.subtotal.toLocaleString()}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            <p className="text-right font-semibold text-lg">
                                Total: Rp {selectedTransaction.total_price.toLocaleString()}
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
