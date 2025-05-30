"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  CheckCircle,
  Clock,
  Filter,
  Phone,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface CallRecord {
  id: number;
  date: string;
  time: string;
  status: "successful" | "missed" | "failed";
  attempt: number;
  duration: string;
}

export default function CallHistoryPage() {
  const [dateFilter, setDateFilter] = useState("7");
  const [statusFilter, setStatusFilter] = useState("all");

  const mockCallHistory: CallRecord[] = [
    {
      id: 1,
      date: "2024-01-20",
      time: "05:15 AM",
      status: "successful",
      attempt: 1,
      duration: "00:45",
    },
    {
      id: 2,
      date: "2024-01-19",
      time: "05:14 AM",
      status: "successful",
      attempt: 1,
      duration: "01:12",
    },
    {
      id: 3,
      date: "2024-01-18",
      time: "05:13 AM",
      status: "missed",
      attempt: 3,
      duration: "-",
    },
    {
      id: 4,
      date: "2024-01-17",
      time: "05:12 AM",
      status: "successful",
      attempt: 2,
      duration: "00:38",
    },
    {
      id: 5,
      date: "2024-01-16",
      time: "05:11 AM",
      status: "successful",
      attempt: 1,
      duration: "00:52",
    },
    {
      id: 6,
      date: "2024-01-15",
      time: "05:10 AM",
      status: "failed",
      attempt: 3,
      duration: "-",
    },
    {
      id: 7,
      date: "2024-01-14",
      time: "05:09 AM",
      status: "successful",
      attempt: 1,
      duration: "01:05",
    },
    {
      id: 8,
      date: "2024-01-13",
      time: "05:08 AM",
      status: "successful",
      attempt: 1,
      duration: "00:43",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "successful":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "missed":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      successful:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
      missed:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
      failed:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    };

    return (
      <Badge
        variant="outline"
        className={variants[status as keyof typeof variants] || ""}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleApplyFilters = () => {
    // Filter logic would go here
    console.log("Applying filters:", { dateFilter, statusFilter });
  };

  // Calculate statistics
  const totalCalls = mockCallHistory.length;
  const successfulCalls = mockCallHistory.filter(
    (call) => call.status === "successful",
  ).length;
  const successRate = Math.round((successfulCalls / totalCalls) * 100);
  const avgDuration = "0:51"; // This would be calculated from actual data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-foreground text-3xl font-bold">Call History</h1>
        <p className="text-muted-foreground">
          Track your FajrRing call history and success rate
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <Filter className="text-primary h-4 w-4" />
            </div>
            <span>Filter History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">
                Date Range
              </label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="successful">Successful</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full" onClick={handleApplyFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total Calls
                </p>
                <p className="text-foreground text-2xl font-bold">
                  {totalCalls}
                </p>
              </div>
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <Phone className="text-primary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Successful
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {successfulCalls}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Success Rate
                </p>
                <p className="text-primary text-2xl font-bold">
                  {successRate}%
                </p>
              </div>
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <TrendingUp className="text-primary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Avg Duration
                </p>
                <p className="text-foreground text-2xl font-bold">
                  {avgDuration}
                </p>
              </div>
              <div className="bg-accent/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <Clock className="text-accent-foreground h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <BarChart3 className="text-primary h-4 w-4" />
            </div>
            <CardTitle>Recent Calls</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCallHistory.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="font-medium">
                      {new Date(call.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {call.time}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(call.status)}
                        {getStatusBadge(call.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          call.attempt > 1
                            ? "font-medium text-yellow-600 dark:text-yellow-400"
                            : "text-muted-foreground"
                        }
                      >
                        {call.attempt}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {call.duration}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <p className="text-muted-foreground text-sm">
              Showing {mockCallHistory.length} of {totalCalls} results
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
