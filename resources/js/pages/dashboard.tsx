import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { type BreadcrumbItem } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PurchaseTx {
    id: number;
    supplier: string;
    invoice: string;
    total: number;
    date: string;
}

interface SalesTx {
    id: number;
    customer: string;
    receipt: string;
    total: number;
    date: string;
}

interface Props {
    totalProducts: number;
    totalCategories: number;
    totalSuppliers: number;
    totalCustomers: number;
    products: {
        id: number;
        name: string;
        stock: number;
        category: { name: string };
    }[];
    customers: {
        id: number;
        name: string;
        email: string;
        phone: string;
    }[];
    purchaseTransactions: PurchaseTx[];
    salesTransactions: SalesTx[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
];

const dummyChartData = [
    { name: 'Jan', sales: 4000, purchases: 2400 },
    { name: 'Feb', sales: 3000, purchases: 1398 },
    { name: 'Mar', sales: 2000, purchases: 9800 },
    { name: 'Apr', sales: 2780, purchases: 3908 },
    { name: 'May', sales: 1890, purchases: 4800 },
];

export default function Dashboard({
    totalProducts,
    totalCategories,
    totalSuppliers,
    totalCustomers,
    products,
    customers,
    purchaseTransactions,
    salesTransactions,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Products', value: totalProducts },
                        { label: 'Total Categories', value: totalCategories },
                        { label: 'Total Suppliers', value: totalSuppliers },
                        { label: 'Total Customers', value: totalCustomers },
                    ].map(({ label, value }) => (
                        <Card key={label} className="text-center">
                            <CardHeader>
                                <CardTitle>{label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Latest Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Stock</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.name}</TableCell>
                                            <TableCell>{p.category?.name ?? '-'}</TableCell>
                                            <TableCell className="text-right">{p.stock}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Latest Customers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell>{c.name}</TableCell>
                                            <TableCell>{c.email}</TableCell>
                                            <TableCell>{c.phone}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full py-6 text-lg">
                                Purchase Transaction
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Recent Purchase Transactions</DialogTitle>
                            </DialogHeader>
                            {purchaseTransactions.length === 0 ? (
                                <p className="text-center text-muted-foreground">No data.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Supplier</TableHead>
                                            <TableHead>Invoice</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {purchaseTransactions.map((tx) => (
                                            <TableRow key={tx.id}>
                                                <TableCell>{tx.date}</TableCell>
                                                <TableCell>{tx.supplier}</TableCell>
                                                <TableCell>{tx.invoice}</TableCell>
                                                <TableCell className="text-right">{tx.total.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full py-6 text-lg">
                                Sales Transaction
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Recent Sales Transactions</DialogTitle>
                            </DialogHeader>
                            {salesTransactions.length === 0 ? (
                                <p className="text-center text-muted-foreground">No data.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Receipt</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {salesTransactions.map((tx) => (
                                            <TableRow key={tx.id}>
                                                <TableCell>{tx.date}</TableCell>
                                                <TableCell>{tx.customer}</TableCell>
                                                <TableCell>{tx.receipt}</TableCell>
                                                <TableCell className="text-right">{tx.total.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Transaction Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dummyChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#4f46e5" name="Sales" />
                                <Bar dataKey="purchases" fill="#16a34a" name="Purchases" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
