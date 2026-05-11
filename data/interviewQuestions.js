// data/interviewQuestions.js
import careerRoadmapsFull from './careerRoadmapsFull';

// ============================================
// GENERAL INTERVIEW QUESTIONS (All Careers)
// ============================================
const generalQuestions = {
  behavioral: [
    {
      id: "general_behavioral_1",
      question: "Tell me about yourself.",
      category: "Introduction",
      sampleAnswer: "I'm a [career] with [X] years of experience. My background includes [key achievement]. I'm passionate about [area] and currently focused on [goal].",
      tips: "Keep it concise (2-3 minutes). Highlight relevant experience and what excites you about this role."
    },
    {
      id: "general_behavioral_2",
      question: "Why do you want to work here?",
      category: "Motivation",
      sampleAnswer: "I'm impressed by [company's product/mission]. I've been following your work in [area] and I believe my skills in [skills] align perfectly with what you're building.",
      tips: "Research the company thoroughly. Mention specific projects or values that resonate with you."
    },
    {
      id: "general_behavioral_3",
      question: "What are your greatest strengths?",
      category: "Strengths",
      sampleAnswer: "My greatest strength is [skill] which I've developed through [experience]. For example, I [specific achievement] which resulted in [measurable outcome].",
      tips: "Choose strengths relevant to the role. Always back with specific examples."
    },
    {
      id: "general_behavioral_4",
      question: "What is your greatest weakness?",
      category: "Weaknesses",
      sampleAnswer: "I sometimes struggle with [weakness], but I've been actively improving by [specific action]. For instance, I recently [example of improvement].",
      tips: "Choose a real weakness but show how you're addressing it. Never say 'I work too hard'."
    },
    {
      id: "general_behavioral_5",
      question: "Where do you see yourself in 5 years?",
      category: "Career Goals",
      sampleAnswer: "In 5 years, I see myself growing into a [senior role] where I can [impact]. I'm excited to continue developing my skills in [areas] while contributing to meaningful projects.",
      tips: "Show ambition but align with company growth. Mention skills you want to develop."
    },
    {
      id: "general_behavioral_6",
      question: "Tell me about a time you failed and what you learned.",
      category: "Failure",
      sampleAnswer: "In a previous project, I [situation]. It failed because [reason]. I learned to [lesson] and now I [new approach]. This experience taught me the importance of [key takeaway].",
      tips: "Choose a real failure, own it, and focus on lessons learned."
    },
    {
      id: "general_behavioral_7",
      question: "Describe a time you worked with a difficult team member.",
      category: "Collaboration",
      sampleAnswer: "I worked with someone who [challenge]. I [action taken], which helped us [positive outcome]. This taught me the value of [lesson].",
      tips: "Focus on how you handled it professionally, not blaming others."
    },
    {
      id: "general_behavioral_8",
      question: "How do you handle tight deadlines?",
      category: "Work Ethic",
      sampleAnswer: "I prioritize tasks, communicate early about challenges, and break down large tasks into manageable chunks. When facing tight deadlines, I [specific strategy].",
      tips: "Show proactive approach, not just stress tolerance."
    },
    {
      id: "general_behavioral_9",
      question: "Why are you leaving your current role?",
      category: "Transition",
      sampleAnswer: "I've learned a lot in my current role, especially [skills]. I'm now looking for new challenges where I can [goal] and contribute to [company's mission].",
      tips: "Always frame positively. Never speak negatively about current employer."
    },
    {
      id: "general_behavioral_10",
      question: "What are your salary expectations?",
      category: "Compensation",
      sampleAnswer: "Based on my experience and market research, I'm looking for a range of [range]. I'm open to discussing total compensation including benefits and growth opportunities.",
      tips: "Research industry standards. Be flexible but know your minimum."
    }
  ],
  technical: [
    {
      id: "general_technical_1",
      question: "How do you approach learning new technologies?",
      category: "Learning",
      sampleAnswer: "I start with official documentation, build a small project to test concepts, then dive deeper into advanced topics. I also follow communities and contribute to open source.",
      tips: "Show initiative and passion for growth. Mention specific resources."
    },
    {
      id: "general_technical_2",
      question: "How do you stay updated with industry trends?",
      category: "Growth",
      sampleAnswer: "I follow key thought leaders on Twitter, subscribe to newsletters like [examples], and attend local meetups. I also try to build side projects with new technologies.",
      tips: "Be specific about resources you actually use."
    },
    {
      id: "general_technical_3",
      question: "Describe your development workflow.",
      category: "Process",
      sampleAnswer: "I start by understanding requirements, then plan the architecture, write tests, implement features, review code, and deploy with CI/CD. I use tools like [tools].",
      tips: "Show you have a structured approach, not chaotic."
    },
    {
      id: "general_technical_4",
      question: "How do you debug a complex issue?",
      category: "Problem Solving",
      sampleAnswer: "I reproduce the issue, check logs, isolate components, use debugging tools, and then fix and test. I also document the solution for future reference.",
      tips: "Walk through a real example step by step."
    },
    {
      id: "general_technical_5",
      question: "How do you prioritize technical debt?",
      category: "Maintenance",
      sampleAnswer: "I assess impact vs effort. Critical issues that affect performance or security get immediate attention. I schedule refactoring during regular sprints.",
      tips: "Show balance between new features and maintenance."
    }
  ]
};

// ============================================
// CAREER-SPECIFIC QUESTION TEMPLATES
// ============================================

const careerQuestionTemplates = {
  // Frontend
  frontend: {
    behavioral: [
      {
        template: "What's your favorite frontend framework and why?",
        sample: "I prefer React because of its component-based architecture, huge ecosystem, and excellent performance with Virtual DOM. I've built [projects] with it and appreciate its flexibility."
      },
      {
        template: "How do you ensure your code is accessible?",
        sample: "I follow WCAG guidelines, use semantic HTML, add ARIA labels, test with screen readers, and ensure keyboard navigation works. I also use tools like axe and Lighthouse."
      },
      {
        template: "How do you approach responsive design?",
        sample: "I design mobile-first using CSS Grid/Flexbox, media queries, and relative units. I test on multiple devices and use tools like BrowserStack to ensure consistency."
      },
      {
        template: "What's your experience with testing frontend applications?",
        sample: "I use Jest for unit tests, React Testing Library for component tests, and Cypress for E2E. I aim for good coverage and test critical user flows."
      }
    ],
    technical: [
      {
        template: "Explain the difference between client-side and server-side rendering.",
        sample: "CSR renders content in the browser, which is good for interactive apps. SSR renders on the server, improving SEO and initial load time. Next.js combines both approaches."
      },
      {
        template: "How does the event loop work in JavaScript?",
        sample: "JavaScript is single-threaded with an event loop. Call stack handles synchronous code, web APIs handle async operations, and callback queue processes results when stack is empty."
      },
      {
        template: "What are closures and how would you use them?",
        sample: "Closures are functions that remember their lexical scope. I use them for data privacy, currying, and in React hooks to maintain state between renders."
      }
    ]
  },
  
  // Backend
  backend: {
    behavioral: [
      {
        template: "How do you design a scalable API?",
        sample: "I use RESTful principles, proper HTTP methods, pagination, rate limiting, caching with Redis, and versioning. I also document with OpenAPI and implement monitoring."
      },
      {
        template: "How do you ensure database performance?",
        sample: "I index frequently queried columns, optimize queries, use connection pooling, and implement caching. I also monitor slow queries and use database profiling tools."
      },
      {
        template: "How do you handle security in your applications?",
        sample: "I implement authentication (JWT/OAuth), input validation, parameterized queries to prevent injection, rate limiting, HTTPS, and regular security audits."
      }
    ],
    technical: [
      {
        template: "Explain the difference between SQL and NoSQL databases.",
        sample: "SQL databases are relational with strict schemas, good for complex queries. NoSQL is flexible, horizontally scalable, good for unstructured data. I choose based on use case."
      },
      {
        template: "What's the difference between authentication and authorization?",
        sample: "Authentication verifies identity (who you are). Authorization determines permissions (what you can do). I use JWT for auth and RBAC for authorization."
      },
      {
        template: "How do you handle database migrations?",
        sample: "I use migration tools like Alembic (Python) or Knex (Node) to version control schema changes. I test migrations in staging before production, and maintain rollback scripts."
      }
    ]
  },
  
  // Data
  data: {
    behavioral: [
      {
        template: "How do you approach a new data analysis project?",
        sample: "I start by understanding business goals, then gather requirements, explore data quality, clean data, perform analysis, and present findings with visualizations."
      },
      {
        template: "How do you communicate insights to non-technical stakeholders?",
        sample: "I use clear visualizations, focus on key metrics, tell a story with data, and avoid technical jargon. I always tie insights to business impact."
      }
    ],
    technical: [
      {
        template: "How do you handle missing data?",
        sample: "I assess the extent and impact. Options: remove rows (if minimal), impute (mean/median/mode), or flag missing values. The approach depends on the data and use case."
      },
      {
        template: "What's the difference between supervised and unsupervised learning?",
        sample: "Supervised learning uses labeled data for prediction (classification/regression). Unsupervised finds patterns in unlabeled data (clustering, dimensionality reduction)."
      }
    ]
  },
  
  // DevOps
  devops: {
    behavioral: [
      {
        template: "How do you handle a deployment failure?",
        sample: "I rollback immediately, communicate to stakeholders, investigate root cause, document findings, and implement preventive measures. I also review the deployment process."
      },
      {
        template: "How do you ensure high availability?",
        sample: "I design for redundancy with multiple availability zones, load balancers, auto-scaling, and disaster recovery plans. I also implement health checks and monitoring."
      }
    ],
    technical: [
      {
        template: "What's the difference between Docker and Kubernetes?",
        sample: "Docker containerizes applications. Kubernetes orchestrates containers, managing scaling, networking, and deployment across clusters."
      },
      {
        template: "How do you implement CI/CD?",
        sample: "I use GitHub Actions for CI (testing, linting) and ArgoCD for CD (GitOps deployment). I ensure fast feedback loops and automated rollbacks on failure."
      }
    ]
  },
  
  // Security
  security: {
    behavioral: [
      {
        template: "How do you stay current with security threats?",
        sample: "I follow security blogs (Krebs on Security), CVE databases, attend conferences (Black Hat), and participate in bug bounty programs."
      }
    ],
    technical: [
      {
        template: "What are the OWASP Top 10?",
        sample: "It's a list of top web vulnerabilities including injection, broken authentication, XSS, and insecure deserialization. I ensure applications are tested against these."
      }
    ]
  },
  
  // Product
  product: {
    behavioral: [
      {
        template: "How do you prioritize features?",
        sample: "I use frameworks like RICE (Reach, Impact, Confidence, Effort) or MoSCoW. I consider user feedback, business goals, and technical feasibility."
      },
      {
        template: "How do you validate product ideas?",
        sample: "I conduct user interviews, build prototypes, run A/B tests, and analyze data. I start with small experiments before committing to full development."
      }
    ],
    technical: [
      {
        template: "What metrics would you track for a new feature?",
        sample: "I track adoption rate, user engagement, retention, and business impact. I define success metrics before launch and monitor post-launch."
      }
    ]
  },
  
  // Design
  design: {
    behavioral: [
      {
        template: "How do you handle design feedback?",
        sample: "I welcome feedback as an opportunity to improve. I listen carefully, ask clarifying questions, and provide rationale for design decisions. I iterate based on feedback."
      }
    ],
    technical: [
      {
        template: "Explain your design process.",
        sample: "I start with user research, create personas, sketch wireframes, build prototypes, conduct usability testing, and iterate based on feedback."
      }
    ]
  },
  
  general: {
    behavioral: [
      {
        template: "Tell me about a time you demonstrated leadership.",
        sample: "I led a project where I coordinated a team of 3 to deliver a feature ahead of schedule by organizing daily standups and removing blockers."
      },
      {
        template: "How do you handle feedback?",
        sample: "I welcome feedback as an opportunity to improve. I listen carefully, ask clarifying questions, and implement suggestions."
      }
    ],
    technical: [
      {
        template: "How do you approach debugging?",
        sample: "I reproduce the issue, check logs, isolate components, use debugging tools, fix, and test thoroughly."
      },
      {
        template: "What's your development workflow?",
        sample: "I start with requirements, plan architecture, write tests, implement features, review code, and deploy."
      }
    ]
  }
};

// Career to template mapping
const careerTemplateMap = {
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
  'AI/ML Engineer': 'data',
  'Machine Learning Engineer': 'data',
  
  // DevOps
  'DevOps Engineer': 'devops',
  'Cloud Engineer': 'devops',
  'Site Reliability Engineer': 'devops',
  
  // Security
  'Cybersecurity Specialist': 'security',
  'Security Analyst': 'security',
  'Ethical Hacker': 'security',
  
  // Product
  'Product Manager': 'product',
  'IT Project Manager': 'product',
  
  // Design
  'UI/UX Designer': 'design',
  'Creative Technologist': 'design',
  
  // Default
  'default': 'general'
};

// Get career-specific skills from roadmap
const getCareerSkills = (career) => {
  const careerData = careerRoadmapsFull[career];
  return careerData?.skills?.slice(0, 5) || ['technical skills', 'problem-solving', 'communication'];
};

// Generate career-specific questions
const generateCareerQuestions = (career) => {
  const templateKey = careerTemplateMap[career] || 'general';
  const templates = careerQuestionTemplates[templateKey] || careerQuestionTemplates.general || {};
  const skills = getCareerSkills(career);
  
  const behavioral = [];
  const technical = [];
  
  // Add general questions (first 5)
  if (generalQuestions && generalQuestions.behavioral) {
    behavioral.push(...generalQuestions.behavioral.slice(0, 5));
  }
  if (generalQuestions && generalQuestions.technical) {
    technical.push(...generalQuestions.technical.slice(0, 3));
  }
  
  // Add career-specific behavioral questions (with safety check)
  if (templates && templates.behavioral && Array.isArray(templates.behavioral)) {
    templates.behavioral.forEach((item, index) => {
      behavioral.push({
        id: `${career.replace(/\s+/g, '_')}_behavioral_${index + 1}`,
        question: item.template || item.question || "Tell me about your experience in this field.",
        category: `${career} Experience`,
        sampleAnswer: item.sample || `I have experience with ${career} through projects and work.`,
        tips: `Focus on your experience with ${career}. Use specific examples.`
      });
    });
  }
  
  // Add career-specific technical questions (with safety check)
  if (templates && templates.technical && Array.isArray(templates.technical)) {
    templates.technical.forEach((item, index) => {
      technical.push({
        id: `${career.replace(/\s+/g, '_')}_technical_${index + 1}`,
        question: item.template || item.question || "What's your approach to solving technical problems?",
        category: `${career} Fundamentals`,
        sampleAnswer: item.sample || `I approach problems by breaking them down, researching solutions, and testing iteratively.`,
        tips: `Demonstrate your understanding of core ${career} concepts.`
      });
    });
  }
  
  // Add skill-based questions
  if (skills && Array.isArray(skills)) {
    skills.slice(0, 3).forEach((skill, index) => {
      technical.push({
        id: `${career.replace(/\s+/g, '_')}_skill_${index + 1}`,
        question: `Tell me about your experience with ${skill}.`,
        category: "Technical Skills",
        sampleAnswer: `I've used ${skill} in my projects. For example, I built [project] using ${skill} to achieve [result].`,
        tips: `Be specific about how you used ${skill}. Mention tools and results.`
      });
    });
  }
  
  // Ensure minimum counts
  while (behavioral.length < 5) {
    behavioral.push({
      id: `${career.replace(/\s+/g, '_')}_behavioral_fallback_${behavioral.length + 1}`,
      question: "Tell me about a challenging project you worked on and how you overcame obstacles.",
      category: "Problem Solving",
      sampleAnswer: "I worked on [project] where we faced [challenge]. I [action taken] which resulted in [positive outcome].",
      tips: "Focus on your role, the challenge, and the measurable result."
    });
  }
  
  while (technical.length < 4) {
    technical.push({
      id: `${career.replace(/\s+/g, '_')}_technical_fallback_${technical.length + 1}`,
      question: "How do you approach learning new technologies in your field?",
      category: "Growth",
      sampleAnswer: "I start with documentation, build small projects, and contribute to open source.",
      tips: "Show your passion for continuous learning."
    });
  }
  
  return {
    behavioral: behavioral.slice(0, 10),
    technical: technical.slice(0, 8)
  };
};

// Main export function
export const getQuestionsForCareer = (career) => {
  try {
    const generated = generateCareerQuestions(career);
    if (generated && generated.behavioral && generated.technical) {
      return generated;
    }
  } catch (error) {
    console.error('Error generating questions for career:', career, error);
  }
  
  // Fallback
  return {
    behavioral: [
      {
        id: "fallback_behavioral_1",
        question: "Tell me about yourself.",
        category: "Introduction",
        sampleAnswer: "I'm passionate about technology and have experience in this field. I enjoy solving problems and learning new skills.",
        tips: "Keep it concise and relevant."
      }
    ],
    technical: [
      {
        id: "fallback_technical_1",
        question: "How do you approach learning new technologies?",
        category: "Learning",
        sampleAnswer: "I start with documentation, build small projects, and practice regularly.",
        tips: "Show your learning process."
      }
    ]
  };
};

export const getQuestionCategories = () => ['behavioral', 'technical'];