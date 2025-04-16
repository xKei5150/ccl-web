"use server";

import { payload } from "@/lib/payload";

// Fetch and process demographic data for dashboard
export async function calculateDemographicsReportData(params = {}) {
  const { year = "" } = params;
  // Fetch all records, or filter by year if provided
  const where = year ? { year: { equals: Number(year) } } : {};
  const { docs } = await payload.find({
    collection: "demographics",
    where,
    limit: 100,
    sort: "-year"
  });
  // Overview: use the latest record (or the one for the selected year)
  const record = docs && docs.length > 0 ? docs[0] : null;
  // Age groups and chronic diseases for the selected year
  const ageGroups = record?.ageGroups || [];
  const chronicDiseases = record?.chronicDiseases || [];
  // Yearly trends: get all years, sorted
  const yearlyTrends = (docs || [])
    .map(d => ({
      year: d.year,
      total: d.totalPopulation || (d.maleCount || 0) + (d.femaleCount || 0),
      voters: d.voterCount || 0
    }))
    .sort((a, b) => a.year - b.year);
  // Overview
  const population = record
    ? {
        total: record.totalPopulation || (record.maleCount || 0) + (record.femaleCount || 0),
        male: record.maleCount || 0,
        female: record.femaleCount || 0,
        households: record.householdsCount || 0,
        voters: record.voterCount || 0,
        pwd: record.pwdCount || 0
      }
    : null;
  return {
    population,
    ageGroups,
    chronicDiseases,
    yearlyTrends
  };
}

// Placeholder for export
export async function exportDemographicsReportData(params = {}) {
  // TODO: implement export logic
  return { success: true, message: "Export successful (not implemented)" };
}

// AI: Analyze population trends
export async function analyzePopulationTrends(params = {}) {
  // Fetch all years
  const { docs } = await payload.find({
    collection: "demographics",
    limit: 10,
    sort: "-year"
  });
  const sorted = (docs || []).sort((a, b) => a.year - b.year);
  const years = sorted.map(d => d.year);
  const totals = sorted.map(d => d.totalPopulation || (d.maleCount || 0) + (d.femaleCount || 0));
  // Simple trend: compare last two years
  let trend = "stable";
  let percentageChange = "0%";
  if (totals.length >= 2) {
    const diff = totals[totals.length - 1] - totals[totals.length - 2];
    const pct = totals[totals.length - 2] ? (diff / totals[totals.length - 2]) * 100 : 0;
    trend = diff > 0 ? "upward" : diff < 0 ? "downward" : "stable";
    percentageChange = (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
  }
  // Insights
  const analysis = `Population changed from ${totals[0] || 0} in ${years[0] || "-"} to ${totals[totals.length - 1] || 0} in ${years[years.length - 1] || "-"}.`;
  const insights = [
    `Highest population: ${Math.max(...totals)} in ${years[totals.indexOf(Math.max(...totals))]}`,
    `Lowest population: ${Math.min(...totals)} in ${years[totals.indexOf(Math.min(...totals))]}`
  ];
  const recommendations = [
    "Monitor population growth for resource planning.",
    "Update demographic records annually.",
    "Prepare for changes in service demand."
  ];
  return { trend, percentageChange, analysis, insights, recommendations };
}

// AI: Analyze age structure
export async function analyzeAgeStructure(params = {}) {
  const { year = "" } = params;
  const where = year ? { year: { equals: Number(year) } } : {};
  const { docs } = await payload.find({
    collection: "demographics",
    where,
    limit: 1
  });
  const record = docs && docs.length > 0 ? docs[0] : null;
  const ageGroups = record?.ageGroups || [];
  // Simple analysis
  const total = ageGroups.reduce((sum, g) => sum + (g.count || 0), 0);
  const largest = ageGroups.reduce((max, g) => (g.count > (max.count || 0) ? g : max), {});
  const analysis = total
    ? `Largest age group: ${largest.ageRange || "-"} (${largest.count || 0} people).`
    : "No age group data available.";
  const insights = ageGroups.map(g => `${g.ageRange}: ${g.count}`);
  const recommendations = [
    "Adjust community programs based on age distribution.",
    "Plan for youth and senior services as needed.",
    "Track age group changes yearly."
  ];
  return { analysis, insights, recommendations };
}

// AI: Analyze health profile
export async function analyzeHealthProfile(params = {}) {
  const { year = "" } = params;
  const where = year ? { year: { equals: Number(year) } } : {};
  const { docs } = await payload.find({
    collection: "demographics",
    where,
    limit: 1
  });
  const record = docs && docs.length > 0 ? docs[0] : null;
  const chronicDiseases = record?.chronicDiseases || [];
  // Simple analysis
  const total = chronicDiseases.reduce((sum, d) => sum + (d.count || 0), 0);
  const mostCommon = chronicDiseases.reduce((max, d) => (d.count > (max.count || 0) ? d : max), {});
  const analysis = total
    ? `Most common chronic disease: ${mostCommon.diseaseName || "-"} (${mostCommon.count || 0} cases).`
    : "No chronic disease data available.";
  const insights = chronicDiseases.map(d => `${d.diseaseName}: ${d.count}`);
  const recommendations = [
    "Increase health awareness for most common diseases.",
    "Promote regular health checkups.",
    "Track chronic disease trends annually."
  ];
  return { analysis, insights, recommendations };
} 