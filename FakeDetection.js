export function detectFake(transaction) {
  let score = 0;
  const reasons = [];

  const amount =
    typeof transaction.amount === "string"
      ? parseFloat(transaction.amount) || 0
      : transaction.amount || 0;

  if (amount > 100000) {
    score += 40;
    reasons.push("Very high transaction amount");
  } else if (amount > 50000) {
    score += 30;
    reasons.push("High transaction amount");
  } else if (amount > 20000) {
    score += 15;
    reasons.push("Moderately high transaction amount");
  }

  if (transaction.location !== "India") {
    score += 25;
    reasons.push("Foreign transaction location");
  }

  if (transaction.device === "Unknown") {
    score += 20;
    reasons.push("Unknown or untrusted device");
  }

  if (transaction.time === "Late Night") {
    score += 15;
    reasons.push("Unusual transaction time (late night)");
  }

  const failedLogins =
    typeof transaction.failedLogins === "string"
      ? parseInt(transaction.failedLogins, 10) || 0
      : transaction.failedLogins || 0;

  if (failedLogins >= 5) {
    score += 25;
    reasons.push("Multiple failed login attempts (5 or more)");
  } else if (failedLogins > 3) {
    score += 15;
    reasons.push("Several failed login attempts");
  }

  let status = "SAFE";
  let riskLevel = "Low";

  if (score >= 75) {
    status = "FAKE";
    riskLevel = "High";
  } else if (score >= 45) {
    status = "REVIEW";
    riskLevel = "Medium";
  }

  const maxScore = 40 + 25 + 20 + 15 + 25;
  const confidence = Math.min(100, Math.round((score / maxScore) * 100));

  return { score, status, riskLevel, confidence, reasons };
}
