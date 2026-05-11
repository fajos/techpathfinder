// utils/enhanceRoadmapData.js
/**
 * This utility adds estimated hours to each roadmap step based on complexity keywords
 * Run this once to enhance your careerRoadmapsFull.js file
 */

const complexityKeywords = {
  // Beginner friendly - 1-2 hours
  basic: ['learn', 'understand', 'overview', 'introduction', 'basics', 'fundamentals', 'explore', 'study', 'familiar'],
  // Moderate effort - 3-5 hours
  intermediate: ['master', 'practice', 'build', 'create', 'implement', 'configure', 'setup', 'use', 'work with', 'develop'],
  // Advanced - 6-10 hours
  advanced: ['optimize', 'architecture', 'design', 'analyze', 'complex', 'advanced', 'integrate', 'deploy', 'automate'],
  // Certification/Project level - 10-20 hours
  project: ['certification', 'portfolio', 'project', 'case study', 'prepare for', 'contribute', 'publish', 'launch']
};

const defaultHours = {
  basic: 2,
  intermediate: 4,
  advanced: 8,
  project: 15
};

export const estimateStepHours = (stepText) => {
  const text = stepText.toLowerCase();
  
  // Check for project-level keywords first
  if (complexityKeywords.project.some(keyword => text.includes(keyword))) {
    return defaultHours.project;
  }
  // Check for advanced keywords
  if (complexityKeywords.advanced.some(keyword => text.includes(keyword))) {
    return defaultHours.advanced;
  }
  // Check for intermediate keywords
  if (complexityKeywords.intermediate.some(keyword => text.includes(keyword))) {
    return defaultHours.intermediate;
  }
  // Default to basic
  return defaultHours.basic;
};

/**
 * Run this function once to transform your careerRoadmapsFull object
 * Copy the output and replace your careerRoadmapsFull.js
 */
export const enhanceAllCareers = (careersData) => {
  const enhanced = {};
  
  Object.keys(careersData).forEach(careerKey => {
    const career = careersData[careerKey];
    enhanced[careerKey] = {
      ...career,
      roadmap: career.roadmap.map(step => {
        // If step is already an object with text, use it, otherwise convert
        const stepText = typeof step === 'object' ? step.text : step;
        const estimatedHours = estimateStepHours(stepText);
        
        return {
          text: stepText,
          estimatedHours,
          // Optional: add difficulty rating
          difficulty: getDifficultyLevel(estimatedHours)
        };
      }),
      // Add total hours for the career
      totalHours: career.roadmap.reduce((sum, step) => {
        const stepText = typeof step === 'object' ? step.text : step;
        return sum + estimateStepHours(stepText);
      }, 0),
      // Add skill level categories
      skillLevels: categorizeSkills(career.skills)
    };
  });
  
  return enhanced;
};

const getDifficultyLevel = (hours) => {
  if (hours <= 2) return 'beginner';
  if (hours <= 4) return 'intermediate';
  if (hours <= 8) return 'advanced';
  return 'expert';
};

const categorizeSkills = (skills) => {
  const categories = {
    fundamentals: [],
    tools: [],
    advanced: []
  };
  
  skills.forEach(skill => {
    const skillLower = skill.toLowerCase();
    if (skillLower.includes('basic') || skillLower.includes('fundamental') || 
        skillLower.includes('html') || skillLower.includes('css') || 
        skillLower.includes('javascript') || skillLower.includes('python')) {
      categories.fundamentals.push(skill);
    } else if (skillLower.includes('git') || skillLower.includes('docker') || 
               skillLower.includes('kubernetes') || skillLower.includes('aws') ||
               skillLower.includes('azure') || skillLower.includes('jira')) {
      categories.tools.push(skill);
    } else {
      categories.advanced.push(skill);
    }
  });
  
  return categories;
};