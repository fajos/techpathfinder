// utils/mapAnswersToCareers.js
import careerKeywords from "../data/careerKeywords";

export default function mapAnswersToCareers(answers) {
  const matchedCareers = {};

  // Process each answer (answers now are the actual text strings from Questionnaire)
  Object.values(answers).forEach((answerText) => {
    const lowerAnswer = answerText.toLowerCase();

    for (const [career, keywords] of Object.entries(careerKeywords)) {
      keywords.forEach((kw) => {
        if (lowerAnswer.includes(kw.toLowerCase())) {
          matchedCareers[career] = (matchedCareers[career] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(matchedCareers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([career]) => career);
}