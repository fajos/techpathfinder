// scripts/generateCareerResources.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import career data
import careerRoadmapsFull from '../data/careerRoadmapsFull.js';

// ============================================
// REAL RESOURCE DATABASE (CURATED URLs)
// ============================================
const realResources = {
  // === GENERAL LEARNING ===
  'MDN Web Docs': {
    base: 'https://developer.mozilla.org/en-US/docs/',
    paths: {
      'html': 'Web/HTML',
      'css': 'Web/CSS',
      'javascript': 'Web/JavaScript',
      'api': 'Web/API',
      'http': 'Web/HTTP',
      'accessibility': 'Web/Accessibility',
      'learn': 'Learn'
    }
  },
  'freeCodeCamp': {
    base: 'https://www.freecodecamp.org/',
    paths: {
      'html': 'learn/2022/responsive-web-design/',
      'css': 'learn/2022/responsive-web-design/',
      'javascript': 'learn/javascript-algorithms-and-data-structures/',
      'react': 'learn/front-end-development-libraries/',
      'python': 'learn/scientific-computing-with-python-v7/',
      'data science': 'learn/data-analysis-with-python-v7/'
    }
  },
  'W3Schools': {
    base: 'https://www.w3schools.com/',
    paths: {
      'html': 'html/default.asp',
      'css': 'css/default.asp',
      'javascript': 'js/default.asp',
      'python': 'python/default.asp',
      'sql': 'sql/default.asp'
    }
  },
  'YouTube': {
    channels: {
      'freeCodeCamp': 'https://youtube.com/@freecodecamp',
      'Traversy Media': 'https://youtube.com/@TraversyMedia',
      'The Net Ninja': 'https://youtube.com/@NetNinja',
      'Fireship': 'https://youtube.com/@Fireship',
      'Web Dev Simplified': 'https://youtube.com/@WebDevSimplified',
      'Corey Schafer': 'https://youtube.com/@coreyms',
      'Academind': 'https://youtube.com/@Academind',
      'TechWorld with Nana': 'https://youtube.com/@TechWorldwithNana',
      'NetworkChuck': 'https://youtube.com/@NetworkChuck',
      'The Cyber Mentor': 'https://youtube.com/@TheCyberMentor',
      'GreatScott!': 'https://youtube.com/@GreatScottLab',
      'DesignCourse': 'https://youtube.com/@DesignCourse'
    },
    playlists: {
      'html': 'https://youtube.com/playlist?list=PL4cUxeGkcC9gQeDH6xYhmO-db2mhoTSrT',
      'css': 'https://youtube.com/playlist?list=PL4cUxeGkcC9gQeDH6xYhmO-db2mhoTSrT',
      'javascript': 'https://youtube.com/playlist?list=PLillRU-RqLbVw1kRYs9XAz75dpFpkv89w',
      'react': 'https://youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d',
      'python': 'https://youtube.com/playlist?list=PL-osiE80TeTskrapNbzXhwoFUiLCjGgY7',
      'git': 'https://youtube.com/playlist?list=PL4cUxeGkcC9goXbgTDQ0n_4TBzOO0ocPR',
      'docker': 'https://youtube.com/playlist?list=PL4cUxeGkcC9hxjeEtdHFNYMtCpjNBm3Q7',
      'kubernetes': 'https://youtube.com/playlist?list=PL4cUxeGkcC9iQstmAuvXgI7flc5n5WzRS'
    }
  },
  'CSS-Tricks': {
    base: 'https://css-tricks.com/',
    paths: {
      'flexbox': 'snippets/css/a-guide-to-flexbox/',
      'grid': 'snippets/css/complete-guide-grid/',
      'css': 'guides/'
    }
  },
  'Dev.to': {
    base: 'https://dev.to/',
    paths: {
      'javascript': 't/javascript',
      'python': 't/python',
      'react': 't/react',
      'devops': 't/devops'
    }
  },
'Vercel': {
  base: 'https://vercel.com/',
  paths: {
    'deploy': 'docs',
    'nextjs': 'docs'
  }
},
'Netlify': {
  base: 'https://www.netlify.com/',
  paths: {
    'deploy': 'blog/tag/deploy/'
  }
},
'Next.js': {
  base: 'https://nextjs.org/',
  paths: {
    'learn': 'learn',
    'docs': 'docs'
  }
},
'Vite': {
  base: 'https://vitejs.dev/',
  paths: {
    'guide': 'guide/'
  }
},
'Webpack': {
  base: 'https://webpack.js.org/',
  paths: {
    'guides': 'guides/',
    'concepts': 'concepts/'
  }
},
  'Atlassian': {
    base: 'https://www.atlassian.com/',
    paths: {
      'agile': 'agile',
      'jira': 'software/jira'
    }
  },
  'AWS': {
    base: 'https://aws.amazon.com/',
    paths: {
      'training': 'training/',
      'certification': 'certification/'
    }
  },
  'Microsoft Learn': {
    base: 'https://learn.microsoft.com/en-us/training/',
    paths: {
      'azure': 'azure/',
      'devops': 'devops/',
      'security': 'security/'
    }
  },
  'Google Cloud': {
    base: 'https://cloud.google.com/',
    paths: {
      'training': 'training',
      'certification': 'certification'
    }
  },
  'Kaggle': {
    base: 'https://www.kaggle.com/',
    paths: {
      'learn': 'learn',
      'competitions': 'competitions'
    }
  },
  'TryHackMe': {
    base: 'https://tryhackme.com/',
    paths: {
      'beginner': 'path/beginner',
      'rooms': 'rooms'
    }
  },
  'HackTheBox': {
    base: 'https://www.hackthebox.com/',
    paths: {
      'academy': 'academy',
      'ctf': 'ctf'
    }
  },
  'Figma': {
    base: 'https://www.figma.com/',
    paths: {
      'learn': 'learn/',
      'community': 'community'
    }
  },
  'Product School': {
    base: 'https://productschool.com/',
    paths: {
      'free resources': 'free-resources',
      'blog': 'blog'
    }
  },
  'Mind the Product': {
    base: 'https://www.mindtheproduct.com/',
    paths: {
      'articles': 'articles',
      'podcast': 'podcast'
    }
  },
  'Arduino': {
    base: 'https://www.arduino.cc/',
    paths: {
      'learn': 'en/Tutorial/HomePage',
      'reference': 'en/Reference/HomePage'
    }
  },
  'Raspberry Pi': {
    base: 'https://www.raspberrypi.org/',
    paths: {
      'learn': 'learn/',
      'projects': 'projects/'
    }
  },
  'Cisco': {
    base: 'https://www.cisco.com/',
    paths: {
      'networking': 'c/en/us/solutions/networking.html',
      'training': 'go/training'
    }
  },
  'Professor Messer': {
    base: 'https://www.professormesser.com/',
    paths: {
      'network+': 'network-plus/n10-008/',
      'security+': 'security-plus/sy0-601/'
    }
  },
  'Git': {
    base: 'https://git-scm.com/',
    paths: {
      'docs': 'doc',
      'book': 'book/en/v2'
    }
  },
  'Docker': {
    base: 'https://docs.docker.com/',
    paths: {
      'get-started': 'get-started/',
      'guides': 'guides/'
    }
  },
  'Kubernetes': {
    base: 'https://kubernetes.io/',
    paths: {
      'docs': 'docs/',
      'tutorials': 'docs/tutorials/'
    }
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getValidUrl(platform, topic, type) {
  // Check if platform exists
  if (!realResources[platform]) return null;
  
  const platformData = realResources[platform];
  
  // Try topic-specific path
  if (platformData.paths && platformData.paths[topic]) {
    return platformData.base + platformData.paths[topic];
  }
  
  // Try YouTube playlists
  if (platform === 'YouTube' && platformData.playlists && platformData.playlists[topic]) {
    return platformData.playlists[topic];
  }
  
  // Try YouTube channel
  if (platform === 'YouTube' && platformData.channels) {
    // Return a relevant channel based on topic
    const channels = {
      'javascript': 'Traversy Media',
      'python': 'Corey Schafer',
      'react': 'The Net Ninja',
      'devops': 'TechWorld with Nana',
      'security': 'The Cyber Mentor',
      'hardware': 'GreatScott!',
      'design': 'DesignCourse'
    };
    const channelName = channels[topic] || 'freeCodeCamp';
    return platformData.channels[channelName] || platformData.channels['freeCodeCamp'];
  }
  
  // Use base URL as fallback
  return platformData.base || null;
}

function extractTopicsFromStep(stepText) {
  const topics = [];
  const text = stepText.toLowerCase();
  
  const topicKeywords = {
    'html': ['html', 'markup', 'tags'],
    'css': ['css', 'styling', 'flexbox', 'grid'],
    'javascript': ['javascript', 'js', 'es6'],
    'react': ['react', 'jsx', 'hooks'],
    'python': ['python', 'django', 'flask'],
    'git': ['git', 'github', 'version control'],
    'docker': ['docker', 'container'],
    'kubernetes': ['kubernetes', 'k8s'],
    'aws': ['aws', 'amazon web services'],
    'azure': ['azure'],
    'sql': ['sql', 'database'],
    'api': ['api', 'rest', 'graphql'],
    'testing': ['test', 'jest', 'cypress'],
    'security': ['security', 'auth', 'encryption'],
    'agile': ['agile', 'scrum'],
    'product': ['product', 'pm'],
    'design': ['design', 'figma', 'ui', 'ux'],
    'hardware': ['arduino', 'raspberry', 'microcontroller'],
    'networking': ['network', 'tcp/ip', 'dns'],
    'webpack': ['webpack', 'bundle', 'module bundler'],
    'vite': ['vite', 'build tool'],
    'babel': ['babel', 'transpile', 'compiler'],
    'nextjs': ['next.js', 'nextjs', 'meta-framework'],
    'deploy': ['deploy', 'vercel', 'netlify', 'hosting'],
    'build tools': ['webpack', 'vite', 'babel', 'build tool']
  };
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      topics.push(topic);
    }
  });
  
  return topics.length ? topics : ['general'];
}

function generateWeeklyPlan(roadmap, weeklyHours = 5) {
  const plan = [];
  let remainingSteps = [...roadmap];
  let weekNum = 1;
  
  while (remainingSteps.length > 0) {
    const weekPlan = {
      week: weekNum,
      steps: [],
      totalHours: 0,
      focus: '',
      difficulty: '',
      courses: [],
      articles: [],
      videos: [],
      projects: []
    };
    
    let weekHoursRemaining = weeklyHours;
    
    while (weekHoursRemaining > 0 && remainingSteps.length > 0) {
      const step = remainingSteps[0];
      const stepHours = 2; // Default hours, you can adjust
      
      weekPlan.steps.push({
        text: step.text,
        difficulty: step.difficulty || 'Beginner'
      });
      weekPlan.totalHours += stepHours;
      weekHoursRemaining -= stepHours;
      remainingSteps.shift();
    }
    
    // Set focus based on first step
    if (weekPlan.steps.length > 0) {
      weekPlan.focus = weekPlan.steps[0].text.substring(0, 40) + 
        (weekPlan.steps[0].text.length > 40 ? '...' : '');
      weekPlan.difficulty = weekPlan.steps[0].difficulty;
    }
    
    plan.push(weekPlan);
    weekNum++;
  }
  
  return plan;
}

function generateResourcesForWeek(week, careerResources) {
  const resources = {
    courses: [],
    articles: [],
    videos: [],
    projects: []
  };
  
  // Extract ALL topics from week's steps with weights
  const topicScores = {};
  week.steps.forEach(step => {
    const topics = extractTopicsFromStep(step.text);
    topics.forEach(topic => {
      topicScores[topic] = (topicScores[topic] || 0) + 1;
    });
  });
  
  // Sort topics by relevance (highest score first)
  const sortedTopics = Object.entries(topicScores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  const primaryTopic = sortedTopics[0] || 'general';
  const secondaryTopics = sortedTopics.slice(1, 3);
  
  console.log(`Week ${week.week} topics:`, { primary: primaryTopic, secondary: secondaryTopics });
  
  // ===== COURSES =====
  // Primary topic course
  const primaryCourseUrl = getValidUrl('freeCodeCamp', primaryTopic, 'course') || 
                           getValidUrl('MDN Web Docs', primaryTopic, 'course') ||
                           'https://www.freecodecamp.org/learn';
  
  resources.courses.push({
    title: `Complete Guide to ${primaryTopic.charAt(0).toUpperCase() + primaryTopic.slice(1)}`,
    platform: primaryCourseUrl.includes('freecodecamp') ? 'freeCodeCamp' : 
              primaryCourseUrl.includes('developer.mozilla') ? 'MDN Web Docs' : 'Online Platform',
    url: primaryCourseUrl,
    duration: '8-12 hours',
    type: 'course',
    pricing: 'free',
    topics: [primaryTopic],
    weekTags: [week.week]
  });
  
  // Secondary topic course (if exists)
  if (secondaryTopics.length > 0) {
    const secondaryTopic = secondaryTopics[0];
    const secondaryCourseUrl = getValidUrl('YouTube', secondaryTopic, 'course') ||
                               'https://youtube.com/@freecodecamp';
    
    resources.courses.push({
      title: `${secondaryTopic.charAt(0).toUpperCase() + secondaryTopic.slice(1)} Essentials`,
      platform: 'YouTube',
      url: secondaryCourseUrl,
      duration: '4-6 hours',
      type: 'video',
      pricing: 'free',
      topics: [secondaryTopic],
      weekTags: [week.week]
    });
  }
  
  // ===== ARTICLES =====
  // Primary topic article
  const articlePlatforms = ['MDN Web Docs', 'CSS-Tricks', 'Dev.to'];
  const primaryArticlePlatform = articlePlatforms[Math.floor(Math.random() * articlePlatforms.length)];
  const primaryArticleUrl = getValidUrl(primaryArticlePlatform, primaryTopic, 'article') ||
                            'https://developer.mozilla.org/en-US/docs/Learn';
  
  resources.articles.push({
    title: `Deep Dive: ${primaryTopic.charAt(0).toUpperCase() + primaryTopic.slice(1)}`,
    platform: primaryArticlePlatform,
    url: primaryArticleUrl,
    readTime: '20 min',
    type: 'article',
    pricing: 'free',
    topics: [primaryTopic],
    weekTags: [week.week]
  });
  
  // ===== VIDEOS =====
  // Primary topic video
  const primaryVideoUrl = getValidUrl('YouTube', primaryTopic, 'video') ||
                          'https://youtube.com/@freecodecamp';
  
  resources.videos.push({
    title: `${primaryTopic.charAt(0).toUpperCase() + primaryTopic.slice(1)} Crash Course`,
    platform: 'YouTube',
    url: primaryVideoUrl,
    duration: '30-60 min',
    type: 'video',
    pricing: 'free',
    creator: 'Various',
    topics: [primaryTopic],
    weekTags: [week.week]
  });
  
  // ===== PROJECTS (for advanced weeks) =====
  const hasAdvancedStep = week.steps.some(step => 
    step.difficulty?.toLowerCase() === 'advanced' || 
    step.text.toLowerCase().includes('build') ||
    step.text.toLowerCase().includes('create') ||
    step.text.toLowerCase().includes('deploy')
  );
  
  if (hasAdvancedStep) {
    resources.projects.push({
      title: `Build a Project with ${primaryTopic.charAt(0).toUpperCase() + primaryTopic.slice(1)}`,
      description: `Apply your ${primaryTopic} skills to build a real-world project`,
      difficulty: 'Intermediate',
      timeEstimate: '4-6 hours',
      pricing: 'free',
      topics: [primaryTopic],
      weekTags: [week.week]
    });
  }
  
  return resources;
}

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

function generateAllCareerResources() {
  const careerResources = {};
  
  Object.entries(careerRoadmapsFull).forEach(([careerName, careerData]) => {
    console.log(`🔄 Generating resources for: ${careerName}`);
    
    // Generate weekly plan
    const weeklyPlan = generateWeeklyPlan(careerData.roadmap || []);
    
    // Extract career-specific resources from careerData
    const careerSpecificResources = {
      courses: [],
      articles: [],
      videos: [],
      projects: []
    };
    
    // Convert careerData.resources (URLs) to structured resources
    if (careerData.resources && careerData.resources.length > 0) {
      careerData.resources.forEach((url, index) => {
        // Determine platform from URL
        let platform = 'Unknown';
        if (url.includes('developer.mozilla.org')) platform = 'MDN Web Docs';
        else if (url.includes('freecodecamp.org')) platform = 'freeCodeCamp';
        else if (url.includes('youtube.com')) platform = 'YouTube';
        else if (url.includes('coursera.org')) platform = 'Coursera';
        else if (url.includes('udemy.com')) platform = 'Udemy';
        else if (url.includes('atlassian.com')) platform = 'Atlassian';
        else if (url.includes('productschool.com')) platform = 'Product School';
        
        careerSpecificResources.articles.push({
          title: `${careerName} Resource ${index + 1}`,
          platform,
          url,
          readTime: '15 min',
          type: 'article',
          pricing: url.includes('free') ? 'free' : 'paid',
          topics: [careerName.toLowerCase()],
          weekTags: [index + 1]
        });
      });
    }
    
    // Generate weekly resources
    const enhancedWeeklyPlan = weeklyPlan.map(week => {
      const weekResources = generateResourcesForWeek(week, careerSpecificResources);
      return {
        ...week,
        ...weekResources
      };
    });
    
    careerResources[careerName] = {
      careerTitle: careerData.title,
      totalHours: weeklyPlan.reduce((sum, w) => sum + w.totalHours, 0),
      weeksNeeded: weeklyPlan.length,
      weeklyPlan: enhancedWeeklyPlan,
      resources: careerData.resources || []
    };
  });
  
  return careerResources;
}

// ============================================
// WRITE TO FILE
// ============================================

function writeToFile(careerResources) {
  const outputPath = path.join(__dirname, '../data/careerResources.js');
  
  const fileContent = `// Auto-generated career resources
// Generated on: ${new Date().toISOString()}
// Total careers: ${Object.keys(careerResources).length}
// This file contains curated learning resources for each career path

export const careerResources = ${JSON.stringify(careerResources, null, 2)};
`;
  
  fs.writeFileSync(outputPath, fileContent);
  console.log(`\n✅ File written to: ${outputPath}`);
  console.log(`✅ Total careers generated: ${Object.keys(careerResources).length}`);
}

// ============================================
// RUN THE SCRIPT
// ============================================

console.log('🚀 Generating career resources...\n');
const careerResources = generateAllCareerResources();
writeToFile(careerResources);
console.log('\n✨ Done!');