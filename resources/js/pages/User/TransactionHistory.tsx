import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type Transaction = {
  id: number;
  created_at: string;
  total_price: number;
  user?: {
    name: string;
  };
  customer?: {
    name: string;
  };
};

interface Props {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: Props) {
  return (
    <AppLayout>
      <div className="p-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total Harga</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell>{format(new Date(trx.created_at), "dd MMMM yyyy", { locale: id })}</TableCell>
                    <TableCell>{trx.user?.name ?? '-'}</TableCell>
                    <TableCell>{trx.customer?.name ?? '-'}</TableCell>
                    <TableCell>Rp{trx.total_price.toLocaleString("id-ID")}</TableCell>
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
