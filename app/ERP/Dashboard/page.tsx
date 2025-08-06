'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiArrowLeft, 
  FiDollarSign, 
  FiTrendingUp, 
  FiTrendingDown,
  FiPieChart,
  FiBarChart2,
  FiCreditCard,
  FiActivity
} from 'react-icons/fi';
import ERP from "../page";
import dynamic from 'next/dynamic';

type ApexOptions = {
  chart: {
    type: 'pie' | 'donut' | 'bar' | 'area' | 'line';
    width?: number | string;
    height?: number | string;
    stacked?: boolean;
    toolbar?: {
      show: boolean;
    };
    animations?: {
      enabled: boolean;
      easing?: string;
      dynamicAnimation?: {
        speed?: number;
      };
    };
  };
  labels?: string[];
  colors?: string[];
  legend?: {
    position: 'top' | 'right' | 'bottom' | 'left';
  };
  responsive?: {
    breakpoint: number;
    options: {
      chart?: {
        width?: number | string;
      };
      legend?: {
        position?: 'top' | 'right' | 'bottom' | 'left';
      };
      xaxis?: {
        labels?: {
          formatter?: (value: string) => string;
        };
      };
    };
  }[];
  dataLabels?: {
    enabled: boolean;
  };
  plotOptions?: {
    pie?: {
      donut?: {
        size?: string;
        labels?: {
          show?: boolean;
          total?: {
            show?: boolean;
            label?: string;
            formatter?: () => string;
          };
        };
      };
    };
  };
  stroke?: {
    curve: 'smooth' | 'straight' | 'stepline';
    width: number;
  };
  xaxis?: {
    categories?: string[];
    labels?: {
      formatter?: (value: string) => string;
    };
  };
  yaxis?: {
    labels?: {
      formatter?: (value: number) => string;
    };
  };
  tooltip?: {
    y?: {
      formatter?: (value: number) => string;
    };
  };
};

type ApexSeries = {
  name?: string;
  data: number[];
}[];

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-full">Loading chart...</div>
  }) as any;

interface JournalEntry {
  id: string;
  transactionDate: string;
  referenceNumber: string;
  description: string;
  totalAmount: string;
  currencyId: string;
  status: string;
  journalEntryLines: JournalEntryLine[];
}

interface JournalEntryLine {
  id: string;
  journalEntryId: string;
  chartOfAccountId: string;
  debitAmount: string;
  creditAmount: string;
  description: string;
  vatAmount: string;
  createdAt: string;
  chartOfAccount: {
    id: string;
    accountNo: string;
    accountName: string;
    accountType: string;
    financialStatement: string;
    notes: string | null;
    parentId: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface AccountSummary {
  accountName: string;
  accountNo: string;
  accountType: string;
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const KpiCard = ({ title, value, change, icon }: KpiCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
      <div className={`mt-2 flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
        <span className="text-sm font-medium">
          {Math.abs(change)}% {isPositive ? 'increase' : 'decrease'} from last period
        </span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenues, setRevenues] = useState<AccountSummary[]>([]);
  const [expenses, setExpenses] = useState<AccountSummary[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);
  const [receivables, setReceivables] = useState(0);
  const [payables, setPayables] = useState(0);
  const [monthlyData, setMonthlyData] = useState<{month: string, revenue: number, expense: number, profit: number}[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch('https://nvccz-pi.vercel.app/api/accounting/journal-entries', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch journal entries');

        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Failed to retrieve journal entries');

        processDashboardData(data.data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processDashboardData = (entries: JournalEntry[]) => {
    const accountMap = new Map<string, AccountSummary>();
    const monthlyTotals: Record<string, { revenue: number, expense: number }> = {};
    let cash = 0;
    let receivablesTotal = 0;
    let payablesTotal = 0;

    entries.forEach(entry => {
      if (!entry.transactionDate) return;
      
      const date = new Date(entry.transactionDate);
      if (isNaN(date.getTime())) return;
      
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyTotals[monthYear]) {
        monthlyTotals[monthYear] = { revenue: 0, expense: 0 };
      }

      entry.journalEntryLines.forEach(line => {
        if (!line.chartOfAccount) return;
        
        const accountType = line.chartOfAccount.accountType;
        const financialStatement = line.chartOfAccount.financialStatement;
        const debit = parseFloat(line.debitAmount) || 0;
        const credit = parseFloat(line.creditAmount) || 0;
        const accountId = line.chartOfAccount.id;

        if (line.chartOfAccount.accountName.includes('Cash')) {
          cash += (debit - credit);
        }

        if (line.chartOfAccount.accountName.includes('Receivable')) {
          receivablesTotal += (debit - credit);
        }

        if (line.chartOfAccount.accountName.includes('Payable')) {
          payablesTotal += (credit - debit);
        }

        if (financialStatement === 'Income Statement') {
          const existing = accountMap.get(accountId) || {
            accountName: line.chartOfAccount.accountName,
            accountNo: line.chartOfAccount.accountNo,
            accountType: accountType,
            totalDebit: 0,
            totalCredit: 0,
            balance: 0
          };

          let amount = 0;
          if (accountType.includes('Revenue')) {
            amount = credit - debit;
            monthlyTotals[monthYear].revenue += credit;
          } else if (accountType.includes('Expense')) {
            amount = debit - credit;
            monthlyTotals[monthYear].expense += debit;
          }

          accountMap.set(accountId, {
            ...existing,
            totalDebit: existing.totalDebit + debit,
            totalCredit: existing.totalCredit + credit,
            balance: existing.balance + amount
          });
        }
      });
    });

    const revenues: AccountSummary[] = [];
    const expenses: AccountSummary[] = [];

    accountMap.forEach(account => {
      if (account.accountType.includes('Revenue')) {
        revenues.push(account);
      } else if (account.accountType.includes('Expense')) {
        expenses.push(account);
      }
    });

    const revenueTotal = revenues.reduce((sum, acc) => sum + Math.max(0, acc.balance), 0);
    const expenseTotal = expenses.reduce((sum, acc) => sum + Math.max(0, acc.balance), 0);
    const profit = revenueTotal - expenseTotal;

    const monthlyDataArray = Object.entries(monthlyTotals)
      .map(([month, totals]) => ({
        month: month || 'Unknown',
        revenue: totals.revenue || 0,
        expense: totals.expense || 0,
        profit: (totals.revenue || 0) - (totals.expense || 0)
      }))
      .filter(item => item.month)
      .sort((a, b) => a.month.localeCompare(b.month));

    setRevenues(revenues);
    setExpenses(expenses);
    setTotalRevenue(revenueTotal);
    setTotalExpense(expenseTotal);
    setNetProfit(profit);
    setCashBalance(cash);
    setReceivables(receivablesTotal);
    setPayables(payablesTotal);
    setMonthlyData(monthlyDataArray);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const formatShortCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return formatCurrency(amount);
  };

  const formatMonthLabel = (value: string | undefined) => {
    if (!value) return '';
    
    try {
      const [year, month] = value.split('-');
      if (!year || !month) return value;
      
      const date = new Date(parseInt(year), parseInt(month) - 1);
      if (isNaN(date.getTime())) return value;
      
      return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    } catch {
      return value;
    }
  };

  const revenueByCategoryOptions: ApexOptions = {
    chart: {
      type: 'donut',  // Changed from 'pie' to 'donut'
      animations: {
        enabled: true,
        easing: 'easeinout',
        dynamicAnimation: {
          speed: 800
        }
      }
    },
    labels: revenues.map(rev => rev.accountName),
    colors: ['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'],
    legend: {
      position: 'bottom',
    },
    dataLabels: {
      enabled: true
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Revenue',
              formatter: () => formatCurrency(totalRevenue)
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const revenueByCategorySeries: number[] = revenues.map(rev => Math.abs(rev.balance));

  const expenseByCategoryOptions: ApexOptions = {
    chart: {
      type: 'donut',
      animations: {
        enabled: true,
        easing: 'easeinout',
        dynamicAnimation: {
          speed: 800
        }
      }
    },
    labels: expenses.map(exp => exp.accountName),
    colors: ['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#14B8A6'],
    legend: {
      position: 'bottom',
    },
    dataLabels: {
      enabled: true
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Expenses',
              formatter: () => formatCurrency(totalExpense)
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
  const expenseByCategorySeries: number[] = expenses.map(exp => Math.abs(exp.balance));

  const monthlyTrendsOptions: ApexOptions = {
    chart: {
      type: 'area',
      stacked: false,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      }
    },
    colors: ['#10B981', '#EF4444', '#3B82F6'],
    dataLabels: {
      enabled: true
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: monthlyData.map(data => data.month),
      labels: {
        formatter: (value: string) => formatMonthLabel(value)
      }
    },
    yaxis: {
      labels: {
        formatter: (value: number) => formatShortCurrency(value)
      }
    },
    tooltip: {
      y: {
        formatter: (value: number) => formatCurrency(value)
      }
    },
    responsive: [{
      breakpoint: 640,
      options: {
        chart: {
          width: 300,
        },
        xaxis: {
          labels: {
            formatter: (value: string) => formatMonthLabel(value)
          }
        }
      }
    }]
  };

  const monthlyTrendsSeries: ApexSeries = [
    {
      name: 'Revenue',
      data: monthlyData.map(data => data.revenue)
    },
    {
      name: 'Expenses',
      data: monthlyData.map(data => data.expense)
    },
    {
      name: 'Profit',
      data: monthlyData.map(data => data.profit)
    }
  ];

  if (loading) {
    return (
      <ERP>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ERP>
    );
  }

  if (error) {
    return (
      <ERP>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </ERP>
    );
  }

  return (
    <ERP>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Financial Dashboard</h1>
            <p className="text-gray-600">Overview of your financial performance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard 
            title="Total Revenue" 
            value={formatCurrency(totalRevenue)} 
            change={8.2} 
            icon={<FiTrendingUp className="w-5 h-5" />} 
          />
          <KpiCard 
            title="Total Expenses" 
            value={formatCurrency(totalExpense)} 
            change={-3.5} 
            icon={<FiTrendingDown className="w-5 h-5" />} 
          />
          <KpiCard 
            title="Net Profit" 
            value={formatCurrency(netProfit)} 
            change={netProfit >= 0 ? 12.7 : -5.3} 
            icon={<FiDollarSign className="w-5 h-5" />} 
          />
          <KpiCard 
            title="Cash Balance" 
            value={formatCurrency(cashBalance)} 
            change={4.1} 
            icon={<FiCreditCard className="w-5 h-5" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiActivity className="w-5 h-5 text-blue-600" />
                Monthly Trends
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                  Revenue
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                  Expenses
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                  Profit
                </span>
              </div>
            </div>
            <div className="h-80">
              {monthlyData.length > 0 ? (
                <Chart
                  options={monthlyTrendsOptions}
                  series={monthlyTrendsSeries}
                  type="area"
                  height="100%"
                  width="100%"
                  key={monthlyData.length}
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  No monthly data available
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FiPieChart className="w-5 h-5 text-green-600" />
              Revenue by Category
            </h2>
            <div className="h-80">
              {revenueByCategorySeries.length > 0 ? (
                <Chart
                  options={revenueByCategoryOptions}
                  series={revenueByCategorySeries}
                  type="donut"
                  height="100%"
                  width="100%"
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  No revenue data available
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FiPieChart className="w-5 h-5 text-red-600" />
              Expenses by Category
            </h2>
            <div className="h-80">
              {expenseByCategorySeries.length > 0 ? (
                    <Chart
                    options={expenseByCategoryOptions}
                    series={expenseByCategorySeries}
                    type="donut"  // Changed from "pie" to "donut"
                    height="100%"
                    width="100%"
                  />
              ) : (
                <div className="flex justify-center items-center h-full">
                  No expense data available
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FiBarChart2 className="w-5 h-5 text-purple-600" />
              Quick Stats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-600">Accounts Receivable</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(receivables)}</p>
                <p className="text-xs text-blue-500 mt-1">Total outstanding</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-600">Accounts Payable</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(payables)}</p>
                <p className="text-xs text-purple-500 mt-1">Total outstanding</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-600">Profit Margin</p>
                <p className="text-2xl font-bold mt-1">{totalRevenue > 0 ? `${((netProfit / totalRevenue) * 100).toFixed(1)}%` : '0%'}</p>
                <p className="text-xs text-green-500 mt-1">Net profit / Revenue</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-orange-600">Expense Ratio</p>
                <p className="text-2xl font-bold mt-1">{totalRevenue > 0 ? `${((totalExpense / totalRevenue) * 100).toFixed(1)}%` : '0%'}</p>
                <p className="text-xs text-orange-500 mt-1">Expenses / Revenue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ERP>
  );
};

export default Dashboard;