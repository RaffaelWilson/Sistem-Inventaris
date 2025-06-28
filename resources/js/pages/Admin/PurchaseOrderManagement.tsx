import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Management Purchase Order',
        href: '/admin/purchase-orders',
    },
];

interface Supplier {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
}

interface Detail {
    product: Product;
    qty: number;
    price: number;
}

interface PurchaseOrder {
    id: number;
    supplier: { id: number; name: string };
    user: { name: string };
    order_date: string;
    status: 'draft' | 'received' | 'cancelled';
    details?: Detail[];
}

interface Props {
    orders: PurchaseOrder[];
    suppliers: Supplier[];
    products: Product[];
}

export default function PurchaseOrderManagement({ orders, suppliers, products }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

    const createForm = useForm({
        supplier_id: '',
        order_date: new Date().toISOString().slice(0, 16),
        status: 'draft',
        items: [] as { product_id: string; qty: number; price: number }[],
    });

    const detailForm = useForm({
        status: '',
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <Badge variant="secondary">Draft</Badge>;
            case 'received':
                return <Badge variant="default">Received</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const addItem = () => {
        createForm.setData('items', [...createForm.data.items, { product_id: '', qty: 1, price: 0 }]);
    };

    const updateItem = (index: number, key: string, value: any) => {
        const updated = [...createForm.data.items];
        updated[index] = { ...updated[index], [key]: value };
        createForm.setData('items', updated);
    };

    const removeItem = (index: number) => {
        const updated = [...createForm.data.items];
        updated.splice(index, 1);
        createForm.setData('items', updated);
    };

    const handleCreate = () => {
        createForm.post(route('purchase.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleOpenDetail = (po: PurchaseOrder) => {
        setSelectedPO(po);
        detailForm.setData('status', po.status);
        setIsDetailOpen(true);
    };

    const handleStatusUpdate = () => {
        if (selectedPO) {
            detailForm.put(route('purchase.update', selectedPO.id), {
                onSuccess: () => setIsDetailOpen(false),
            });
        }
    };

    const getTotal = (details?: Detail[]) =>
        details?.reduce((sum, d) => sum + d.qty * d.price, 0) ?? 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Purchase Order" />
            <div className="space-y-6 p-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">Daftar Purchase Order</CardTitle>
                        <Button onClick={() => setIsCreateOpen(true)}>Buat PO Baru</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Tanggal Order</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.length > 0 ? (
                                        orders.map((po) => (
                                            <TableRow key={po.id}>
                                                <TableCell className="font-medium">#{po.id}</TableCell>
                                                <TableCell>{po.supplier.name}</TableCell>
                                                <TableCell>{po.user.name}</TableCell>
                                                <TableCell>{format(new Date(po.order_date), 'dd MMM yyyy HH:mm')}</TableCell>
                                                <TableCell>{getStatusBadge(po.status)}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm" onClick={() => handleOpenDetail(po)}>
                                                        Lihat
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-muted-foreground text-center">
                                                Tidak ada data PO.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="w-full max-w-4xl sm:rounded-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Buat Purchase Order</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-8">
                        <div>
                            <Label>Supplier</Label>
                            <Select onValueChange={(val) => createForm.setData('supplier_id', val)}>
                                <SelectTrigger className='mt-1'>
                                    <SelectValue placeholder="Pilih Supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Tanggal Order</Label>
                            <Input
                                type="datetime-local"
                                value={createForm.data.order_date}
                                onChange={(e) => createForm.setData('order_date', e.target.value)}
                                className='mt-1'
                            />
                        </div>
                        <div>
                            <Label>Produk</Label>
                            <Button size="sm" variant="secondary" onClick={addItem} className='mt-1'>
                                + Tambah Produk
                            </Button>
                        </div>
                        {createForm.data.items.map((item, i) => (
                            <div key={i} className="grid grid-cols-4 gap-4 items-center">
                                <Select value={item.product_id} onValueChange={(val) => updateItem(i, 'product_id', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Produk" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((p) => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="number"
                                    value={item.qty}
                                    onChange={(e) => updateItem(i, 'qty', parseInt(e.target.value))}
                                    placeholder="Qty"
                                />
                                <Input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => updateItem(i, 'price', parseFloat(e.target.value))}
                                    placeholder="Harga"
                                />
                                <Button variant="destructive" onClick={() => removeItem(i)}>
                                    Hapus
                                </Button>
                            </div>
                        ))}
                        <Button onClick={handleCreate}>Simpan</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal Detail */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Detail Purchase Order #{selectedPO?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedPO && (
                        <div className="space-y-4">
                            <p><strong>Supplier:</strong> {selectedPO.supplier.name}</p>
                            <p><strong>User:</strong> {selectedPO.user.name}</p>
                            <p><strong>Tanggal:</strong> {format(new Date(selectedPO.order_date), 'dd MMM yyyy HH:mm')}</p>

                            <Select value={detailForm.data.status} onValueChange={(val) => detailForm.setData('status', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Ubah Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="received">Received</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produk</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Harga</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedPO.details?.map((d, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{d.product.name}</TableCell>
                                            <TableCell>{d.qty}</TableCell>
                                            <TableCell>Rp {d.price.toLocaleString()}</TableCell>
                                            <TableCell>Rp {(d.qty * d.price).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={3}><strong>Total</strong></TableCell>
                                        <TableCell><strong>Rp {getTotal(selectedPO.details).toLocaleString()}</strong></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <Button onClick={handleStatusUpdate}>Simpan Status</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
