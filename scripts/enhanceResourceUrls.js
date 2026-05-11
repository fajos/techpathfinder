// scripts/enhanceResourceUrls.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the generated career resources
const careerResourcesPath = path.join(__dirname, '../data/careerResources.js');
const careerResourcesContent = fs.readFileSync(careerResourcesPath, 'utf8');

// Extract the JSON part
const jsonMatch = careerResourcesContent.match(/export const careerResources = ({[\s\S]*});/);
if (!jsonMatch) {
  console.error('Could not parse careerResources file');
  process.exit(1);
}

// Parse the JSON
const careerResources = (new Function('return ' + jsonMatch[1]))();

// ============================================
// REAL RESOURCE DATABASE
// ============================================
const realResources = {
  'Coursera': {
    base: 'https://www.coursera.org/',
    paths: {
      'python': 'learn/python-for-applied-data-science-ai',
      'machine learning': 'learn/machine-learning',
      'data science': 'browse/data-science',
      'cloud': 'browse/cloud-computing',
      'project management': 'professional-certificates/google-project-management',
      'ux': 'learn/user-experience-design'
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
  'YouTube': {
    base: 'https://youtube.com/',
    playlists: {
      'html': 'playlist?list=PL4cUxeGkcC9gQeDH6xYhmO-db2mhoTSrT',
      'css': 'playlist?list=PL4cUxeGkcC9gQeDH6xYhmO-db2mhoTSrT',
      'javascript': 'playlist?list=PLillRU-RqLbVw1kRYs9XAz75dpFpkv89w',
      'react': 'playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d',
      'python': 'playlist?list=PL-osiE80TeTskrapNbzXhwoFUiLCjGgY7',
      'git': 'playlist?list=PL4cUxeGkcC9goXbgTDQ0n_4TBzOO0ocPR'
    },
    channels: {
      'freeCodeCamp': '@freecodecamp',
      'Traversy Media': '@TraversyMedia',
      'The Net Ninja': '@NetNinja'
    }
  },
  'MDN': {
    base: 'https://developer.mozilla.org/en-US/docs/',
    paths: {
      'html': 'Web/HTML',
      'css': 'Web/CSS',
      'javascript': 'Web/JavaScript',
      'api': 'Web/API',
      'http': 'Web/HTTP',
      'accessibility': 'Web/Accessibility'
    }
  },
  'Google': {
    base: 'https://developers.google.com/',
    paths: {
      'tech writing': 'tech-writing',
      'web': 'web',
      'android': 'android'
    }
  },
  'Product School': {
    base: 'https://productschool.com/',
    paths: {
      'product management': 'free-resources',
      'product strategy': 'blog'
    }
  }
};

// ============================================
// PLACEHOLDER DETECTION
// ============================================
function isPlaceholder(url) {
  if (!url) return true;
  
  // List of patterns that are definitely placeholders
  const placeholderPatterns = [
    /^https?:\/\/(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/?$/, // Just domain
    /^https?:\/\/(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/[a-zA-Z]*\/?$/, // Domain + one short path
    /#$/,
    /example\.com/,
    /localhost/,
    /youtube\.com\/?$/,
    /youtube\.com\/@?$/,
    /youtu\.be\/?$/,
    /medium\.com\/?$/,
    /developer\.mozilla\.org\/?$/,
    /freecodecamp\.org\/?$/,
    /coursera\.org\/?$/,
    /udemy\.com\/?$/,
    /\.com\/learn\/?$/,
    /\.org\/learn\/?$/,
    /\.io\/?$/
  ];
  
  for (const pattern of placeholderPatterns) {
    if (pattern.test(url)) {
      return true;
    }
  }
  
  return false;
}

// ============================================
// URL ENHANCEMENT
// ============================================
function enhanceResourceUrl(resource) {
  const originalUrl = resource.url;
  
  // If it's not a placeholder, keep it
  if (!isPlaceholder(originalUrl)) {
    return resource;
  }
  
  console.log(`🔧 Fixing placeholder for: ${resource.title}`);
  
  const topics = resource.topics || [];
  const primaryTopic = topics.length > 0 ? topics[0].toLowerCase() : null;
  const platform = resource.platform;
  
  let newUrl = null;
  
  // Try platform-specific enhancement
  if (platform && realResources[platform]) {
    const platformData = realResources[platform];
    
    // Try to match by topic
    if (primaryTopic && platformData.paths && platformData.paths[primaryTopic]) {
      newUrl = platformData.base + platformData.paths[primaryTopic];
    }
    // Try YouTube playlists
    else if (platform === 'YouTube' && primaryTopic && platformData.playlists && platformData.playlists[primaryTopic]) {
      newUrl = platformData.base + platformData.playlists[primaryTopic];
    }
    // Try YouTube channels
    else if (platform === 'YouTube' && resource.creator && platformData.channels && platformData.channels[resource.creator]) {
      newUrl = platformData.base + platformData.channels[resource.creator];
    }
    // Use platform base
    else {
      newUrl = platformData.base;
    }
  }
  
  // If still no URL, use intelligent fallbacks
  if (!newUrl) {
    if (resource.type === 'article' || resource.type === 'documentation') {
      newUrl = 'https://developer.mozilla.org/en-US/docs/Learn';
    } else if (resource.type === 'video') {
      newUrl = 'https://youtube.com/@freecodecamp';
    } else if (resource.type === 'course') {
      newUrl = 'https://www.freecodecamp.org/learn';
    } else {
      newUrl = 'https://developer.mozilla.org/en-US/docs/Learn';
    }
  }
  
  return { ...resource, url: newUrl };
}

// ============================================
// MAIN ENHANCEMENT FUNCTION
// ============================================
async function enhanceAllResources() {
  console.log('🔍 Enhancing resource URLs...\n');
  
  let totalResources = 0;
  let enhancedCount = 0;
  let validCount = 0;
  let invalidUrls = [];
  let fixedUrls = [];
  
  for (const [careerName, career] of Object.entries(careerResources)) {
    if (!career.weeklyPlan) continue;
    
    for (const week of career.weeklyPlan) {
      const resourceTypes = ['courses', 'articles', 'videos', 'projects'];
      
      for (const type of resourceTypes) {
        if (week[type]) {
          week[type] = week[type].map(item => {
            totalResources++;
            
            // Track original for reporting
            const originalUrl = item.url;
            
            // Check if current URL is a placeholder
            if (!isPlaceholder(item.url)) {
              validCount++;
              return item;
            }
            
            // Track invalid URL
            invalidUrls.push({
              career: careerName,
              week: week.week,
              type,
              title: item.title,
              url: item.url
            });
            
            // Enhance the URL
            const enhanced = enhanceResourceUrl(item);
            
            // Check if actually changed
            if (enhanced.url !== originalUrl) {
              enhancedCount++;
              fixedUrls.push({
                career: careerName,
                week: week.week,
                type,
                title: item.title,
                old: originalUrl,
                new: enhanced.url
              });
            }
            
            return enhanced;
          });
        }
      }
    }
  }
  
  console.log(`📊 Total resources processed: ${totalResources}`);
  console.log(`✅ Already valid URLs: ${validCount}`);
  console.log(`✨ URLs enhanced: ${enhancedCount}`);
  console.log(`❌ Invalid URLs found: ${invalidUrls.length}`);
  
  // Show sample of fixed URLs
  if (fixedUrls.length > 0) {
    console.log('\n📋 Sample of fixed URLs:');
    fixedUrls.slice(0, 5).forEach((item, i) => {
      console.log(`\n${i+1}. ${item.career} - Week ${item.week} - ${item.type}`);
      console.log(`   "${item.title}"`);
      console.log(`   Old: ${item.old}`);
      console.log(`   New: ${item.new}`);
    });
  }
  
  // Write back to file
  const outputPath = careerResourcesPath;
  const fileContent = `// Auto-generated career resources with enhanced URLs
// Generated on: ${new Date().toISOString()}
// Total careers: ${Object.keys(careerResources).length}
// URLs enhanced: ${enhancedCount}

export const careerResources = ${JSON.stringify(careerResources, null, 2)};
`;
  
  fs.writeFileSync(outputPath, fileContent);
  console.log(`\n✅ Enhanced file written to: ${outputPath}`);
}

// Run the enhancement
enhanceAllResources().catch(console.error);