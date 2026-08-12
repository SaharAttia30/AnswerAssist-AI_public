
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  DollarSign, 
  Phone, 
  Activity, 
  Search,
  Settings,
  Ban,
  RefreshCw,
  Download,
  Eye,
  LogOut,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

// Mock data for admin
const mockStats = {
  totalUsers: 1247,
  activeSubscriptions: 892,
  totalRevenue: 184750,
  monthlyRecurring: 45620,
  trialUsers: 156,
  totalCalls: 23847,
  apiCosts: 5230,
  profitMargin: 78.2
};

const mockUsers = [
  {
    id: "user_001",
    name: "John Smith",
    email: "john@smithplumbing.com",
    role: "user",
    status: "Active",
    plan: "Business",
    minutesLeft: 1250,
    phoneNumber: "+1-555-0123",
    signupDate: "2024-01-10",
    lastActive: "2024-01-15"
  },
  {
    id: "user_002",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "partner",
    status: "Active",
    plan: "VIP Partner",
    referrals: 47,
    commissions: 2840,
    signupDate: "2024-01-08",
    lastActive: "2024-01-15"
  },
  {
    id: "user_003",
    name: "Mike Johnson",
    email: "mike@quicklock.com",
    role: "user",
    status: "Trial",
    plan: "Trial",
    minutesLeft: 8,
    trialDays: 1,
    signupDate: "2024-01-14",
    lastActive: "2024-01-15"
  }
];

const mockCalls = [
  {
    id: "call_001",
    userId: "user_001",
    userEmail: "john@smithplumbing.com",
    date: "2024-01-15",
    time: "14:30",
    duration: "2:45",
    cost: 0.021,
    flagged: false,
    outcome: "Appointment booked"
  },
  {
    id: "call_002",
    userId: "user_003", 
    userEmail: "mike@quicklock.com",
    date: "2024-01-15",
    time: "11:20",
    duration: "1:30",
    cost: 0.011,
    flagged: true,
    outcome: "Issue reported"
  }
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-red-600 to-orange-600 p-2 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Platform Management Console</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="destructive">
                Admin Access
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+47 this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${mockStats.monthlyRecurring.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalCalls.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+2,340 this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.profitMargin}%</div>
                  <p className="text-xs text-muted-foreground">API costs: ${mockStats.apiCosts}</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New user signup</span>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Subscription upgraded</span>
                      <span className="text-xs text-gray-500">15 min ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-600">Call flagged</span>
                      <span className="text-xs text-gray-500">1 hour ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Twilio API</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ElevenLabs API</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Stripe Webhooks</span>
                      <Badge variant="secondary">Delayed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all platform users</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Button variant="outline">Export</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium">{user.name}</h4>
                            <Badge variant={user.role === "admin" ? "destructive" : user.role === "partner" ? "secondary" : "default"}>
                              {user.role}
                            </Badge>
                            <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                              {user.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Plan: {user.plan}</span>
                            {user.minutesLeft && <span>Minutes: {user.minutesLeft}</span>}
                            {user.referrals && <span>Referrals: {user.referrals}</span>}
                            <span>Joined: {user.signupDate}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Ban className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calls Tab */}
          <TabsContent value="calls" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Global Call Logs</CardTitle>
                    <CardDescription>Monitor all platform calls</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Filter</Button>
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCalls.map((call) => (
                    <div key={call.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{call.userEmail}</span>
                            {call.flagged && (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Flagged
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{call.date} at {call.time}</span>
                            <span>Duration: {call.duration}</span>
                            <span>Cost: ${call.cost}</span>
                            <span>Outcome: {call.outcome}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">Play</Button>
                          <Button variant="outline" size="sm">Download</Button>
                          <Button variant="outline" size="sm">Flag</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Management</CardTitle>
                <CardDescription>Monitor partner performance and payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Partner management interface will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finances Tab */}
          <TabsContent value="finances" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subscription Revenue</span>
                      <span className="font-semibold">${mockStats.monthlyRecurring.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Minute Bundle Sales</span>
                      <span className="font-semibold">$12,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Monthly Revenue</span>
                      <span className="font-semibold">${(mockStats.monthlyRecurring + 12450).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Twilio Costs</span>
                      <span className="font-semibold">$3,420</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ElevenLabs Costs</span>
                      <span className="font-semibold">$1,580</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Infrastructure</span>
                      <span className="font-semibold">$230</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total Costs</span>
                      <span>${mockStats.apiCosts.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Controls</CardTitle>
                <CardDescription>Manual overrides and system management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">User Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Add/Remove Minutes
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Extend Trial Period
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Reset User Password
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">System Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry Failed Webhooks
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Export System Logs
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Inject Test Call
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
