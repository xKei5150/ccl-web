"use server";

import { revalidatePath } from "next/cache";
import { payload } from "@/lib/payload";

// Helper: map request type value to label
const TYPE_LABELS = {
  indigencyCertificate: "Indigency Certificate",
  barangayClearance: "Barangay Clearance",
  barangayResidency: "Barangay Residency"
};

const STATUS_LABELS = {
  pending: "Pending",
  processing: "Processing",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed"
};

// Analyzes service request patterns
export async function analyzeServicePatterns(params = {}) {
  try {
    // Fetch all requests
    const { docs } = await payload.find({
      collection: "requests",
      limit: 1000,
      sort: "-createdAt"
    });
    if (!docs) return { error: "No data" };

    // Count by type
    const typeCounts = {};
    docs.forEach(r => {
      typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
    });
    const mostRequested = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
    const trend = mostRequested.length > 0 && mostRequested[0][1] > 0 ? "upward" : "stable";
    // Example: percent change (last 30d vs previous 30d)
    const now = new Date();
    const last30 = docs.filter(r => new Date(r.createdAt) > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
    const prev30 = docs.filter(r => new Date(r.createdAt) > new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000) && new Date(r.createdAt) <= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
    const pctChange = prev30.length ? Math.round(((last30.length - prev30.length) / prev30.length) * 100) : 0;

    return {
      trend,
      percentageChange: (pctChange >= 0 ? "+" : "") + pctChange + "%",
      analysis: `There were ${last30.length} requests in the last 30 days (${pctChange >= 0 ? "increase" : "decrease"} of ${Math.abs(pctChange)}% compared to previous 30 days). Most requested: ${mostRequested.length ? TYPE_LABELS[mostRequested[0][0]] : "N/A"}.`,
      impactAssessment: `The most requested service is ${mostRequested.length ? TYPE_LABELS[mostRequested[0][0]] : "N/A"}.`,
      insights: mostRequested.map(([type, count]) => `${TYPE_LABELS[type] || type}: ${count} requests`),
      recommendations: [
        "Allocate staff to most requested service types.",
        "Monitor request volume trends for resource planning.",
        "Automate common requests to reduce processing time."
      ]
    };
  } catch (error) {
    console.error("Failed to analyze service patterns:", error);
    return { error: "Failed to analyze service patterns" };
  }
}

// Forecasts service demand (simple: next month = avg of last 3 months)
export async function forecastServiceDemand(params = {}) {
  try {
    const { docs } = await payload.find({
      collection: "requests",
      limit: 1000,
      sort: "-createdAt"
    });
    if (!docs) return { error: "No data" };
    const now = new Date();
    // Group by month
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return d;
    }).reverse();
    const monthCounts = months.map((d, i) => {
      const next = i < months.length - 1 ? months[i + 1] : new Date();
      return docs.filter(r => new Date(r.createdAt) >= d && new Date(r.createdAt) < next).length;
    });
    // Forecast: next = avg of last 3
    const forecast = Math.round(monthCounts.slice(-3).reduce((a, b) => a + b, 0) / 3);
    // By type
    const typeCounts = {};
    docs.forEach(r => {
      typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
    });
    return {
      predictions: [...monthCounts, forecast],
      serviceTypeProjections: Object.fromEntries(Object.entries(typeCounts).map(([type, count]) => [type, count]))
    };
  } catch (error) {
    console.error("Failed to forecast service demand:", error);
    return { error: "Failed to forecast service demand" };
  }
}

// Analyzes service efficiency (status: pending/processing/approved/etc)
export async function analyzeServiceEfficiency(params = {}) {
  try {
    const { docs } = await payload.find({
      collection: "requests",
      limit: 1000,
      sort: "-createdAt"
    });
    if (!docs) return { error: "No data" };
    // Efficiency: percent completed vs total
    const completed = docs.filter(r => r.status === "completed").length;
    const total = docs.length;
    const efficiencyRate = total ? Math.round((completed / total) * 100) : 0;
    // Bottlenecks: most common non-completed status
    const statusCounts = {};
    docs.forEach(r => {
      if (r.status !== "completed") statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
    });
    const bottlenecks = Object.entries(statusCounts).sort((a, b) => b[1] - a[1]).map(([status, count]) => `${STATUS_LABELS[status] || status}: ${count}`);
    return {
      performanceRating: efficiencyRate >= 80 ? "meeting_targets" : efficiencyRate >= 60 ? "needs_improvement" : "below_target",
      efficiencyRate: efficiencyRate + "%",
      analysis: `Out of ${total} requests, ${completed} are completed.`,
      bottlenecks,
      recommendations: [
        "Review bottleneck statuses for process improvement.",
        "Automate status updates where possible.",
        "Provide training for staff on common delays."
      ]
    };
  } catch (error) {
    console.error("Failed to analyze service efficiency:", error);
    return { error: "Failed to analyze service efficiency" };
  }
}

// Calculate service report data
export async function calculateServiceReportData(params = {}) {
  try {
    const { reportType = "requests", year = "all", serviceType = "all_types" } = params;
    const filter = {};
    if (year && year !== "all") {
      filter.createdAt = {
        greater_than_equal: `${year}-01-01T00:00:00.000Z`,
        less_than_equal: `${year}-12-31T23:59:59.999Z`
      };
    }
    if (serviceType && serviceType !== "all_types") {
      filter.type = { equals: serviceType };
    }
    const { docs } = await payload.find({
      collection: "requests",
      where: filter,
      limit: 1000,
      sort: "-createdAt"
    });
    if (!docs) return { error: "No data" };
    let reportData = {};
    if (reportType === "requests") {
      // By type
      const byServiceType = {};
      docs.forEach(r => {
        byServiceType[r.type] = (byServiceType[r.type] || 0) + 1;
      });
      reportData.byServiceType = Object.entries(byServiceType).map(([type, value]) => ({ name: TYPE_LABELS[type] || type, value }));
      // Top requested
      reportData.topRequestedServices = reportData.byServiceType.slice().sort((a, b) => b.value - a.value);
    } else if (reportType === "processing") {
      // For demo: expected = 2, actual = random 1-4
      const byType = {};
      docs.forEach(r => {
        byType[r.type] = byType[r.type] || { expected: 2, actual: 0, count: 0 };
        byType[r.type].actual += Math.floor(Math.random() * 4) + 1;
        byType[r.type].count++;
      });
      reportData.processingTimeComparison = Object.entries(byType).map(([type, obj]) => ({
        name: TYPE_LABELS[type] || type,
        expected: obj.expected,
        actual: Math.round(obj.actual / obj.count)
      }));
    } else if (reportType === "trends") {
      // Group by month
      const months = Array.from({ length: 12 }, (_, i) => new Date(new Date().getFullYear(), i, 1));
      const serviceTrends = months.map((d, i) => {
        const next = i < months.length - 1 ? months[i + 1] : new Date(new Date().getFullYear() + 1, 0, 1);
        return {
          month: d.toLocaleString('default', { month: 'short' }),
          count: docs.filter(r => new Date(r.createdAt) >= d && new Date(r.createdAt) < next).length
        };
      });
      reportData.serviceTrends = serviceTrends;
    } else if (reportType === "status") {
      // By status
      const statusCounts = {};
      docs.forEach(r => {
        statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
      });
      reportData.statusDistribution = Object.entries(statusCounts)
        .filter(([status, count]) => count > 0)
        .map(([status, count]) => ({ name: STATUS_LABELS[status] || status, count }));
    }
    return reportData;
  } catch (error) {
    console.error("Failed to calculate service report data:", error);
    return { error: "Failed to calculate service report data" };
  }
}

// Export report data
export async function exportServiceReportData(params = {}) {
  try {
    const { reportType = "requests", data = {}, format = "csv" } = params;
    // This would normally generate and download a file
    // For now, just simulate a successful export
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    return { success: true, message: "Export successful" };
  } catch (error) {
    console.error("Failed to export service report data:", error);
    return { error: "Failed to export service report data" };
  }
} 