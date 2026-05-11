// services/learningPlanService.js
import careerRoadmapsFull from '../data/careerRoadmapsFull';
import { careerResources } from '../data/careerResources'; // Import the resources

class LearningPlanService {
  generatePlan(userProfile, targetCareer) {
    const careerData = careerRoadmapsFull[targetCareer];
    const preBuiltResources = careerResources[targetCareer]; // Get pre-generated resources
    
    if (!careerData) return null;
    
    const { weeklyHours = 5, experience = 'beginner' } = userProfile;
    const { roadmap, title } = careerData;
    
    // Calculate total hours
    const totalHours = roadmap.reduce((sum, step) => sum + (step.estimatedHours || 2), 0);
    
    // Calculate weeks needed
    const weeksNeeded = Math.max(1, Math.ceil(totalHours / weeklyHours));
    
    // Generate weekly plan from roadmap
    const weeklyPlan = this.generateWeeklyPlan(roadmap, weeklyHours, weeksNeeded);
    
    // 🔥 IMPORTANT: Merge with pre-generated resources
    const weeklyPlanWithResources = this.mergeWithResources(weeklyPlan, preBuiltResources);
    
    // Generate milestones
    const milestones = this.generateMilestones(weeklyPlanWithResources, weeksNeeded);
    
    return {
      careerTitle: title,
      totalHours,
      weeksNeeded,
      weeklyPlan: weeklyPlanWithResources,
      milestones,
      startDate: new Date().toISOString(),
      estimatedEndDate: this.calculateEndDate(weeksNeeded),
      pace: this.getPaceDescription(weeklyHours)
    };
  }
  
  // 🔥 NEW: Generate weekly plan from roadmap
  generateWeeklyPlan(roadmap, weeklyHours, weeksNeeded) {
    const plan = [];
    let remainingSteps = [...roadmap];
    
    for (let week = 1; week <= weeksNeeded; week++) {
      const weekPlan = {
        week,
        steps: [],
        totalHours: 0,
        focus: ''
      };
      
      let weekHoursRemaining = weeklyHours;
      
      while (weekHoursRemaining > 0 && remainingSteps.length > 0) {
        const currentStep = remainingSteps[0];
        const stepHours = currentStep.estimatedHours || 2;
        
        if (stepHours <= weekHoursRemaining) {
          weekPlan.steps.push(currentStep);
          weekPlan.totalHours += stepHours;
          weekHoursRemaining -= stepHours;
          remainingSteps.shift();
        } else {
          // Partial step
          const partialStep = {
            ...currentStep,
            text: currentStep.text + ' (continued)',
            estimatedHours: weekHoursRemaining,
            isPartial: true
          };
          weekPlan.steps.push(partialStep);
          weekPlan.totalHours += weekHoursRemaining;
          
          currentStep.estimatedHours -= weekHoursRemaining;
          weekHoursRemaining = 0;
        }
      }
      
      // Set focus
      if (weekPlan.steps.length > 0) {
        weekPlan.focus = weekPlan.steps[0].text.substring(0, 40) + 
          (weekPlan.steps[0].text.length > 40 ? '...' : '');
      } else {
        weekPlan.focus = 'Review and practice';
      }
      
      plan.push(weekPlan);
    }
    
    return plan;
  }
  
  // 🔥 NEW: Merge with pre-generated resources
  mergeWithResources(weeklyPlan, preBuiltResources) {
  if (!preBuiltResources?.weeklyPlan) {
    // If no pre-built resources, create generic ones for every week
    return weeklyPlan.map(week => ({
      ...week,
      courses: [],
      articles: [],
      videos: this.generateGenericVideos(week),
      projects: []
    }));
  }
  
  // Create a map of pre-built resources by week
  const resourceMap = {};
  preBuiltResources.weeklyPlan.forEach(week => {
    resourceMap[week.week] = {
      courses: week.courses || [],
      articles: week.articles || [],
      videos: week.videos || [],
      projects: week.projects || []
    };
  });
  
  // Merge resources into the generated plan, ensuring every week has something
  return weeklyPlan.map(week => {
    const weekResources = resourceMap[week.week] || {
      courses: [],
      articles: [],
      videos: [],
      projects: []
    };
    
    // If this week has no resources, generate some based on the week's topics
    if (weekResources.courses.length === 0 && 
        weekResources.articles.length === 0 && 
        weekResources.videos.length === 0 && 
        weekResources.projects.length === 0) {
      
      return {
        ...week,
        courses: [],
        articles: this.generateGenericArticles(week),
        videos: this.generateGenericVideos(week),
        projects: []
      };
    }
    
    return {
      ...week,
      ...weekResources
    };
  });
}

generateGenericArticles(week) {
  const articles = [];
  const mainTopic = week.focus.split(' ').slice(0, 3).join(' ');
  
  articles.push({
    title: `Deep Dive: ${mainTopic}`,
    platform: "MDN Web Docs",
    url: "https://developer.mozilla.org/",
    readTime: "15 min",
    type: "article",
    pricing: "free",
    topics: [mainTopic.toLowerCase()]
  });
  
  articles.push({
    title: `Best Practices for ${mainTopic}`,
    platform: "CSS-Tricks",
    url: "https://css-tricks.com/",
    readTime: "10 min",
    type: "article",
    pricing: "free",
    topics: [mainTopic.toLowerCase()]
  });
  
  return articles;
}

generateGenericVideos(week) {
  const videos = [];
  const mainTopic = week.focus.split(' ').slice(0, 3).join(' ');
  
  videos.push({
    title: `Learn ${mainTopic} in 1 Hour`,
    platform: "YouTube",
    url: "https://youtube.com/",
    duration: "1 hour",
    type: "video",
    pricing: "free",
    creator: "freeCodeCamp",
    topics: [mainTopic.toLowerCase()]
  });
  
  return videos;
}
  
  generateMilestones(weeklyPlan, weeksNeeded) {
    const milestones = [];
    
    const milestoneWeeks = [
      Math.floor(weeksNeeded * 0.25),
      Math.floor(weeksNeeded * 0.5),
      Math.floor(weeksNeeded * 0.75),
      weeksNeeded
    ].filter((v, i, a) => a.indexOf(v) === i);
    
    milestoneWeeks.forEach((week, index) => {
      if (week <= weeksNeeded && weeklyPlan[week - 1]) {
        milestones.push({
          week,
          title: this.getMilestoneTitle(index),
          description: weeklyPlan[week - 1].focus,
          completed: false
        });
      }
    });
    
    return milestones;
  }
  
  getMilestoneTitle(index) {
    const titles = [
      'Foundation Started',
      'Halfway There',
      'Almost Complete',
      'Ready for Opportunities'
    ];
    return titles[index] || 'Progress Milestone';
  }
  
  calculateEndDate(weeksNeeded) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (weeksNeeded * 7));
    return endDate.toISOString();
  }
  
  getPaceDescription(weeklyHours) {
    if (weeklyHours <= 3) return 'Relaxed';
    if (weeklyHours <= 6) return 'Standard';
    return 'Accelerated';
  }
}

export default new LearningPlanService();