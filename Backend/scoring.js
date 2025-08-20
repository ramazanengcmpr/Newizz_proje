// scoring.js
function calculateScore(factors) {
    // Basit score hesaplama (eski versiyon)
    let score = 0;
    for (let factor in factors) {
        score += factors[factor] || 0;
    }
    return Math.round(score / Object.keys(factors).length);
}

function calculate_score_10(factors) {
    const weights = {
        "roi": 0.35,
        "payment_plan": 0.10,
        "delivery": 0.05,
        "urgency": 0.10,
        "prestige": 0.05,
        "amenities": 0.02,
        "velocity": 0.05,
        "launch": 0.03,
        "price_per_sqm": 0.05,
        "horizon": 0.03,
        "type_fit": 0.02,
        "legal": 0.05
    };

    let score = 0.0;
    for (let factor in weights) {
        const value = factors[factor] || 0;
        const normalized = value / 10; // 0–1 aralığına indir
        score += normalized * weights[factor] * 10; // tekrar 0–10 aralığına çık
    }

    return Math.round(score * 100) / 100; // 2 ondalık basamağa yuvarla
}

module.exports = { calculateScore, calculate_score_10 };
  