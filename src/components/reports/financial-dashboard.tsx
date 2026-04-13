'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useApp } from '@/app/lib/store';
import { format, eachMonthOfInterval, subMonths, startOfYear, endOfYear, getMonth, getYear, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, TrendingUp, Download, FileText, Calendar } from 'lucide-react';
import { analyzeFinancialReports, type AnalyzeFinancialReportsOutput } from '@/ai/flows/analyze-financial-reports';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cn } from '@/lib/utils';

// Helper to parse YYYY-MM-DD string as local date to avoid timezone issues.
const parseDateString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function FinancialDashboard() {
  const { bookings, expenses: dailyExpenses, productExpenses, businessName } = useApp();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeFinancialReportsOutput | null>(null);
  const [tableTab, setTableTab] = useState<'daily' | 'monthly'>('monthly');

  const dailyReport = useMemo(() => {
    const now = new Date();
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(now),
      end: endOfMonth(now),
    });

    return daysInMonth.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');

      const dayBookings = bookings.filter(b => b.date === dayStr && b.status === 'completed');
      const todayDailyExpenses = dailyExpenses.filter(e => e.date === dayStr);
      const todayProductExpenses = productExpenses.filter(e => e.date === dayStr);

      const revenue = dayBookings.reduce((s, b) => s + b.totalAmount, 0);
      const bExpenses = dayBookings.reduce((s, b) => s + b.expenseAmount, 0);
      const dExpenses = todayDailyExpenses.reduce((s, e) => s + e.amount, 0);
      const pExpenses = todayProductExpenses.reduce((s, e) => s + e.amount, 0);

      const totalExpenses = bExpenses + dExpenses + pExpenses;

      return {
        period: format(day, 'MMM dd'),
        totalBookings: dayBookings.length,
        totalRevenue: revenue,
        totalExpenses: totalExpenses,
        netProfit: revenue - totalExpenses,
      };
    });
  }, [bookings, dailyExpenses, productExpenses]);

  const monthlyReport = useMemo(() => {
    const now = new Date();
    const range = eachMonthOfInterval({
      start: subMonths(now, 5),
      end: now,
    });

    return range.map(month => {
      const monthIndex = getMonth(month);
      const year = getYear(month);

      const monthBookings = bookings.filter(b => {
        const d = parseDateString(b.date);
        return getMonth(d) === monthIndex && getYear(d) === year;
      });
      
      const monthDailyExpenses = dailyExpenses.filter(e => {
        const d = parseDateString(e.date);
        return getMonth(d) === monthIndex && getYear(d) === year;
      });

      const monthProductExpenses = productExpenses.filter(e => {
        const d = parseDateString(e.date);
        return getMonth(d) === monthIndex && getYear(d) === year;
      });

      const completedBookings = monthBookings.filter(b => b.status === 'completed');

      const revenue = completedBookings.reduce((s, b) => s + b.totalAmount, 0);
      const bookingExpenses = completedBookings.reduce((s, b) => s + b.expenseAmount, 0);
      const totalDailyExpenses = monthDailyExpenses.reduce((s, e) => s + e.amount, 0);
      const totalProductExpenses = monthProductExpenses.reduce((s, e) => s + e.amount, 0);

      const totalExpenses = bookingExpenses + totalDailyExpenses + totalProductExpenses;
      
      return {
        period: format(month, 'MMM yyyy'),
        totalBookings: completedBookings.length,
        totalRevenue: revenue,
        totalExpenses: totalExpenses,
        netProfit: revenue - totalExpenses,
      };
    });
  }, [bookings, dailyExpenses, productExpenses]);

  const annualReport = useMemo(() => {
    const now = new Date();
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);
    
    const yearBookings = bookings.filter(b => {
      const d = parseDateString(b.date);
      return d >= yearStart && d <= yearEnd;
    });

    const yearDailyExpenses = dailyExpenses.filter(e => {
        const d = parseDateString(e.date);
        return d >= yearStart && d <= yearEnd;
    });

    const yearProductExpenses = productExpenses.filter(e => {
        const d = parseDateString(e.date);
        return d >= yearStart && d <= yearEnd;
    });

    const completedYearBookings = yearBookings.filter(b => b.status === 'completed');

    const revenue = completedYearBookings.reduce((s, b) => s + b.totalAmount, 0);
    const bookingExpenses = completedYearBookings.reduce((s, b) => s + b.expenseAmount, 0);
    const totalDailyExpenses = yearDailyExpenses.reduce((s, e) => s + e.amount, 0);
    const totalProductExpenses = yearProductExpenses.reduce((s, e) => s + e.amount, 0);

    const totalExpenses = bookingExpenses + totalDailyExpenses + totalProductExpenses;

    return {
      period: format(now, 'yyyy'),
      totalBookings: completedYearBookings.length,
      totalRevenue: revenue,
      totalExpenses: totalExpenses,
      netProfit: revenue - totalExpenses,
    };
  }, [bookings, dailyExpenses, productExpenses]);

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeFinancialReports({
        reportType: 'monthly',
        reportPeriod: 'Last 6 Months',
        financialData: monthlyReport,
        additionalNotes: 'Analysis requested for current business trend performance. Total expenses include booking-specific expenses for completed services, daily operational costs, and product purchase costs. Revenue is strictly based on completed services.',
      });
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadPDF = (type: 'daily' | 'monthly' | 'annual') => {
    const doc = new jsPDF();
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');
    
    let title = '';
    let tableData = [];
    let headers = ['Description', 'Amount'];

    if (type === 'daily') {
      title = `Today's Financial Status (${format(now, 'PPP')})`;
      
      const dayBookings = bookings.filter(b => b.date === todayStr && b.status === 'completed');
      const dayDailyExpenses = dailyExpenses.filter(e => e.date === todayStr);
      const dayProductExpenses = productExpenses.filter(e => e.date === todayStr);

      const revenue = dayBookings.reduce((s, b) => s + b.totalAmount, 0);
      const bookingEx = dayBookings.reduce((s, b) => s + b.expenseAmount, 0);
      const dailyEx = dayDailyExpenses.reduce((s, e) => s + e.amount, 0);
      const productEx = dayProductExpenses.reduce((s, e) => s + e.amount, 0);

      const totalEx = bookingEx + dailyEx + productEx;
      const net = revenue - totalEx;

      tableData = [
        ['Total Revenue (Completed)', `Rs ${revenue.toLocaleString()}`],
        ['Total Daily Expenses', `Rs ${totalEx.toLocaleString()}`],
        ['Net Daily Profit', `Rs ${net.toLocaleString()}`]
      ];
    } else if (type === 'monthly') {
      title = 'Monthly Financial Report (Last 6 Months)';
      headers = ['Period', 'Completed', 'Revenue', 'Expenses', 'Net Profit'];
      tableData = monthlyReport.map(r => [
        r.period, 
        r.totalBookings, 
        `Rs ${r.totalRevenue.toLocaleString()}`, 
        `Rs ${r.totalExpenses.toLocaleString()}`, 
        `Rs ${r.netProfit.toLocaleString()}`
      ]);
    } else {
      title = `Annual Financial Report (${annualReport.period})`;
      headers = ['Year', 'Completed', 'Revenue', 'Expenses', 'Net Profit'];
      tableData = [[
        annualReport.period, 
        annualReport.totalBookings, 
        `Rs ${annualReport.totalRevenue.toLocaleString()}`, 
        `Rs ${annualReport.totalExpenses.toLocaleString()}`, 
        `Rs ${annualReport.netProfit.toLocaleString()}`
      ]];
    }
    
    doc.setFontSize(22);
    doc.setTextColor(33, 53, 85);
    doc.setFont('helvetica', 'bold');
    doc.text(businessName.toUpperCase(), 105, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(title, 105, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${format(new Date(), 'PPP p')}`, 105, 32, { align: 'center' });

    autoTable(doc, {
      startY: 40,
      head: [headers],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [33, 53, 85] },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    doc.save(`${businessName.replace(/\s+/g, '_')}_${type}_Report.pdf`);
  };

  const chartConfig = {
    totalRevenue: { label: 'Revenue', color: 'hsl(var(--primary))' },
    netProfit: { label: 'Profit', color: 'hsl(var(--accent))' },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center gap-4 bg-card p-6 rounded-2xl border border-border/40 shadow-sm">
        <div className="flex-1 min-w-[250px]">
          <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
            <Download className="h-4 w-4" />
            Report Export Center
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Download your detailed financial statements in PDF format.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-semibold"
            onClick={() => downloadPDF('daily')}
          >
            <Calendar className="h-4 w-4" />
            Today's PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-primary/20 hover:bg-primary/5 text-primary font-semibold"
            onClick={() => downloadPDF('monthly')}
          >
            <TrendingUp className="h-4 w-4" />
            Monthly PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-accent/20 hover:bg-accent/5 text-accent-foreground font-semibold"
            onClick={() => downloadPDF('annual')}
          >
            <FileText className="h-4 w-4" />
            Annual PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-card/50 border-b border-border/40">
            <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Monthly Revenue vs Profit
            </CardTitle>
            <CardDescription>Last 6 months performance</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] p-6">
            <ChartContainer config={chartConfig}>
              <BarChart data={monthlyReport}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="period" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="totalRevenue" fill="var(--color-totalRevenue)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="netProfit" fill="var(--color-netProfit)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-accent/5 border-b border-accent/10 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-headline font-bold flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5 text-accent" />
                Smart AI Analysis
              </CardTitle>
              <CardDescription>Insights powered by Gemini</CardDescription>
            </div>
            <Button 
              size="sm" 
              onClick={handleAIAnalysis} 
              disabled={isAnalyzing}
              className="bg-accent text-accent-foreground hover:bg-accent/80 shadow-md"
            >
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Analyze
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            {analysis ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                <div>
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Executive Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-muted/30 p-4 rounded-xl">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase mb-2">Busiest Periods</h4>
                    <ul className="text-xs space-y-1.5">
                      {analysis.busiestPeriods.map((p, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-primary" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase mb-2">Profit Peaks</h4>
                    <ul className="text-xs space-y-1.5">
                      {analysis.highestProfitPeriods.map((p, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-accent" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 opacity-20" />
                </div>
                <p className="text-sm font-medium">No analysis generated yet.</p>
                <p className="text-xs">Click the analyze button for professional insights.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-card/50 border-b border-border/40 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-headline font-bold">Financial Statements</CardTitle>
            <CardDescription>Review {tableTab === 'daily' ? 'day-by-day results' : 'monthly summaries'}</CardDescription>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
            <Button 
              variant={tableTab === 'monthly' ? 'default' : 'ghost'} 
              size="sm" 
              className="h-8 text-xs px-4"
              onClick={() => setTableTab('monthly')}
            >
              Monthly
            </Button>
            <Button 
              variant={tableTab === 'daily' ? 'default' : 'ghost'} 
              size="sm" 
              className="h-8 text-xs px-4"
              onClick={() => setTableTab('daily')}
            >
              Daily
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {tableTab === 'monthly' ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b">
                    <th className="p-4 text-left font-bold text-primary">Month</th>
                    <th className="p-4 text-center font-bold text-primary">Completed</th>
                    <th className="p-4 text-right font-bold text-primary">Revenue</th>
                    <th className="p-4 text-right font-bold text-primary">Expenses</th>
                    <th className="p-4 text-right font-bold text-primary">Net Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyReport.map((row) => (
                    <tr key={row.period} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-medium">{row.period}</td>
                      <td className="p-4 text-center">{row.totalBookings}</td>
                      <td className="p-4 text-right">Rs {row.totalRevenue.toLocaleString()}</td>
                      <td className="p-4 text-right text-destructive">Rs {row.totalExpenses.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold text-primary">Rs {row.netProfit.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b">
                    <th className="p-4 text-left font-bold text-primary">Date</th>
                    <th className="p-4 text-right font-bold text-primary">Expenses</th>
                    <th className="p-4 text-right font-bold text-primary">Net Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyReport.map((row) => (
                    <tr key={row.period} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-medium">{row.period}</td>
                      <td className="p-4 text-right text-destructive">Rs {row.totalExpenses.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold text-primary">Rs {row.netProfit.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
