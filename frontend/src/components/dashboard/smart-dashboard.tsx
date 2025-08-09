'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Brain, 
  Cpu, 
  Database, 
  MessageSquare, 
  Users, 
  Zap, 
  TrendingUp, 
  Clock, 
  Target,
  Settings,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Atom,
  Sparkles,
  Shield,
  Globe
} from 'lucide-react'

interface DashboardMetrics {
  totalQueries: number
  successRate: number
  avgResponseTime: number
  activeUsers: number
  ragAccuracy: number
  vectorDbSize: number
  llmUsage: number
  systemHealth: number
}

interface ChartData {
  time: string
  queries: number
  responseTime: number
  accuracy: number
}

export function SmartDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalQueries: 12847,
    successRate: 98.3,
    avgResponseTime: 1.2,
    activeUsers: 342,
    ragAccuracy: 94.7,
    vectorDbSize: 25600,
    llmUsage: 67.8,
    systemHealth: 99.1
  })

  const [isRealTime, setIsRealTime] = useState(true)
  const [chartData, setChartData] = useState<ChartData[]>([])

  // Simulate real-time data updates
  useEffect(() => {
    if (!isRealTime) return

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalQueries: prev.totalQueries + Math.floor(Math.random() * 5),
        activeUsers: Math.max(200, prev.activeUsers + Math.floor(Math.random() * 20) - 10),
        avgResponseTime: Math.max(0.5, prev.avgResponseTime + (Math.random() - 0.5) * 0.2),
        successRate: Math.min(100, Math.max(95, prev.successRate + (Math.random() - 0.5) * 2)),
        ragAccuracy: Math.min(100, Math.max(90, prev.ragAccuracy + (Math.random() - 0.5) * 1)),
        llmUsage: Math.min(100, Math.max(30, prev.llmUsage + (Math.random() - 0.5) * 5))
      }))

      // Update chart data
      const now = new Date().toLocaleTimeString()
      setChartData(prev => {
        const newData = [...prev, {
          time: now,
          queries: Math.floor(Math.random() * 50) + 20,
          responseTime: Math.random() * 2 + 0.5,
          accuracy: Math.random() * 10 + 90
        }].slice(-20) // Keep last 20 points
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isRealTime])

  const getHealthColor = (value: number) => {
    if (value >= 95) return 'text-green-500'
    if (value >= 85) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getUsageColor = (value: number) => {
    if (value <= 70) return 'text-green-500'
    if (value <= 85) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Atom className="w-8 h-8 text-blue-500 animate-pulse" />
            Amrikyy AI Quantum Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time analytics and performance monitoring for your AI system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={isRealTime ? "default" : "outline"}
            size="sm"
            onClick={() => setIsRealTime(!isRealTime)}
            className="flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            {isRealTime ? 'Live' : 'Paused'}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalQueries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
              +12.5% from last hour
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(metrics.successRate)}`}>
              {metrics.successRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              <Shield className="inline w-3 h-3 mr-1 text-green-500" />
              Excellent performance
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgResponseTime.toFixed(1)}s</div>
            <p className="text-xs text-muted-foreground">
              <Zap className="inline w-3 h-3 mr-1 text-yellow-500" />
              Average response time
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-full" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              <Globe className="inline w-3 h-3 mr-1 text-blue-500" />
              Currently online
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />
        </Card>
      </div>

      {/* Advanced Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RAG Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              RAG Performance
            </CardTitle>
            <CardDescription>Retrieval-Augmented Generation metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Accuracy</span>
                <span className={getHealthColor(metrics.ragAccuracy)}>{metrics.ragAccuracy.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.ragAccuracy}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Vector DB Size</span>
                <span>{(metrics.vectorDbSize / 1000).toFixed(1)}K docs</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: '78%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-green-500" />
              System Health
            </CardTitle>
            <CardDescription>Infrastructure and performance status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Health</span>
                <span className={getHealthColor(metrics.systemHealth)}>{metrics.systemHealth.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.systemHealth}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>LLM Usage</span>
                <span className={getUsageColor(metrics.llmUsage)}>{metrics.llmUsage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    metrics.llmUsage <= 70 ? 'bg-green-500' : 
                    metrics.llmUsage <= 85 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${metrics.llmUsage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Quantum Tools
            </CardTitle>
            <CardDescription>AI-powered dashboard actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Analytics Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <PieChart className="w-4 h-4 mr-2" />
              User Behavior Analysis
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <LineChart className="w-4 h-4 mr-2" />
              Performance Trends
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Optimize Vector DB
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Real-time Activity Monitor
          </CardTitle>
          <CardDescription>Live query and performance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  Queries
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  Response Time
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                  Accuracy
                </div>
              </div>
              <p className="text-muted-foreground">
                {isRealTime ? 'Monitoring live data streams...' : 'Click Live to start monitoring'}
              </p>
              {chartData.length > 0 && (
                <div className="grid grid-cols-3 gap-8 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {chartData[chartData.length - 1]?.queries || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Current Queries/min</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {chartData[chartData.length - 1]?.responseTime.toFixed(1) || '0.0'}s
                    </div>
                    <div className="text-xs text-muted-foreground">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">
                      {chartData[chartData.length - 1]?.accuracy.toFixed(1) || '0.0'}%
                    </div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <span>•</span>
          <span>System uptime: 99.9%</span>
          <span>•</span>
          <span>Data refreshes every 2 seconds</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>All systems operational</span>
        </div>
      </div>
    </div>
  )
}
