// data/categoryTemplates.js
export const categoryTemplates = {
  // ============================================
  // 1. DEVELOPMENT & ENGINEERING
  // ============================================
  development: {
    courses: [
      {
        title: "The Complete Web Development Bootcamp",
        platform: "Udemy",
        url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
        duration: "62 hours",
        type: "video",
        difficulty: "beginner",
        topics: ["HTML", "CSS", "JavaScript", "React", "Node"],
        weekTags: [1, 2, 3, 4]
      },
      {
        title: "JavaScript: The Advanced Concepts",
        platform: "Udemy",
        url: "https://www.udemy.com/course/advanced-javascript-concepts/",
        duration: "25 hours",
        type: "video",
        difficulty: "advanced",
        topics: ["JavaScript", "ES6", "Closures", "Prototypes"],
        weekTags: [5, 6]
      },
      {
        title: "Git & GitHub Masterclass",
        platform: "freeCodeCamp",
        url: "https://www.freecodecamp.org/news/git-and-github-for-beginners/",
        duration: "3 hours",
        type: "article",
        difficulty: "beginner",
        topics: ["Git", "GitHub", "Version Control"],
        weekTags: [2]
      }
    ],
    articles: [
      {
        title: "Clean Code: A Beginner's Guide",
        platform: "freeCodeCamp",
        url: "https://www.freecodecamp.org/news/clean-coding-for-beginners/",
        readTime: "15 min",
        type: "article",
        topics: ["Best Practices", "Code Quality"],
        weekTags: [3]
      },
      {
        title: "Understanding Design Patterns",
        platform: "Refactoring Guru",
        url: "https://refactoring.guru/design-patterns",
        readTime: "30 min",
        type: "article",
        topics: ["Architecture", "Patterns"],
        weekTags: [6]
      }
    ],
    videos: [
      {
        title: "Learn Flexbox in 15 Minutes",
        platform: "YouTube",
        url: "https://youtu.be/fYq5PXgSsbE",
        duration: "15 min",
        type: "video",
        creator: "Web Dev Simplified",
        topics: ["CSS", "Flexbox"],
        weekTags: [1]
      },
      {
        title: "Async JavaScript Crash Course",
        platform: "YouTube",
        url: "https://youtu.be/_8gHHBlbziw",
        duration: "1 hour",
        type: "video",
        creator: "Traversy Media",
        topics: ["JavaScript", "Async", "Promises"],
        weekTags: [3]
      }
    ],
    projects: [
      {
        title: "Build a Portfolio Website",
        description: "Create a responsive portfolio to showcase your projects",
        difficulty: "intermediate",
        timeEstimate: "10 hours",
        topics: ["HTML", "CSS", "JavaScript"],
        weekTags: [7]
      },
      {
        title: "E-commerce API",
        description: "Build a RESTful API with authentication and database",
        difficulty: "advanced",
        timeEstimate: "15 hours",
        topics: ["Node", "Express", "MongoDB"],
        weekTags: [8]
      }
    ],
    tools: [
      {
        name: "VS Code",
        description: "Essential editor with extensions",
        url: "https://code.visualstudio.com/",
        type: "tool"
      },
      {
        name: "Chrome DevTools",
        description: "Debug and optimize your code",
        url: "https://developer.chrome.com/docs/devtools/",
        type: "tool"
      }
    ],
    communities: [
      {
        name: "Stack Overflow",
        url: "https://stackoverflow.com/",
        description: "Q&A for developers"
      },
      {
        name: "Dev.to",
        url: "https://dev.to/",
        description: "Developer community"
      }
    ]
  },

  // ============================================
  // 2. DATA & ANALYTICS
  // ============================================
  data: {
    courses: [
      {
        title: "Data Scientist Career Track",
        platform: "DataCamp",
        url: "https://www.datacamp.com/career-tracks/data-scientist-with-python",
        duration: "80 hours",
        type: "interactive",
        difficulty: "beginner",
        topics: ["Python", "Pandas", "Machine Learning"],
        weekTags: [1, 2, 3, 4]
      },
      {
        title: "Machine Learning Specialization",
        platform: "Coursera",
        url: "https://www.coursera.org/specializations/machine-learning-introduction",
        duration: "60 hours",
        type: "video",
        difficulty: "intermediate",
        topics: ["ML Algorithms", "Neural Networks"],
        weekTags: [5, 6, 7]
      },
      {
        title: "SQL for Data Analysis",
        platform: "Mode",
        url: "https://mode.com/sql-tutorial/",
        duration: "10 hours",
        type: "interactive",
        difficulty: "beginner",
        topics: ["SQL", "Databases"],
        weekTags: [2]
      }
    ],
    articles: [
      {
        title: "Pandas Cheat Sheet",
        platform: "DataCamp",
        url: "https://www.datacamp.com/cheat-sheet/pandas-cheat-sheet-for-data-science",
        readTime: "10 min",
        type: "reference",
        topics: ["Pandas", "Python"],
        weekTags: [2]
      },
      {
        title: "A/B Testing Guide",
        platform: "Analytics Vidhya",
        url: "https://www.analyticsvidhya.com/blog/2020/06/introduction-ab-testing/",
        readTime: "20 min",
        type: "article",
        topics: ["Statistics", "Testing"],
        weekTags: [4]
      }
    ],
    videos: [
      {
        title: "Statistics for Data Science",
        platform: "YouTube",
        url: "https://youtu.be/xxpc-HPKN28",
        duration: "2 hours",
        type: "video",
        creator: "freeCodeCamp",
        topics: ["Statistics"],
        weekTags: [1]
      },
      {
        title: "Feature Engineering",
        platform: "YouTube",
        url: "https://youtu.be/1zJprpFWmUc",
        duration: "45 min",
        type: "video",
        creator: "Kaggle",
        topics: ["Features", "Preprocessing"],
        weekTags: [4]
      }
    ],
    projects: [
      {
        title: "Customer Churn Prediction",
        description: "Build a model to predict customer churn",
        difficulty: "intermediate",
        timeEstimate: "12 hours",
        topics: ["Classification", "XGBoost"],
        weekTags: [7]
      },
      {
        title: "Sales Dashboard",
        description: "Create an interactive dashboard with Tableau",
        difficulty: "beginner",
        timeEstimate: "8 hours",
        topics: ["Visualization", "Tableau"],
        weekTags: [5]
      }
    ],
    tools: [
      {
        name: "Jupyter Notebook",
        description: "Interactive computing environment",
        url: "https://jupyter.org/",
        type: "tool"
      },
      {
        name: "Tableau Public",
        description: "Free data visualization tool",
        url: "https://public.tableau.com/",
        type: "tool"
      }
    ],
    communities: [
      {
        name: "Kaggle",
        url: "https://www.kaggle.com/",
        description: "Data science competitions"
      },
      {
        name: "r/datascience",
        url: "https://reddit.com/r/datascience",
        description: "Data science community"
      }
    ]
  },

  // ============================================
  // 3. CLOUD & INFRASTRUCTURE
  // ============================================
  cloud: {
    courses: [
      {
        title: "AWS Certified Solutions Architect",
        platform: "A Cloud Guru",
        url: "https://acloudguru.com/course/aws-certified-solutions-architect-associate",
        duration: "40 hours",
        type: "video",
        difficulty: "intermediate",
        topics: ["AWS", "EC2", "S3", "VPC"],
        weekTags: [1, 2, 3, 4]
      },
      {
        title: "Docker Mastery",
        platform: "Udemy",
        url: "https://www.udemy.com/course/docker-mastery/",
        duration: "20 hours",
        type: "video",
        difficulty: "beginner",
        topics: ["Docker", "Containers"],
        weekTags: [5, 6]
      },
      {
        title: "Kubernetes for Beginners",
        platform: "freeCodeCamp",
        url: "https://www.freecodecamp.org/news/kubernetes-for-beginners/",
        duration: "4 hours",
        type: "article",
        difficulty: "beginner",
        topics: ["Kubernetes", "Orchestration"],
        weekTags: [6]
      }
    ],
    articles: [
      {
        title: "Terraform Best Practices",
        platform: "HashiCorp",
        url: "https://www.terraform.io/docs/cloud/guides/recommended-practices/index.html",
        readTime: "25 min",
        type: "docs",
        topics: ["IaC", "Terraform"],
        weekTags: [7]
      },
      {
        title: "CI/CD Pipeline Guide",
        platform: "Atlassian",
        url: "https://www.atlassian.com/continuous-delivery/principles/ci-cd-pipeline",
        readTime: "15 min",
        type: "article",
        topics: ["CI/CD", "Jenkins"],
        weekTags: [5]
      }
    ],
    videos: [
      {
        title: "AWS in 10 Minutes",
        platform: "YouTube",
        url: "https://youtu.be/SOTamWN27tk",
        duration: "10 min",
        type: "video",
        creator: "Fireship",
        topics: ["AWS"],
        weekTags: [1]
      },
      {
        title: "Kubernetes Crash Course",
        platform: "YouTube",
        url: "https://youtu.be/ulprqHHWlng",
        duration: "1 hour",
        type: "video",
        creator: "TechWorld with Nana",
        topics: ["Kubernetes"],
        weekTags: [6]
      }
    ],
    projects: [
      {
        title: "Deploy a 3-Tier App on AWS",
        description: "Set up EC2, RDS, and load balancers",
        difficulty: "advanced",
        timeEstimate: "20 hours",
        topics: ["AWS", "VPC", "EC2"],
        weekTags: [7]
      },
      {
        title: "Containerize a Microservice",
        description: "Dockerize and deploy a microservice",
        difficulty: "intermediate",
        timeEstimate: "10 hours",
        topics: ["Docker", "Compose"],
        weekTags: [5]
      }
    ],
    tools: [
      {
        name: "AWS Free Tier",
        description: "Hands-on practice",
        url: "https://aws.amazon.com/free/",
        type: "platform"
      },
      {
        name: "Play with Docker",
        description: "Online Docker playground",
        url: "https://labs.play-with-docker.com/",
        type: "platform"
      }
    ],
    communities: [
      {
        name: "r/devops",
        url: "https://reddit.com/r/devops",
        description: "DevOps community"
      },
      {
        name: "AWS Community",
        url: "https://aws.amazon.com/community/",
        description: "Official AWS forums"
      }
    ]
  },

  // ============================================
  // 4. SECURITY
  // ============================================
  security: {
    courses: [
      {
        title: "CompTIA Security+ (SY0-601)",
        platform: "Professor Messer",
        url: "https://www.professormesser.com/security-plus/sy0-601/",
        duration: "20 hours",
        type: "video",
        difficulty: "beginner",
        topics: ["Security Basics", "Risk Management"],
        weekTags: [1, 2]
      },
      {
        title: "Practical Ethical Hacking",
        platform: "TCM Security",
        url: "https://academy.tcm-sec.com/p/practical-ethical-hacking",
        duration: "25 hours",
        type: "video",
        difficulty: "intermediate",
        topics: ["Penetration Testing", "Metasploit"],
        weekTags: [3, 4, 5]
      },
      {
        title: "Web Application Security",
        platform: "PortSwigger",
        url: "https://portswigger.net/web-security",
        duration: "15 hours",
        type: "interactive",
        difficulty: "intermediate",
        topics: ["OWASP", "SQL Injection", "XSS"],
        weekTags: [6, 7]
      }
    ],
    articles: [
      {
        title: "OWASP Top 10 Explained",
        platform: "OWASP",
        url: "https://owasp.org/Top10/",
        readTime: "30 min",
        type: "docs",
        topics: ["Vulnerabilities"],
        weekTags: [3]
      },
      {
        title: "Buffer Overflow Guide",
        platform: "Corelan",
        url: "https://www.corelan.be/index.php/2009/07/19/exploit-writing-tutorial-part-1-stack-based-overflows/",
        readTime: "45 min",
        type: "tutorial",
        topics: ["Exploitation"],
        weekTags: [5]
      }
    ],
    videos: [
      {
        title: "Metasploit for Beginners",
        platform: "YouTube",
        url: "https://youtu.be/8lR27t8qTp0",
        duration: "1 hour",
        type: "video",
        creator: "The Cyber Mentor",
        topics: ["Metasploit"],
        weekTags: [4]
      },
      {
        title: "Wireshark Tutorial",
        platform: "YouTube",
        url: "https://youtu.be/lb1Dw0elw0Q",
        duration: "45 min",
        type: "video",
        creator: "NetworkChuck",
        topics: ["Wireshark", "Network Analysis"],
        weekTags: [2]
      }
    ],
    projects: [
      {
        title: "Capture The Flag (Beginner)",
        description: "Complete TryHackMe beginner path",
        difficulty: "beginner",
        timeEstimate: "15 hours",
        platforms: ["TryHackMe"],
        weekTags: [3]
      },
      {
        title: "Bug Bounty Recon",
        description: "Set up recon workflow for bug bounty",
        difficulty: "intermediate",
        timeEstimate: "12 hours",
        topics: ["Recon", "Automation"],
        weekTags: [6]
      }
    ],
    tools: [
      {
        name: "Kali Linux",
        description: "Penetration testing OS",
        url: "https://www.kali.org/",
        type: "tool"
      },
      {
        name: "Burp Suite",
        description: "Web security testing",
        url: "https://portswigger.net/burp",
        type: "tool"
      }
    ],
    communities: [
      {
        name: "r/netsec",
        url: "https://reddit.com/r/netsec",
        description: "Network security"
      },
      {
        name: "HackerOne",
        url: "https://www.hackerone.com/",
        description: "Bug bounty platform"
      }
    ]
  },

  // ============================================
  // 5. DESIGN & CREATIVE
  // ============================================
  design: {
    courses: [
      {
        title: "Google UX Design Certificate",
        platform: "Coursera",
        url: "https://www.coursera.org/professional-certificates/google-ux-design",
        duration: "200 hours",
        type: "certification",
        difficulty: "beginner",
        topics: ["UX Research", "Wireframing", "Prototyping"],
        weekTags: [1, 2, 3, 4, 5]
      },
      {
        title: "Figma for Beginners",
        platform: "Skillshare",
        url: "https://www.skillshare.com/classes/Figma-UX-Design-For-Beginners/",
        duration: "4 hours",
        type: "video",
        difficulty: "beginner",
        topics: ["Figma", "UI Design"],
        weekTags: [2]
      },
      {
        title: "Interaction Design Foundation",
        platform: "IDF",
        url: "https://www.interaction-design.org/courses",
        duration: "Self-paced",
        type: "membership",
        difficulty: "all",
        topics: ["HCI", "Design Theory"],
        weekTags: [6, 7, 8]
      }
    ],
    articles: [
      {
        title: "10 Usability Heuristics",
        platform: "NNG",
        url: "https://www.nngroup.com/articles/ten-usability-heuristics/",
        readTime: "15 min",
        type: "article",
        topics: ["Heuristics", "Usability"],
        weekTags: [3]
      },
      {
        title: "Color Theory for Designers",
        platform: "Smashing Magazine",
        url: "https://www.smashingmagazine.com/2010/01/color-theory-for-designers-part-1-the-meaning-of-color/",
        readTime: "20 min",
        type: "article",
        topics: ["Color", "Visual Design"],
        weekTags: [4]
      }
    ],
    videos: [
      {
        title: "Figma in 30 Minutes",
        platform: "YouTube",
        url: "https://youtu.be/Gu1so3pz4bA",
        duration: "30 min",
        type: "video",
        creator: "DesignCourse",
        topics: ["Figma"],
        weekTags: [1]
      },
      {
        title: "UX Design Process",
        platform: "YouTube",
        url: "https://youtu.be/cvZmY5Sq_pU",
        duration: "45 min",
        type: "video",
        creator: "AJ&Smart",
        topics: ["UX Process"],
        weekTags: [2]
      }
    ],
    projects: [
      {
        title: "Redesign a Mobile App",
        description: "Choose an app and redesign its UI/UX",
        difficulty: "intermediate",
        timeEstimate: "15 hours",
        tools: ["Figma"],
        weekTags: [5]
      },
      {
        title: "Portfolio Case Study",
        description: "Document your design process for a project",
        difficulty: "advanced",
        timeEstimate: "10 hours",
        topics: ["Portfolio", "Case Study"],
        weekTags: [7]
      }
    ],
    tools: [
      {
        name: "Figma",
        description: "Design & prototype",
        url: "https://www.figma.com/",
        type: "tool"
      },
      {
        name: "Whimsical",
        description: "Wireframing",
        url: "https://whimsical.com/",
        type: "tool"
      }
    ],
    communities: [
      {
        name: "Designer Hangout",
        url: "https://www.designerhangout.co/",
        description: "UX community"
      },
      {
        name: "r/userexperience",
        url: "https://reddit.com/r/userexperience",
        description: "UX subreddit"
      }
    ]
  },

  // ============================================
  // 6. MANAGEMENT & STRATEGY
  // ============================================
  management: {
    courses: [
      {
        title: "Product Management Certification",
        platform: "Product School",
        url: "https://productschool.com/product-management-certification",
        duration: "6 weeks",
        type: "live",
        difficulty: "intermediate",
        topics: ["Product Strategy", "Roadmapping"],
        weekTags: [1, 2, 3]
      },
      {
        title: "Google Project Management",
        platform: "Coursera",
        url: "https://www.coursera.org/professional-certificates/google-project-management",
        duration: "100 hours",
        type: "certification",
        difficulty: "beginner",
        topics: ["Agile", "Scrum", "Waterfall"],
        weekTags: [4, 5, 6]
      },
      {
        title: "Technical Writing Course",
        platform: "Google",
        url: "https://developers.google.com/tech-writing",
        duration: "10 hours",
        type: "self-paced",
        difficulty: "beginner",
        topics: ["Documentation", "Writing"],
        weekTags: [2]
      }
    ],
    articles: [
      {
        title: "How to Write PRDs",
        platform: "Atlassian",
        url: "https://www.atlassian.com/agile/product-management/product-requirements-documents",
        readTime: "10 min",
        type: "article",
        topics: ["PRD", "Requirements"],
        weekTags: [1]
      },
      {
        title: "Stakeholder Management",
        platform: "Mind the Product",
        url: "https://www.mindtheproduct.com/stakeholder-management-for-product-managers/",
        readTime: "15 min",
        type: "article",
        topics: ["Communication"],
        weekTags: [3]
      }
    ],
    videos: [
      {
        title: "Agile in 5 Minutes",
        platform: "YouTube",
        url: "https://youtu.be/502ILHjX9EE",
        duration: "5 min",
        type: "video",
        creator: "Fireship",
        topics: ["Agile"],
        weekTags: [1]
      },
      {
        title: "Product Roadmap Workshop",
        platform: "YouTube",
        url: "https://youtu.be/RHZ9gRk7gVs",
        duration: "30 min",
        type: "video",
        creator: "Product School",
        topics: ["Roadmapping"],
        weekTags: [2]
      }
    ],
    projects: [
      {
        title: "Create a Product Roadmap",
        description: "Build a 6-month roadmap for a product",
        difficulty: "intermediate",
        timeEstimate: "8 hours",
        tools: ["ProductPlan", "Miro"],
        weekTags: [3]
      },
      {
        title: "Document an API",
        description: "Write comprehensive API documentation",
        difficulty: "beginner",
        timeEstimate: "6 hours",
        tools: ["Markdown", "Swagger"],
        weekTags: [5]
      }
    ],
    tools: [
      {
        name: "Jira",
        description: "Project tracking",
        url: "https://www.atlassian.com/software/jira",
        type: "tool"
      },
      {
        name: "Miro",
        description: "Collaborative whiteboarding",
        url: "https://miro.com/",
        type: "tool"
      }
    ],
    communities: [
      {
        name: "Mind the Product",
        url: "https://www.mindtheproduct.com/",
        description: "Product community"
      },
      {
        name: "Product Coalition",
        url: "https://productcoalition.com/",
        description: "Product management publication"
      }
    ]
  },

  // ============================================
  // 7. HARDWARE & EMBEDDED
  // ============================================
  hardware: {
    courses: [
      {
        title: "Embedded Systems Essentials",
        platform: "Coursera",
        url: "https://www.coursera.org/specializations/embedded-systems",
        duration: "80 hours",
        type: "specialization",
        difficulty: "intermediate",
        topics: ["C", "Microcontrollers", "RTOS"],
        weekTags: [1, 2, 3, 4]
      },
      {
        title: "Arduino Step by Step",
        platform: "Udemy",
        url: "https://www.udemy.com/course/arduino-step-by-step-getting-started/",
        duration: "15 hours",
        type: "video",
        difficulty: "beginner",
        topics: ["Arduino", "C++", "Sensors"],
        weekTags: [5, 6]
      },
      {
        title: "Raspberry Pi for Beginners",
        platform: "Raspberry Pi Foundation",
        url: "https://www.raspberrypi.org/learn/",
        duration: "10 hours",
        type: "interactive",
        difficulty: "beginner",
        topics: ["RPi", "Python", "GPIO"],
        weekTags: [3]
      }
    ],
    articles: [
      {
        title: "Intro to PCB Design",
        platform: "EasyEDA",
        url: "https://easyeda.com/tutorials",
        readTime: "20 min",
        type: "tutorial",
        topics: ["PCB", "Schematic"],
        weekTags: [5]
      },
      {
        title: "I2C vs SPI",
        platform: "Circuit Basics",
        url: "https://www.circuitbasics.com/i2c-vs-spi-protocols/",
        readTime: "15 min",
        type: "article",
        topics: ["Communication Protocols"],
        weekTags: [2]
      }
    ],
    videos: [
      {
        title: "Electronics 101",
        platform: "YouTube",
        url: "https://youtu.be/mcXoOp9xq3c",
        duration: "1 hour",
        type: "video",
        creator: "GreatScott!",
        topics: ["Electronics"],
        weekTags: [1]
      },
      {
        title: "Arduino vs ESP32",
        platform: "YouTube",
        url: "https://youtu.be/1gB5rX0v9gk",
        duration: "20 min",
        type: "video",
        creator: "Andreas Spiess",
        topics: ["Microcontrollers"],
        weekTags: [4]
      }
    ],
    projects: [
      {
        title: "Home Automation System",
        description: "Build a smart home controller with ESP32",
        difficulty: "advanced",
        timeEstimate: "25 hours",
        topics: ["ESP32", "Sensors", "MQTT"],
        weekTags: [7]
      },
      {
        title: "Weather Station",
        description: "Create a weather monitoring station",
        difficulty: "intermediate",
        timeEstimate: "12 hours",
        topics: ["Arduino", "Sensors", "LCD"],
        weekTags: [5]
      }
    ],
    tools: [
      {
        name: "Arduino IDE",
        description: "Programming microcontrollers",
        url: "https://www.arduino.cc/en/software",
        type: "tool"
      },
      {
        name: "Fritzing",
        description: "Circuit design",
        url: "https://fritzing.org/",
        type: "tool"
      }
    ],
    communities: [
      {
        name: "r/embedded",
        url: "https://reddit.com/r/embedded",
        description: "Embedded systems"
      },
      {
        name: "Hackster.io",
        url: "https://www.hackster.io/",
        description: "Hardware projects"
      }
    ]
  },

  // ============================================
  // 8. NETWORKING & INFRASTRUCTURE
  // ============================================
  networking: {
    courses: [
      {
        title: "Cisco CCNA 200-301",
        platform: "Cisco Networking Academy",
        url: "https://www.netacad.com/courses/ccna-introduction-networks",
        duration: "70 hours",
        type: "certification",
        difficulty: "intermediate",
        topics: ["Routing", "Switching", "TCP/IP"],
        weekTags: [1, 2, 3, 4, 5, 6]
      },
      {
        title: "Network+ (N10-008)",
        platform: "Professor Messer",
        url: "https://www.professormesser.com/network-plus/n10-008/",
        duration: "15 hours",
        type: "video",
        difficulty: "beginner",
        topics: ["Networking Basics", "OSI Model"],
        weekTags: [1, 2]
      },
      {
        title: "Wireshark for Beginners",
        platform: "Udemy",
        url: "https://www.udemy.com/course/wireshark-for-beginners/",
        duration: "8 hours",
        type: "video",
        difficulty: "beginner",
        topics: ["Packet Analysis"],
        weekTags: [3]
      }
    ],
    articles: [
      {
        title: "Subnetting Explained",
        platform: "Cisco",
        url: "https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html",
        readTime: "20 min",
        type: "docs",
        topics: ["Subnetting", "IP Addressing"],
        weekTags: [2]
      },
      {
        title: "OSPF Deep Dive",
        platform: "NetworkLessons",
        url: "https://networklessons.com/ospf/ospf-overview",
        readTime: "25 min",
        type: "tutorial",
        topics: ["OSPF", "Routing"],
        weekTags: [4]
      }
    ],
    videos: [
      {
        title: "Subnetting Made Easy",
        platform: "YouTube",
        url: "https://youtu.be/ecCuyq-Wprc",
        duration: "30 min",
        type: "video",
        creator: "NetworkChuck",
        topics: ["Subnetting"],
        weekTags: [2]
      },
      {
        title: "VLANs Explained",
        platform: "YouTube",
        url: "https://youtu.be/u2FcDNSnA-8",
        duration: "20 min",
        type: "video",
        creator: "David Bombal",
        topics: ["VLANs"],
        weekTags: [3]
      }
    ],
    projects: [
      {
        title: "Build a Home Lab",
        description: "Set up GNS3 or Packet Tracer lab",
        difficulty: "intermediate",
        timeEstimate: "15 hours",
        tools: ["GNS3", "EVE-NG"],
        weekTags: [5]
      },
      {
        title: "Configure OSPF Network",
        description: "Design and configure multi-area OSPF",
        difficulty: "advanced",
        timeEstimate: "10 hours",
        topics: ["OSPF", "Routing"],
        weekTags: [6]
      }
    ],
    tools: [
      {
        name: "Wireshark",
        description: "Packet analyzer",
        url: "https://www.wireshark.org/",
        type: "tool"
      },
      {
        name: "Packet Tracer",
        description: "Network simulator",
        url: "https://www.netacad.com/courses/packet-tracer",
        type: "tool"
      }
    ],
    communities: [
      {
        name: "r/networking",
        url: "https://reddit.com/r/networking",
        description: "Network professionals"
      },
      {
        name: "Cisco Community",
        url: "https://community.cisco.com/",
        description: "Official Cisco forums"
      }
    ]
  },

  // ============================================
  // 9. GENERAL (Fallback for any career not categorized)
  // ============================================
  general: {
    courses: [
      {
        title: "Career Fundamentals",
        platform: "LinkedIn Learning",
        url: "https://www.linkedin.com/learning/",
        duration: "20 hours",
        type: "video",
        difficulty: "beginner",
        topics: ["Basics", "Industry Overview"],
        weekTags: [1, 2]
      },
      {
        title: "Hands-on Projects",
        platform: "Coursera",
        url: "https://www.coursera.org/",
        duration: "30 hours",
        type: "guided project",
        difficulty: "intermediate",
        topics: ["Practical Skills"],
        weekTags: [3, 4]
      }
    ],
    articles: [
      {
        title: "Getting Started Guide",
        platform: "Medium",
        url: "https://medium.com/",
        readTime: "10 min",
        type: "article",
        topics: ["Introduction"],
        weekTags: [1]
      },
      {
        title: "Industry Best Practices",
        platform: "Industry Blogs",
        url: "#",
        readTime: "15 min",
        type: "article",
        topics: ["Best Practices"],
        weekTags: [3]
      }
    ],
    videos: [
      {
        title: "Introduction to the Field",
        platform: "YouTube",
        url: "https://youtube.com/",
        duration: "30 min",
        type: "video",
        topics: ["Overview"],
        weekTags: [1]
      }
    ],
    projects: [
      {
        title: "Capstone Project",
        description: "Apply what you've learned",
        difficulty: "intermediate",
        timeEstimate: "15 hours",
        weekTags: [5]
      }
    ],
    tools: [
      {
        name: "Industry Tools",
        description: "Explore relevant tools",
        url: "#",
        type: "tool"
      }
    ],
    communities: [
      {
        name: "Professional Networks",
        description: "Connect with peers",
        url: "#"
      }
    ]
  }
};