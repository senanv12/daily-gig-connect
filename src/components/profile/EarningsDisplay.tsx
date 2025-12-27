import { Wallet, TrendingUp, ArrowUpRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EarningsDisplayProps {
  totalEarnings: number;
  thisMonth: number;
  pendingPayment: number;
  className?: string;
}

export function EarningsDisplay({ 
  totalEarnings, 
  thisMonth, 
  pendingPayment,
  className 
}: EarningsDisplayProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl p-6 space-y-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Qazanclarım</h2>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
          <Wallet className="h-5 w-5 text-success" />
        </div>
      </div>

      {/* Total Earnings */}
      <div className="text-center py-4 bg-gradient-to-br from-success/10 to-success/5 rounded-xl">
        <p className="text-sm text-muted-foreground mb-1">Ümumi qazanc</p>
        <p className="text-4xl font-bold text-success">{totalEarnings.toFixed(2)} ₼</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Bu ay</span>
          </div>
          <p className="text-xl font-bold text-foreground">{thisMonth.toFixed(2)} ₼</p>
          <div className="flex items-center gap-1 text-xs text-success mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+15% keçən aya nisbətən</span>
          </div>
        </div>

        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">Gözləyən</span>
          </div>
          <p className="text-xl font-bold text-foreground">{pendingPayment.toFixed(2)} ₼</p>
          <p className="text-xs text-muted-foreground mt-1">Ödəniş gözlənilir</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Son əməliyyatlar</h3>
        <div className="space-y-2">
          {[
            { name: 'Event Pro MMC', amount: 70, date: 'Dünən' },
            { name: 'Cafe Milano', amount: 50, date: '3 gün əvvəl' },
            { name: 'LogiTrans MMC', amount: 120, date: '1 həftə əvvəl' },
          ].map((transaction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-background rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  {transaction.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{transaction.name}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-success">+{transaction.amount} ₼</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
