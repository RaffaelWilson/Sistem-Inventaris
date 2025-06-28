import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'History Inventory',
        href: '/admin/inventory-logs'
    },
];

interface Product {
    id: number;
    name: string;
}

interface InventoryLog {
    id: number;
    change: number;
    type: 'in' | 'out';
    reference: string;
    created_at: string;
    product: Product;
}

interface Props {
    logs: InventoryLog[];
    products: Product[];
    filters: {
        search?: string;
        type?: string;
    };
}

export default function InventoryLogMonitoring({ logs, filters }: Props) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        type: filters.type || 'all',
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            get('/admin/inventory-logs', { preserveState: true });
        }, 500);

        return () => clearTimeout(timeout);
    }, [data.search, data.type, get]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className='space-y-6 p-6'>
                <Card className="p-5">
                    <CardHeader>
                        <CardTitle>Monitoring Inventory Logs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4 max-w-xl">
                            <Input
                                placeholder="Cari nama produk..."
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                            />
                            <Select value={data.type} onValueChange={(val) => setData('type', val)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    <SelectItem value="in">Masuk</SelectItem>
                                    <SelectItem value="out">Keluar</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produk</TableHead>
                                    <TableHead>Perubahan</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Referensi</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{log.product.name}</TableCell>
                                        <TableCell>{log.change}</TableCell>
                                        <TableCell>{log.type === 'in' ? 'Masuk' : 'Keluar'}</TableCell>
                                        <TableCell>{log.reference}</TableCell>
                                        {/* <TableCell>{log.created_at}</TableCell> */}
                                        <TableCell>{dayjs(log.created_at).format('DD MMMM YYYY HH:mm')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
