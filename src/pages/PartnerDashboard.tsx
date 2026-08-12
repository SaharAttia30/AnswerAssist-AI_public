
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Phone, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Download, 
  Copy,
  LogOut,
  ExternalLink,
  Calendar,
  CreditCard
} from 'lucide-react';

// Mock data for partner
const mockPartner = {
  name: "Sarah Johnson",
  email: "sarah@example.com",
  tier: "VIP",
  totalSignups: 47,
  activeSubscriptions: 32,
  totalCommissions: 2840,
  pendingPayout: 485,
  referralLink: "https://answerassist.ai/ref/sarah123",
  joinDate: "2024-01-15"
};

const mockReferrals = [
  {
    id: "ref_001",
    customerName: "Mike's Plumbing",
    signupDate: "2024-01-10",
    status: "Active",
    plan: "Business",
    commission: 25,
    recurringCommission: 19.90,
    totalEarned: 89.50
  },
  {
    id: "ref_002", 
    customerName: "Quick Lock Services",
    signupDate: "2024-01-08",
    status: "Active",
    plan: "Solo",
    commission: 25,
    recurringCommission: 9.90,
    totalEarned: 54.60
  },
  {
    id: "ref_003",
    customerName: "ABC Electrical",
    signupDate: "2024-01-05",
    status: "Trial",
    plan: "Trial",
    commission: 0,
    recurringCommission: 0,
    totalEarned: 0
  }
];

const mockAssets = [
  { name: "Instagram Banner (1080x1080)", url: "#", type: "image" },
  { name: "Facebook Banner (1200x630)", url: "#", type: "image" },
  { name: "TikTok Video Script", url: "#", type: "document" },
  { name: "Email Template", url: "#", type: "document" },
  { name: "Telegram Assets Pack", url: "#", type: "zip" },
  { name: "Brand Guidelines PDF", url: "#", type: "document" }
];

const PartnerDashboard = () => {
  const [copied, setCopied] = useState(false);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(mockPartner.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Partner Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, {mockPartner.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                {mockPartner.tier} Partner
              </Badge>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockPartner.totalSignups}</div>
                  <p className="text-xs text-muted-foreground">+3 this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockPartner.activeSubscriptions}</div>
                  <p className="text-xs text-muted-foreground">68% conversion rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${mockPartner.totalCommissions}</div>
                  <p className="text-xs text-muted-foreground">All time earnings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${mockPartner.pendingPayout}</div>
                  <p className="text-xs text-muted-foreground">Next payout: 15th</p>
                </CardContent>
              </Card>
            </div>

            {/* Referral Link */}
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
                <CardDescription>
                  Share this link to earn $25 per signup + 10% recurring commissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={mockPartner.referralLink} 
                    readOnly 
                    className="flex-1"
                  />
                  <Button onClick={copyReferralLink} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReferrals.slice(0, 3).map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{referral.customerName}</p>
                        <p className="text-sm text-gray-600">Signed up {referral.signupDate}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={referral.status === "Active" ? "default" : "secondary"}>
                          {referral.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          Earned: ${referral.totalEarned}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Referrals</CardTitle>
                <CardDescription>
                  Track all customers you've referred and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReferrals.map((referral) => (
                    <div key={referral.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{referral.customerName}</h4>
                          <p className="text-sm text-gray-600">
                            Signup: {referral.signupDate} • Plan: {referral.plan}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant={referral.status === "Active" ? "default" : "secondary"}>
                              {referral.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">${referral.totalEarned}</p>
                          <p className="text-sm text-gray-600">Total Earned</p>
                          {referral.recurringCommission > 0 && (
                            <p className="text-xs text-green-600">
                              +${referral.recurringCommission}/month
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commissions Tab */}
          <TabsContent value="commissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Commission Breakdown</CardTitle>
                <CardDescription>
                  Detailed view of your earnings and payouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-800">This Month</h4>
                      <p className="text-2xl font-bold text-green-900">$485</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800">Last Month</h4>
                      <p className="text-2xl font-bold text-blue-900">$387</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-medium text-purple-800">All Time</h4>
                      <p className="text-2xl font-bold text-purple-900">$2,840</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Recent Transactions</h4>
                    {[
                      { date: "2024-01-15", description: "Monthly recurring commissions", amount: 89.50, status: "Paid" },
                      { date: "2024-01-10", description: "New signup bonus - Mike's Plumbing", amount: 25.00, status: "Paid" },
                      { date: "2024-01-08", description: "New signup bonus - Quick Lock", amount: 25.00, status: "Pending" }
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{transaction.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${transaction.amount}</p>
                          <Badge variant={transaction.status === "Paid" ? "default" : "secondary"}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Referral Tools</CardTitle>
                <CardDescription>
                  Tools to help you promote AnswerAssist AI effectively
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Referral Link</h4>
                  <div className="flex items-center space-x-2">
                    <Input value={mockPartner.referralLink} readOnly />
                    <Button onClick={copyReferralLink} variant="outline">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">QR Code</h4>
                  <div className="w-32 h-32 bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">QR Code</span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Download className="h-4 w-4 mr-2" />
                    Download QR
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Shortened URL</h4>
                  <Input value="https://answr.ai/sarah" readOnly />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Assets</CardTitle>
                <CardDescription>
                  Download banners, scripts, and promotional materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockAssets.map((asset, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{asset.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{asset.type}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PartnerDashboard;
