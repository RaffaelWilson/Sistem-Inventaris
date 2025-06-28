import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MyProfileProps {
    user: {
        name: string;
        email: string;
    };
}

export default function MyProfile({ user }: MyProfileProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put("/user/my-profile");
    };

    return (
        <AppLayout>
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>My Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name" >Nama</Label>
                                <Input
                                className="mt-2"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}

                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                className="mt-2"
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password">Password Baru (Opsional)</Label>
                                <Input
                                className="mt-2"
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                                <Input
                                className="mt-2"
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData("password_confirmation", e.target.value)}
                                />
                            </div>

                            <div className="text-right">
                                <Button type="submit" disabled={processing}>
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
