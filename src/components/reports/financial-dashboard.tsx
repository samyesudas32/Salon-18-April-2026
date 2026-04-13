'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useApp } from '@/app/lib/store';
import { format, eachMonthOfInterval, subMonths, startOfYear, endOfYear, getMonth, getYear } from 'date-fns';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, TrendingUp, Download, FileText } from 'lucide-react';
import { analyzeFinancialReports, type AnalyzeFinancialReportsOutput } from '@/ai/flows/analyze-financial-reports';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to parse YYYY-MM-DD string as local date to avoid timezone issues.
const parseDateString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}


export function FinancialDashboard() {
  const { bookings, expenses: dailyExpenses, productExpenses } = useApp();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeFinancialReportsOutput | null>(null);

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

      // Only include COMPLETED bookings in financial calculations
      const completedBookings = monthBookings.filter(b => b.status === 'completed');

      const revenue = completedBookings.reduce((s, b) => s + b.totalAmount, 0);
      const bookingExpenses = completedBookings.reduce((s, b) => s + b.expenseAmount, 0);
      const totalDailyExpenses = monthDailyExpenses.reduce((s, e) => s + e.amount, 0);
      const totalProductExpenses = monthProductExpenses.reduce((s, e) => s + e.amount, 0);

      const totalExpenses = bookingExpenses + totalDailyExpenses + totalProductExpenses;
      
      return {
        period: format(month, 'MMM yyyy'),
        totalBookings: completedBookings.length, // Show count of completed services
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

    // Only include COMPLETED bookings in financial calculations
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

  const downloadPDF = (type: 'monthly' | 'annual') => {
    const doc = new jsPDF();
    const title = type === 'monthly' ? 'Monthly Financial Report (Last 6 Months)' : `Annual Financial Report (${annualReport.period})`;
    
    doc.setFontSize(20);
    doc.text('ServiceFlow Hub', 105, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(title, 105, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'PPP p')}`, 105, 32, { align: 'center' });

    const tableData = type === 'monthly' 
      ? monthlyReport.map(r => [r.period, r.totalBookings, `Rs ${r.totalRevenue.toLocaleString()}`, `Rs ${r.totalExpenses.toLocaleString()}`, `Rs ${r.netProfit.toLocaleString()}`])
      : [[annualReport.period, annualReport.totalBookings, `Rs ${annualReport.totalRevenue.toLocaleString()}`, `Rs ${annualReport.totalExpenses.toLocaleString()}`, `Rs ${annualReport.netProfit.toLocaleString()}`]];

    autoTable(doc, {
      startY: 40,
      head: [['Period', 'Completed Services', 'Revenue', 'Total Expenses', 'Net Profit']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillStyle: 'f', fillColor: [33, 53, 85] },
    });

    if (analysis && type === 'monthly') {
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text('AI Business Insights:', 14, finalY);
      doc.setFontSize(10);
      const splitSummary = doc.splitTextToSize(analysis.summary, 180);
      doc.text(splitSummary, 14, finalY + 7);
    }

    doc.save(`ServiceFlow_${type}_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const chartConfig = {
    totalRevenue: { label: 'Revenue', color: 'hsl(var(--primary))' },
    totalExpenses: { label: 'Expenses', color: 'hsl(var(--destructive))' },
    netProfit: { label: 'Profit', color: 'hsl(var(--accent))' },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 bg-card p-4 rounded-xl border border-border/50 shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Report Downloads</h3>
          <p className="text-xs text-muted-foreground">Export your financial data to PDF format. Revenue includes completed services only.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-primary/20 hover:bg-primary/5 text-primary"
            onClick={() => downloadPDF('monthly')}
          >
            <Download className="h-4 w-4" />
            Monthly PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-accent/20 hover:bg-accent/5 text-accent-foreground"
            onClick={() => downloadPDF('annual')}
          >
            <FileText className="h-4 w-4" />
            Annual PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Monthly Revenue vs Profit
            </CardTitle>
            <CardDescription>Visual summary (Completed Services only)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={monthlyReport}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
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

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Smart AI Analysis
              </CardTitle>
              <CardDescription>Actionable insights powered by Gemini</CardDescription>
            </div>
            <Button 
              size="sm" 
              onClick={handleAIAnalysis} 
              disabled={isAnalyzing}
              className="bg-accent text-accent-foreground hover:bg-accent/80"
            >
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Analyze Reports
            </Button>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                <div>
                  <h4 className="text-sm font-bold text-primary mb-1">Executive Summary</h4>
                  <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Busiest Periods</h4>
                    <ul className="text-sm list-disc list-inside">
                      {analysis.busiestPeriods.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">High Profit Periods</h4>
                    <ul className="text-sm list-disc list-inside">
                      {analysis.highestProfitPeriods.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <Sparkles className="h-12 w-12 opacity-10 mb-2" />
                <p className="text-sm">Click "Analyze Reports" to get AI insights.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline font-bold">Financial Summary Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="p-3 text-left">Period</th>
                  <th className="p-3 text-center">Completed</th>
                  <th className="p-3 text-right">Revenue</th>
                  <th className="p-3 text-right">Total Expenses</th>
                  <th className="p-3 text-right">Net Profit</th>
                </tr>
              </thead>
              <tbody>
                {monthlyReport.map((row) => (
                  <tr key={row.period} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="p-3 font-medium">{row.period}</td>
                    <td className="p-3 text-center">{row.totalBookings}</td>
                    <td className="p-3 text-right">Rs {row.totalRevenue.toLocaleString()}</td>
                    <td className="p-3 text-right text-destructive">Rs {row.totalExpenses.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-primary">Rs {row.netProfit.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
