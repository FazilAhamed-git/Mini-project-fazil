import { useMemo } from "react";

export function useTransactionMetrics(transactions) {
  return useMemo(() => {
    const total = transactions.length;
    const fakeCount = transactions.filter((t) => t.status === "FAKE").length;
    const reviewCount = transactions.filter((t) => t.status === "REVIEW").length;
    const safeCount = transactions.filter((t) => t.status === "SAFE").length;
    
    const blockedCount = fakeCount + reviewCount;
    const fraudRate = total > 0 ? ((fakeCount / total) * 100).toFixed(1) : 0;
    const avgRiskScore =
      total > 0
        ? (transactions.reduce((sum, t) => sum + t.score, 0) / total).toFixed(1)
        : 0;

    const riskDistribution = {
      safe: safeCount,
      review: reviewCount,
      fake: fakeCount,
      total: total,
    };

    // Transaction volume over time (last 10 transactions)
    const volumeData = transactions.slice(-10).map((t, i) => ({
      index: i + 1,
      count: 1,
      score: t.score,
      time: t.timeDisplay || `${i + 1}`,
    }));

    return {
      kpiMetrics: { total, fraudRate, blockedCount, avgRiskScore, fakeCount, safeCount, reviewCount },
      riskDistribution,
      volumeData
    };
  }, [transactions]);
}