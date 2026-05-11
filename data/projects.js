// data/projects.js (Complete version with generator)
import careerRoadmapsFull from './careerRoadmapsFull';

// Base templates for project types
const projectTemplates = {
  // Frontend templates
  frontend: {
    beginner: [
      { name: "Personal Portfolio", description: "Build a responsive portfolio to showcase your work", steps: 4, hours: 8 },
      { name: "Weather Dashboard", description: "Create a weather app using a public API", steps: 5, hours: 10 },
      { name: "To-Do List App", description: "Build a task manager with local storage", steps: 4, hours: 6 }
    ],
    intermediate: [
      { name: "E-commerce Store", description: "Build a product catalog with cart and checkout", steps: 6, hours: 20 },
      { name: "Social Media Dashboard", description: "Create a dashboard with charts and analytics", steps: 5, hours: 15 },
      { name: "Blog Platform", description: "Build a full blog with comments and categories", steps: 7, hours: 25 }
    ],
    advanced: [
      { name: "Real-time Chat App", description: "Build a chat app with WebSockets", steps: 8, hours: 40 },
      { name: "Video Streaming Platform", description: "Create a YouTube-like platform", steps: 10, hours: 50 }
    ]
  },
  
  // Backend templates
  backend: {
    beginner: [
      { name: "REST API", description: "Build a RESTful API with CRUD operations", steps: 5, hours: 8 },
      { name: "Authentication Service", description: "Implement JWT authentication", steps: 4, hours: 10 }
    ],
    intermediate: [
      { name: "URL Shortener", description: "Create a URL shortening service", steps: 6, hours: 15 },
      { name: "Task Queue System", description: "Build a job queue with Redis", steps: 7, hours: 20 }
    ],
    advanced: [
      { name: "Microservices Architecture", description: "Design and implement microservices", steps: 10, hours: 40 }
    ]
  },
  
  // Data templates
  data: {
    beginner: [
      { name: "Sales Dashboard", description: "Analyze and visualize sales data", steps: 5, hours: 8 },
      { name: "Customer Segmentation", description: "Segment customers using RFM analysis", steps: 6, hours: 10 }
    ],
    intermediate: [
      { name: "Time Series Forecasting", description: "Build prediction models for business metrics", steps: 7, hours: 15 },
      { name: "ETL Pipeline", description: "Build a data pipeline from scratch", steps: 8, hours: 20 }
    ],
    advanced: [
      { name: "ML Recommendation System", description: "Build a recommendation engine", steps: 9, hours: 30 }
    ]
  },
  
  // DevOps templates
  devops: {
    beginner: [
      { name: "CI/CD Pipeline", description: "Set up automated deployment", steps: 5, hours: 6 },
      { name: "Dockerize Application", description: "Containerize a sample app", steps: 4, hours: 5 }
    ],
    intermediate: [
      { name: "Kubernetes Cluster", description: "Deploy app to Kubernetes", steps: 7, hours: 15 },
      { name: "Infrastructure as Code", description: "Provision cloud resources with Terraform", steps: 6, hours: 12 }
    ],
    advanced: [
      { name: "Full DevOps Pipeline", description: "Build end-to-end CI/CD with monitoring", steps: 10, hours: 30 }
    ]
  },
  
  // Security templates
  security: {
    beginner: [
      { name: "Vulnerability Scanner", description: "Build a basic vulnerability scanner", steps: 5, hours: 8 },
      { name: "Password Cracker Demo", description: "Implement password hashing and cracking demo", steps: 4, hours: 6 }
    ],
    intermediate: [
      { name: "Web Application Firewall", description: "Create a basic WAF", steps: 7, hours: 15 },
      { name: "Security Audit Tool", description: "Build a security audit script", steps: 6, hours: 12 }
    ],
    advanced: [
      { name: "Intrusion Detection System", description: "Build an IDS with machine learning", steps: 9, hours: 30 }
    ]
  },
  
  // Design templates
  design: {
    beginner: [
      { name: "Mobile App UI Kit", description: "Create a complete UI kit", steps: 5, hours: 10 },
      { name: "Landing Page Design", description: "Design a high-converting landing page", steps: 4, hours: 6 }
    ],
    intermediate: [
      { name: "Design System", description: "Build a comprehensive design system", steps: 7, hours: 20 },
      { name: "App Redesign", description: "Redesign an existing app with case study", steps: 6, hours: 15 }
    ],
    advanced: [
      { name: "Interactive Prototype", description: "Create a fully interactive prototype", steps: 8, hours: 25 }
    ]
  },
  
  // Product templates
  product: {
    beginner: [
      { name: "Product Requirements Document", description: "Write a comprehensive PRD", steps: 5, hours: 6 },
      { name: "User Personas", description: "Create detailed user personas", steps: 4, hours: 4 }
    ],
    intermediate: [
      { name: "Go-to-Market Strategy", description: "Create a launch plan", steps: 7, hours: 12 },
      { name: "Competitive Analysis", description: "Deep dive competitor analysis", steps: 6, hours: 10 }
    ],
    advanced: [
      { name: "Product Roadmap", description: "Build a 12-month product roadmap", steps: 8, hours: 15 }
    ]
  },
  
  // General templates (fallback)
  general: {
    beginner: [
      { name: "Command Line Tool", description: "Build a useful CLI tool", steps: 4, hours: 5 },
      { name: "API Integration", description: "Integrate with a public API", steps: 4, hours: 6 }
    ],
    intermediate: [
      { name: "Open Source Contribution", description: "Contribute to an open source project", steps: 6, hours: 12 },
      { name: "Browser Extension", description: "Build a useful browser extension", steps: 5, hours: 10 }
    ],
    advanced: [
      { name: "Full Stack Application", description: "Build a complete full stack app", steps: 10, hours: 35 }
    ]
  }
};

// Career to template mapping
const careerTemplates = {
  // Frontend
  'Frontend Developer': 'frontend',
  'Full Stack Developer': 'frontend',
  'Mobile Developer': 'frontend',
  'React Developer': 'frontend',
  'UI Developer': 'frontend',
  
  // Backend
  'Backend Developer': 'backend',
  'Node.js Developer': 'backend',
  'Python Developer': 'backend',
  'Java Developer': 'backend',
  'API Developer': 'backend',
  
  // Data
  'Data Analyst': 'data',
  'Data Scientist': 'data',
  'Data Engineer': 'data',
  'Machine Learning Engineer': 'data',
  'AI/ML Engineer': 'data',
  
  // DevOps
  'DevOps Engineer': 'devops',
  'Cloud Engineer': 'devops',
  'Site Reliability Engineer': 'devops',
  'System Administrator': 'devops',
  
  // Security
  'Cybersecurity Specialist': 'security',
  'Security Analyst': 'security',
  'Ethical Hacker': 'security',
  'Cloud Security Engineer': 'security',
  
  // Design
  'UI/UX Designer': 'design',
  'Creative Technologist': 'design',
  'Product Designer': 'design',
  
  // Product
  'Product Manager': 'product',
  'IT Project Manager': 'product',
  'Project Manager': 'product',
  
  // Networking
  'Network Engineer': 'general',
  'Network Administrator': 'general',
  'Database Administrator': 'general',
  
  // Hardware
  'IoT Developer': 'general',
  'Embedded AI Developer': 'general',
  'Hardware Test Engineer': 'general',
  
  // Other
  'Technical Writer': 'general',
  'Digital Marketer': 'general',
  'Social Media Manager': 'general'
};

// Helper to generate technologies for a project based on career
const getTechnologies = (career, project) => {
  const techMap = {
    'Frontend Developer': ['React', 'Tailwind', 'TypeScript', 'Next.js'],
    'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'],
    'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'Tailwind'],
    'Data Analyst': ['Python', 'Pandas', 'Jupyter', 'Tableau'],
    'DevOps Engineer': ['Docker', 'Kubernetes', 'Terraform', 'AWS'],
    'Product Manager': ['Jira', 'Miro', 'Figma', 'ProductPlan'],
    'UI/UX Designer': ['Figma', 'Adobe XD', 'Miro', 'Photoshop']
  };
  
  return techMap[career] || ['JavaScript', 'Git', 'VS Code'];
};

// Helper to generate steps for a project
const generateSteps = (projectName, career, difficulty) => {
  const steps = [];
  
  // Setup step
  steps.push(`Set up project structure and development environment`);
  steps.push(`Plan the architecture and core features`);
  steps.push(`Implement core functionality`);
  
  // Add specific steps based on project type
  if (projectName.includes('Portfolio')) {
    steps.push(`Design responsive layout`);
    steps.push(`Add projects showcase section`);
    steps.push(`Implement contact form`);
    steps.push(`Deploy to GitHub Pages/Netlify`);
  } else if (projectName.includes('API')) {
    steps.push(`Design API endpoints`);
    steps.push(`Implement CRUD operations`);
    steps.push(`Add authentication`);
    steps.push(`Document API with Swagger`);
  } else if (projectName.includes('Dashboard')) {
    steps.push(`Connect to data source`);
    steps.push(`Create visualization components`);
    steps.push(`Add filters and interactions`);
    steps.push(`Implement export functionality`);
  } else {
    steps.push(`Test and debug`);
    steps.push(`Write documentation`);
    steps.push(`Deploy and share`);
  }
  
  // Add difficulty-specific steps
  if (difficulty === 'Intermediate') {
    steps.push(`Add advanced features`);
    steps.push(`Implement error handling`);
  } else if (difficulty === 'Advanced') {
    steps.push(`Optimize performance`);
    steps.push(`Add comprehensive testing`);
    steps.push(`Implement CI/CD pipeline`);
  }
  
  return steps.slice(0, 8);
};

// Generate resources for a project
const generateResources = (career, projectName) => {
  const resources = [
    `https://github.com/topics/${projectName.toLowerCase().replace(/\s+/g, '-')}`,
    `https://www.freecodecamp.org/news/build-a-${projectName.toLowerCase().replace(/\s+/g, '-')}/`,
  ];
  
  if (career.includes('Frontend') || career.includes('Full Stack')) {
    resources.push('https://developer.mozilla.org/en-US/docs/Web');
    resources.push('https://react.dev/learn');
  } else if (career.includes('Backend')) {
    resources.push('https://nodejs.org/en/docs/');
    resources.push('https://expressjs.com/en/5x/api.html');
  } else if (career.includes('Data')) {
    resources.push('https://pandas.pydata.org/docs/');
    resources.push('https://www.kaggle.com/learn');
  }
  
  return resources;
};

// Generate all projects for a career
export const generateProjectsForCareer = (career) => {
  const templateKey = careerTemplates[career] || 'general';
  const templates = projectTemplates[templateKey];
  const projects = { beginner: [], intermediate: [], advanced: [] };
  
  const difficultyLevels = ['beginner', 'intermediate', 'advanced'];
  
  difficultyLevels.forEach(level => {
    const levelTemplates = templates[level];
    if (levelTemplates && levelTemplates.length > 0) {
      levelTemplates.forEach((template, index) => {
        const technologies = getTechnologies(career, template);
        const steps = generateSteps(template.name, career, level);
        const resources = generateResources(career, template.name);
        
        projects[level].push({
          id: `${career.replace(/\s+/g, '_')}_${level}_${index + 1}`,
          title: template.name,
          description: template.description,
          difficulty: level.charAt(0).toUpperCase() + level.slice(1),
          estimatedHours: template.hours,
          technologies: technologies,
          steps: steps,
          resources: resources
        });
      });
    }
  });
  
  return projects;
};

// Get projects for a career (with generation if missing)
export const getProjectsForCareer = (career) => {
  const careerKey = career;
  const existing = careerProjects[careerKey];
  
  if (existing && 
      (existing.beginner?.length > 0 || 
       existing.intermediate?.length > 0 || 
       existing.advanced?.length > 0)) {
    return existing;
  }
  
  // Generate projects if none exist
  return generateProjectsForCareer(career);
};

export const getDifficultyLevels = () => ['beginner', 'intermediate', 'advanced'];

// Predefined projects (will be supplemented by generator)
export const careerProjects = {
  // You can keep predefined ones and the generator will fill the gaps
};