// scripts/enhanceCareers.js
import fs from 'fs';
import { enhanceAllCareers } from '../utils/enhanceRoadmapData.js';

// Read your existing file
const careersData = JSON.parse(fs.readFileSync('./careerRoadmapsFull.js', 'utf8'));

// Enhance all careers
const enhanced = enhanceAllCareers(careersData);

// Write back to file
fs.writeFileSync(
  './careerRoadmapsFull.enhanced.js', 
  `const careerRoadmapsFull = ${JSON.stringify(enhanced, null, 2)};\n\nexport default careerRoadmapsFull;`
);