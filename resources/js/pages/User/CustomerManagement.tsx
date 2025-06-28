import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

export default function CustomerManagement({ customers }: { customers: any[] }) {
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, delete: destroy, reset } = useForm({
        name: '',
        phone: '',
        address: '',
    });

    const handleEdit = (cust: any) => {
        setEditing(cust.id);
        setData({ name: cust.name, phone: cust.phone, address: cust.address });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        editing
            ? put(`/user/customers/${editing}`, {
                onSuccess: () => {
                    setEditing(null);
                    reset();
                },
            })
            : post('/user/customers', {
                onSuccess: () => reset(),
            });
    };

    return (
        <AppLayout>
            <div className="p-6 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{editing ? 'Edit Customer' : 'Tambah Customer'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Nama</Label>
                                <Input className='mt-2' value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            </div>
                            <div>
                                <Label>No HP</Label>
                                <Input className='mt-2' value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            </div>
                            <div>
                                <Label>Alamat</Label>
                                <Input className='mt-2' value={data.address} onChange={(e) => setData('address', e.target.value)} />
                            </div>
                            <Button type="submit">{editing ? 'Update' : 'Simpan'}</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Data Customer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>No HP</TableHead>
                                    <TableHead>Alamat</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.map((cust) => (
                                    <TableRow key={cust.id}>
                                        <TableCell>{cust.name}</TableCell>
                                        <TableCell>{cust.phone}</TableCell>
                                        <TableCell>{cust.address}</TableCell>
                                        <TableCell className="space-x-2">
                                            <Button size="sm" variant="outline" onClick={() => handleEdit(cust)}>
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => destroy(`/user/customers/${cust.id}`)}
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
            </div>
        </AppLayout>
    );
}
