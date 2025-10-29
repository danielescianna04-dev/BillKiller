'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface Subscription {
  merchant_canonical: string
  title: string
  monthly_amount: number
  periodicity: string
}

export default function SubscriptionCharts({ subscriptions }: { subscriptions: Subscription[] }) {
  // Group by merchant for pie chart
  const categoryData = subscriptions.reduce((acc, sub) => {
    const existing = acc.find(item => item.name === sub.title)
    if (existing) {
      existing.value += sub.monthly_amount
    } else {
      acc.push({ name: sub.title, value: sub.monthly_amount })
    }
    return acc
  }, [] as { name: string; value: number }[]).sort((a, b) => b.value - a.value)

  // Top subscriptions - 3 for mobile, 5 for desktop
  const topSubscriptions = [...subscriptions]
    .sort((a, b) => b.monthly_amount - a.monthly_amount)
    .slice(0, 5)
  
  const top3Subscriptions = topSubscriptions.slice(0, 3).map(sub => ({
    name: sub.title.length > 10 ? `${sub.title.substring(0, 10)}...` : sub.title,
    amount: sub.monthly_amount
  }))
  
  const top5Subscriptions = topSubscriptions.map(sub => ({
    name: sub.title.length > 15 ? `${sub.title.substring(0, 15)}...` : sub.title,
    amount: sub.monthly_amount
  }))

  const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8', '#00b894', '#fdcb6e']

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-lg border border-gray-200/50">
          <p className="font-bold text-sm sm:text-lg text-gray-900">{label || payload[0].name}</p>
          <p className="text-amber-700 font-semibold text-xs sm:text-base">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 sm:gap-4 md:gap-8">
      {/* Pie Chart - Spesa per Categoria */}
      <Card className="md:col-span-2 border-none shadow-2xl shadow-amber-900/5 bg-gradient-to-br from-amber-50 via-white to-white">
        <CardHeader className="p-2 sm:p-4 md:p-6">
          <CardTitle className="text-[10px] sm:text-base md:text-xl font-bold text-amber-900">Spesa Categoria</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 md:p-6">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <defs>
                {categoryData.map((entry, index) => (
                  <radialGradient key={`gradient-${index}`} id={`gradient-${index}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.7}/>
                    <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1}/>
                  </radialGradient>
                ))}
              </defs>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => percent > 0.1 ? `${(percent * 100).toFixed(0)}%` : ''}
                outerRadius={60}
                innerRadius={30}
                fill="#8884d8"
                dataKey="value"
                strokeWidth={2}
                stroke="#fff"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255, 255, 255, 0.5)'}} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 sm:mt-4 md:mt-6 space-y-1 sm:space-y-2 md:space-y-3 px-1 sm:px-2">
            {categoryData.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-[9px] sm:text-xs md:text-base">
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
                  <div 
                    className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full shadow-inner flex-shrink-0" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-800 font-medium truncate">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900 ml-1 flex-shrink-0 text-[9px] sm:text-xs md:text-base">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart - Top 5 Most Expensive */}
      <Card className="hidden md:block md:col-span-3 border-none shadow-2xl shadow-amber-900/5 bg-gradient-to-br from-amber-50 via-white to-white">
        <CardHeader className="p-2 sm:p-4 md:p-6">
          <CardTitle className="text-[10px] sm:text-base md:text-xl font-bold text-amber-900">🏆 Top 5 Più Costosi</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 md:p-6">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={top5Subscriptions} margin={{ top: 20, right: 40, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffc900" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#ff8c00" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 7" stroke="#f3f4f6" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#a16207' }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis 
                  tick={{ fontSize: 14, fill: '#a16207' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `€${value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 140, 0, 0.1)' }} />
                <Bar 
                  dataKey="amount" 
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
