import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown, TrendingUp, FileText, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function UpgradePrompt() {
  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="w-5 h-5 text-blue-600" />
          <span>Sblocca Premium</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Abbonamenti illimitati</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Grafici e trend 12 mesi</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Export PDF/CSV</span>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-blue-600">€0,99</div>
          <div className="text-sm text-gray-600">al mese</div>
        </div>
        
        <Link href="/account?upgrade=true">
          <Button className="w-full">
            Passa a Premium
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
