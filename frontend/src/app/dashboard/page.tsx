"use client"

import { useEffect, useState } from "react"
import apiClient from "@/lib/api-client"
import { AnalyticsStats } from "@/components/dashboard/analytics/analytics-stats"
import { RevenueChart } from "@/components/dashboard/analytics/revenue-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardAnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [revenueData, setRevenueData] = useState<any[]>([]);

    useEffect(() => {
        // Fetch Stats
        apiClient.get('/analytics/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error(err));

        // Fetch Revenue
        apiClient.get('/analytics/revenue?days=7')
            .then(res => setRevenueData(res.data))
            .catch(err => console.error(err));
    }, []);

    if (!stats) return <div className="p-8">Loading Analytics...</div>;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
                    <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <AnalyticsStats 
                        totalRevenue={stats.totalRevenue} 
                        totalBookings={stats.totalBookings}
                        dailyBookings={stats.dailyBookings}
                    />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                                <CardDescription>
                                    Your revenue for the last 7 days.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <RevenueChart data={revenueData} />
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Sales</CardTitle>
                                <CardDescription>
                                    You made 265 sales this month.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {/* Placeholder Recent Sales List */}
                                    <div className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">Olivia Martin</p>
                                            <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                                        </div>
                                        <div className="ml-auto font-medium">+$1,999.00</div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">Jackson Lee</p>
                                            <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                                        </div>
                                        <div className="ml-auto font-medium">+$39.00</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
