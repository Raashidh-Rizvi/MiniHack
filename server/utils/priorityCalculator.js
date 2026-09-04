/**
 * Deterministic Community Priority Score Calculator
 * Formula: (Severity * 0.40) + (PeopleAffected * 0.30) + (Urgency * 0.20) + (ReportAge * 0.10)
 */

function calculatePriority(severity = 'MEDIUM', peopleAffected = 10, urgency = null, createdAt = null) {
  // 1. Severity points (0-100)
  const severityPoints = {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75,
    CRITICAL: 100,
  };
  const sevScore = severityPoints[severity.toUpperCase()] || 50;

  // 2. People Affected points (0-100)
  const count = Number(peopleAffected) || 1;
  let popScore = 20;
  if (count > 300) popScore = 100;
  else if (count >= 151) popScore = 85;
  else if (count >= 51) popScore = 70;
  else if (count >= 11) popScore = 45;
  else popScore = 20;

  // 3. Urgency points (0-100, defaults to severity if not provided)
  const effectiveUrgency = urgency || severity;
  const urgScore = severityPoints[effectiveUrgency.toUpperCase()] || sevScore;

  // 4. Report Age points (0-100, increases as unaddressed reports age)
  let ageScore = 10;
  if (createdAt) {
    const ageInHours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    if (ageInHours > 72) ageScore = 90;
    else if (ageInHours > 48) ageScore = 70;
    else if (ageInHours > 24) ageScore = 50;
    else if (ageInHours > 6) ageScore = 30;
    else ageScore = 15;
  }

  // Calculate weighted score
  const totalScore = Math.round(
    sevScore * 0.40 +
    popScore * 0.30 +
    urgScore * 0.20 +
    ageScore * 0.10
  );

  const clampedScore = Math.min(100, Math.max(0, totalScore));

  // Determine Level: LOW (< 35), MEDIUM (35-64), HIGH (65-84), CRITICAL (>= 85)
  let priorityLevel = 'MEDIUM';
  if (clampedScore >= 85) {
    priorityLevel = 'CRITICAL';
  } else if (clampedScore >= 65) {
    priorityLevel = 'HIGH';
  } else if (clampedScore >= 35) {
    priorityLevel = 'MEDIUM';
  } else {
    priorityLevel = 'LOW';
  }

  return {
    priorityScore: clampedScore,
    priorityLevel,
  };
}

module.exports = { calculatePriority };
