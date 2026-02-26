import API_BASE_URL from '../config/api';

// Get user email from localStorage
const getUserEmail = () => {
  return localStorage.getItem('user');
};

// Analyze transaction via Hybrid Fraud Detection API
export const analyzeTransaction = async (transactionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fraud-detection/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: transactionData.amount,
        location: transactionData.location,
        device: transactionData.device,
        time: transactionData.time,
        failedLogins: transactionData.failedLogins || 0,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Transaction analysis failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();

    // Return full analysis with ML model breakdowns
    return {
      score: result.finalScore,
      status: result.status,
      riskLevel: result.riskLevel,
      confidence: result.confidence,
      reasons: result.detailedAnalysis ? [result.detailedAnalysis] : [],
      finalScore: result.finalScore,
      detailedAnalysis: result.detailedAnalysis,
      layerAnalysis: result.layerAnalysis,
    };
  } catch (error) {
    throw new Error(error.message || 'Transaction analysis failed');
  }
};

// Get all transactions for user
export const getAllTransactions = async () => {
  try {
    const userEmail = getUserEmail();
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'GET',
      headers: {
        'X-User-Email': userEmail || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    const transactions = await response.json();
    
    // Format transactions to match frontend expectations
    return transactions.map(t => ({
      id: t.id,
      amount: t.amount,
      location: t.location,
      device: t.device,
      time: t.time,
      failedLogins: t.failedLogins,
      score: t.score,
      status: t.status,
      riskLevel: t.riskLevel,
      confidence: t.confidence,
      reasons: t.reasons,
      timestamp: t.createdAt,
      timeDisplay: new Date(t.createdAt).toLocaleTimeString(),
    }));
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch transactions');
  }
};

// Get real-time transactions
export const getRealtimeTransactions = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/realtime?limit=${limit}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch real-time transactions');
    }

    const transactions = await response.json();
    
    return transactions.map(t => ({
      id: t.id,
      amount: t.amount,
      location: t.location,
      device: t.device,
      time: t.time,
      failedLogins: t.failedLogins,
      score: t.score,
      status: t.status,
      riskLevel: t.riskLevel,
      confidence: t.confidence,
      reasons: t.reasons,
      timestamp: t.createdAt,
      timeDisplay: new Date(t.createdAt).toLocaleTimeString(),
    }));
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch real-time transactions');
  }
};

// Get transaction statistics
export const getTransactionStats = async () => {
  try {
    const userEmail = getUserEmail();
    const response = await fetch(`${API_BASE_URL}/transactions/stats`, {
      method: 'GET',
      headers: {
        'X-User-Email': userEmail || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }

    const stats = await response.json();
    
    return {
      total: stats.total,
      fraudRate: parseFloat(stats.fraudRate.toFixed(1)),
      blockedCount: stats.blockedCount,
      avgRiskScore: parseFloat(stats.avgRiskScore.toFixed(1)),
      fakeCount: stats.fakeCount,
      safeCount: stats.safeCount,
      reviewCount: stats.reviewCount,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch statistics');
  }
};

// Create a new transaction
export const createTransaction = async (transactionData) => {
  try {
    const userEmail = getUserEmail();
    const response = await fetch(`${API_BASE_URL}/transactions/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': userEmail || '',
      },
      body: JSON.stringify({
        amount: transactionData.amount,
        location: transactionData.location,
        device: transactionData.device,
        time: transactionData.time,
        failedLogins: transactionData.failedLogins || 0,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create transaction';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();

    // Format the response to match frontend expectations
    return {
      id: result.id,
      amount: result.amount,
      location: result.location,
      device: result.device,
      time: result.time,
      failedLogins: result.failedLogins,
      score: result.score,
      status: result.status,
      riskLevel: result.riskLevel,
      confidence: result.confidence,
      reasons: result.reasons,
      createdAt: result.createdAt,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to create transaction');
  }
};
