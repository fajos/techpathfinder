import careerKeywords from "../data/careerKeywords";
import i18n from "../i18n"; // Adjust path to your i18n setup

export default function mapAnswersToCareers(answers) {
  const matchedCareers = {};

  Object.values(answers).forEach((answerKey) => {
    const translatedAnswer = i18n.t(answerKey).toLowerCase();

    for (const [career, keywords] of Object.entries(careerKeywords)) {
      keywords.forEach((kw) => {
        if (translatedAnswer.includes(kw.toLowerCase())) {
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