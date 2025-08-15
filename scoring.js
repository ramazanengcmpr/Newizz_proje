// scoring.js
function calculateScore(factors) {
    const weights = {
      roi: 0.12,
      payment_plan: 0.08,
      delivery: 0.08,
      urgency: 0.08,
      prestige: 0.1,
      amenities: 0.08,
      velocity: 0.08,
      launch: 0.08,
      price_per_sqm: 0.1,
      horizon: 0.06,
      location_quality: 0.08,
      demand: 0.06
    };
  
    let totalScore = 0;
    let totalWeight = 0;
  
    for (let key in weights) {
      if (factors[key] !== undefined && !isNaN(factors[key])) {
        const normalized = Math.max(0, Math.min(10, parseFloat(factors[key])));
        totalScore += normalized * weights[key];
        totalWeight += weights[key];
      }
    }
  
    if (totalWeight > 0) {
      return parseFloat((totalScore / totalWeight).toFixed(2));
    }
    return 0;
  }
  
  module.exports = { calculateScore };
  