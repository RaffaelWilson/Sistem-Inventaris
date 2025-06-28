// src/pages/Admin/UserManagement.tsx
import { useEffect, useState } from "react";
import axios from "axios";

import {
    Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";

import AppLayout from "@/layouts/app-layout";

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user";
}

export default function UserManagement() {
    /* ---------------------------- state ---------------------------------- */
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        id: null as number | null,
        name: "",
        email: "",
        password: "",
        role: "user" as "admin" | "user",
    });

    /* --------------------------- helpers --------------------------------- */
    const resetForm = () => {
        setForm({ id: null, name: "", email: "", password: "", role: "user" });
        setIsEditing(false);
        setDialogOpen(false);
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get<User[]>("/admin/users");
            setUsers(data);
        } finally {
            setLoading(false);
        }
    };

    /* -------------------------- lifecycle -------------------------------- */
    useEffect(() => { fetchUsers(); }, []);

    /* ----------------------- CRUD actions -------------------------------- */
    const handleSubmit = async () => {
        const url = form.id ? `/admin/users/${form.id}` : "/admin/users";

        try {
            if (form.id) {
                await axios.put(url, form);
                alert("User berhasil di-update");
            } else {
                await axios.post(url, form);
                alert("User berhasil ditambahkan");
            }
            await fetchUsers();
            resetForm();
        } catch (err: any) {
            /* validasi 422 */
            if (err.response?.status === 422) {
                const errorsObj = err.response.data.errors;
                const messages = Object.values(errorsObj).flat().join("\n");
                alert(messages);
            } else {
                alert(err.response?.data?.message ?? "Terjadi kesalahan");
            }
        }
    };

    const handleEdit = (u: User) => {
        setForm({ ...u, password: "" });
        setIsEditing(true);
        setDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin ingin menghapus user ini?")) return;
        try {
            await axios.delete(`/admin/users/${id}`);
            alert("User dihapus");
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch {
            alert("Gagal menghapus user");
        }
    };

    /* --------------------------- render ---------------------------------- */
    return (
        <AppLayout>
            <div className="p-6 space-y-6">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Manajemen User</CardTitle>

                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    onClick={() => {
                                        resetForm();
                                        setDialogOpen(true);
                                    }}
                                >
                                    Tambah User
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>{isEditing ? "Edit User" : "Tambah User"}</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <div>
                                        <Label>Nama</Label>
                                        <Input
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <Label>Email</Label>
                                        <Input
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <Label>
                                            Password&nbsp;
                                            {isEditing && <span className="text-muted-foreground">(kosongkan jika tidak diubah)</span>}
                                        </Label>
                                        <Input
                                            type="password"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <Label>Role</Label>
                                        <Select
                                            value={form.role}
                                            onValueChange={(val) => setForm({ ...form, role: val as "admin" | "user" })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="user">User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="text-right">
                                        <Button onClick={handleSubmit}>
                                            {isEditing ? "Update" : "Simpan"}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>

                    <CardContent>
                        {loading ? (
                            <p className="py-6 text-center">Memuat data…</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell className="capitalize">{user.role}</TableCell>
                                            <TableCell className="space-x-2 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    Hapus
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
