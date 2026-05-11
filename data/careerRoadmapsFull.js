// data/careerRoadmapsFull.js
const careerRoadmapsFull = {
  // ============================================
  // PRODUCT & MANAGEMENT
  // ============================================
  "Product Manager": {
    title: "Product Manager",
    intro: "Product Managers lead the planning, development, and launch of digital products that meet user needs and business goals.",
    roles: ["Product Owner", "Technical Product Manager", "Product Strategist"],
    skills: [
      "Agile & Scrum", "Product Strategy", "User Research", "UX/UI Principles",
      "Data Analysis", "OKRs & KPIs", "User Story Mapping", "Competitive Analysis",
      "Roadmapping Tools", "Stakeholder Management", "A/B Testing", "Communication"
    ],
    roadmap: [
      { text: "Understand the role of a Product Manager", difficulty: "Beginner" },
      { text: "Learn Agile and Scrum methodologies", difficulty: "Beginner" },
      { text: "Master user research and customer interviews", difficulty: "Intermediate" },
      { text: "Learn to write PRDs and user stories", difficulty: "Intermediate" },
      { text: "Understand UX/UI principles", difficulty: "Intermediate" },
      { text: "Practice with roadmapping tools (Jira, ProductPlan)", difficulty: "Intermediate" },
      { text: "Learn data analysis for product decisions", difficulty: "Advanced" },
      { text: "Study OKRs and KPIs", difficulty: "Advanced" },
      { text: "Conduct competitive analysis", difficulty: "Intermediate" },
      { text: "Learn stakeholder management", difficulty: "Advanced" },
      { text: "Practice A/B testing", difficulty: "Advanced" },
      { text: "Take product case study challenges", difficulty: "Advanced" },
      { text: "Build a portfolio with mock product plans", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.atlassian.com/agile",
      "https://www.coursera.org/specializations/product-management",
      "https://www.productplan.com/learn/",
      "https://productschool.com/blog",
      "https://www.mindtheproduct.com/"
    ]
  },

  "IT Project Manager": {
    title: "IT Project Manager",
    intro: "IT Project Managers lead technical projects from planning to delivery, coordinating teams, timelines, budgets, and risks.",
    roles: ["Scrum Master", "Agile Project Manager", "Tech Program Manager"],
    skills: [
      "Agile/Scrum", "Risk Management", "Project Planning", "Stakeholder Communication",
      "Jira/Trello/Asana", "Budgeting", "SDLC", "Resource Allocation", "Vendor Management"
    ],
    roadmap: [
      { text: "Learn project management frameworks: Waterfall, Agile, Scrum", difficulty: "Beginner" },
      { text: "Understand SDLC and how dev teams operate", difficulty: "Beginner" },
      { text: "Use tools like Jira or Monday.com to track tasks", difficulty: "Intermediate" },
      { text: "Manage risks, timelines, and deliverables", difficulty: "Intermediate" },
      { text: "Develop communication plans for stakeholders", difficulty: "Intermediate" },
      { text: "Learn resource allocation and budgeting", difficulty: "Advanced" },
      { text: "Study vendor management and contracts", difficulty: "Advanced" },
      { text: "Practice agile ceremonies (standups, retrospectives)", difficulty: "Intermediate" },
      { text: "Pursue certifications like PMP, CAPM, or CSM", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.scrum.org/",
      "https://pmtraining.com/",
      "https://www.atlassian.com/agile",
      "https://www.projectmanager.com/"
    ]
  },

  // ============================================
  // DEVELOPMENT & ENGINEERING
  // ============================================
  "Frontend Developer": {
    title: "Frontend Developer",
    intro: "Frontend Developers build the user-facing parts of websites and applications using HTML, CSS, and JavaScript.",
    roles: ["UI Developer", "React Developer", "Web Developer", "Frontend Engineer"],
    skills: [
      "HTML & CSS", "JavaScript", "TypeScript", "React or Vue", 
      "Responsive Design", "Version Control (Git)", "Web Accessibility (a11y)",
      "Testing (Jest/Cypress)", "Performance Optimization", "State Management",
      "Next.js or Nuxt.js", "API Integration", "CI/CD Basics"
    ],
    roadmap: [
      { text: "Master HTML and CSS (flexbox, grid, semantic tags)", difficulty: "Beginner" },
      { text: "Learn core JavaScript (ES6+, DOM, events, fetch API)", difficulty: "Beginner" },
      { text: "Understand responsive and mobile-first design", difficulty: "Beginner" },
      { text: "Learn TypeScript fundamentals", difficulty: "Intermediate" },
      { text: "Pick a frontend framework (React, Vue, Angular)", difficulty: "Intermediate" },
      { text: "Build reusable components and manage state", difficulty: "Intermediate" },
      { text: "Learn version control (Git, GitHub)", difficulty: "Beginner" },
      { text: "Understand RESTful APIs and data fetching", difficulty: "Intermediate" },
      { text: "Learn testing (unit, integration with Jest/Cypress)", difficulty: "Intermediate" },
      { text: "Practice performance optimization and lazy loading", difficulty: "Advanced" },
      { text: "Explore build tools (Webpack, Vite, Babel)", difficulty: "Intermediate" },
      { text: "Deploy apps using Vercel, Netlify, or similar", difficulty: "Intermediate" },
      { text: "Learn a meta-framework (Next.js/Nuxt.js)", difficulty: "Advanced" },
      { text: "Create a portfolio showcasing 3–5 polished projects", difficulty: "Advanced" }
    ],
    resources: [
      "https://developer.mozilla.org/en-US/",
      "https://frontendmasters.com/",
      "https://www.freecodecamp.org/",
      "https://www.theodinproject.com/",
      "https://roadmap.sh/frontend",
      "https://react.dev/",
      "https://www.typescriptlang.org/",
      "https://vercel.com/learn",
      "https://css-tricks.com/",
      "https://github.com/getify/You-Dont-Know-JS"
    ]
  },

  "Backend Developer": {
    title: "Backend Developer",
    intro: "Backend Developers create the server-side logic, APIs, and database operations that power modern applications.",
    roles: ["Node.js Developer", "API Developer", "Backend Engineer", "Java Developer"],
    skills: [
      "Node.js/Python/Java", "API Design (REST/GraphQL)", "SQL Databases", "NoSQL Databases",
      "Authentication (JWT/OAuth)", "Testing", "Docker", "Cloud Services (AWS/Azure)",
      "Microservices", "Message Queues", "Security Best Practices", "CI/CD Basics"
    ],
    roadmap: [
      { text: "Learn a backend language (Node.js, Python, Java, or C#)", difficulty: "Beginner" },
      { text: "Understand HTTP, REST APIs, and JSON", difficulty: "Beginner" },
      { text: "Master SQL and relational databases", difficulty: "Intermediate" },
      { text: "Build REST APIs with your chosen framework", difficulty: "Intermediate" },
      { text: "Learn authentication and authorization", difficulty: "Intermediate" },
      { text: "Explore NoSQL databases (MongoDB, Firebase)", difficulty: "Intermediate" },
      { text: "Learn Docker for containerization", difficulty: "Intermediate" },
      { text: "Understand GraphQL and its benefits", difficulty: "Advanced" },
      { text: "Study microservices architecture", difficulty: "Advanced" },
      { text: "Learn message queues (RabbitMQ, Kafka)", difficulty: "Advanced" },
      { text: "Get hands-on with cloud platforms", difficulty: "Advanced" },
      { text: "Implement CI/CD pipelines", difficulty: "Advanced" },
      { text: "Build and deploy a full backend project", difficulty: "Advanced" }
    ],
    resources: [
      "https://nodejs.dev/learn",
      "https://expressjs.com/",
      "https://www.mongodb.com/university",
      "https://www.postgresql.org/docs/",
      "https://graphql.org/learn/",
      "https://www.docker.com/get-started",
      "https://aws.amazon.com/training/"
    ]
  },

  "Full Stack Developer": {
    title: "Full Stack Developer",
    intro: "Full Stack Developers build both frontend and backend of web applications, handling databases, APIs, and UI components.",
    roles: ["ME(RN) Stack Developer", "Web App Developer", "Full Stack Engineer"],
    skills: [
      "HTML/CSS/JavaScript", "TypeScript", "React or Vue", "Node.js or Python",
      "SQL & NoSQL Databases", "REST APIs", "Git", "Docker", "Cloud Basics",
      "Testing", "CI/CD", "System Design Basics"
    ],
    roadmap: [
      { text: "Master HTML, CSS, and JavaScript", difficulty: "Beginner" },
      { text: "Learn TypeScript for better code", difficulty: "Intermediate" },
      { text: "Pick a frontend framework (React, Vue)", difficulty: "Intermediate" },
      { text: "Learn a backend language (Node.js, Python)", difficulty: "Intermediate" },
      { text: "Build REST APIs with Express, FastAPI, etc.", difficulty: "Intermediate" },
      { text: "Work with SQL and NoSQL databases", difficulty: "Intermediate" },
      { text: "Connect frontend to backend", difficulty: "Intermediate" },
      { text: "Learn Git and version control", difficulty: "Beginner" },
      { text: "Understand authentication (JWT, sessions)", difficulty: "Intermediate" },
      { text: "Learn Docker basics", difficulty: "Advanced" },
      { text: "Deploy fullstack apps to cloud", difficulty: "Advanced" },
      { text: "Study system design fundamentals", difficulty: "Advanced" },
      { text: "Build a complete fullstack project", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.theodinproject.com/",
      "https://fullstackopen.com/en/",
      "https://developer.mozilla.org/en-US/",
      "https://nodejs.org/en/docs/",
      "https://react.dev/learn",
      "https://www.mongodb.com/docs/"
    ]
  },

  "Mobile Developer": {
    title: "Mobile Developer",
    intro: "Mobile Developers build responsive and native apps for Android and iOS devices using SDKs or cross-platform frameworks.",
    roles: ["Flutter Developer", "React Native Developer", "iOS Engineer", "Android Engineer"],
    skills: [
      "Flutter or React Native", "Platform-specific (Swift/Kotlin)", "Mobile UI/UX",
      "State Management", "API Integration", "Local Storage", "Push Notifications",
      "App Store Deployment", "Firebase", "Testing"
    ],
    roadmap: [
      { text: "Choose cross-platform (Flutter/React Native) or native path", difficulty: "Beginner" },
      { text: "Learn the fundamentals of your chosen framework", difficulty: "Beginner" },
      { text: "Master mobile UI layout and components", difficulty: "Intermediate" },
      { text: "Understand state management (Redux, Provider, Bloc)", difficulty: "Intermediate" },
      { text: "Learn to integrate REST APIs", difficulty: "Intermediate" },
      { text: "Work with local storage (SQLite, AsyncStorage)", difficulty: "Intermediate" },
      { text: "Add authentication and Firebase", difficulty: "Intermediate" },
      { text: "Implement push notifications", difficulty: "Advanced" },
      { text: "Test on real devices and simulators", difficulty: "Intermediate" },
      { text: "Prepare for app store deployment", difficulty: "Advanced" },
      { text: "Publish to Google Play/App Store", difficulty: "Advanced" },
      { text: "Build and launch a complete app", difficulty: "Advanced" }
    ],
    resources: [
      "https://developer.android.com/",
      "https://developer.apple.com/",
      "https://flutter.dev/docs",
      "https://reactnative.dev/docs/getting-started",
      "https://firebase.google.com/docs"
    ]
  },

  "Software Engineer": {
    title: "Software Engineer",
    intro: "Software Engineers design and build robust software systems by writing code, solving problems, and creating scalable applications.",
    roles: ["Developer", "Software Architect", "Application Engineer"],
    skills: [
      "Problem Solving", "Data Structures & Algorithms", "OOP", "Design Patterns",
      "Version Control (Git)", "Testing (Unit/Integration)", "CI/CD",
      "System Design", "Database Design", "API Design", "Cloud Basics",
      "Agile Methodologies"
    ],
    roadmap: [
      { text: "Master a programming language (Python/Java/JavaScript)", difficulty: "Beginner" },
      { text: "Learn data structures and algorithms", difficulty: "Intermediate" },
      { text: "Understand OOP and design patterns", difficulty: "Intermediate" },
      { text: "Practice problem-solving on LeetCode", difficulty: "Intermediate" },
      { text: "Learn Git and version control", difficulty: "Beginner" },
      { text: "Study testing methodologies", difficulty: "Intermediate" },
      { text: "Learn CI/CD basics", difficulty: "Advanced" },
      { text: "Study system design fundamentals", difficulty: "Advanced" },
      { text: "Learn database design and SQL", difficulty: "Intermediate" },
      { text: "Build complete projects", difficulty: "Advanced" },
      { text: "Contribute to open source", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.freecodecamp.org/",
      "https://leetcode.com/",
      "https://www.geeksforgeeks.org/",
      "https://www.coursera.org/learn/algorithms",
      "https://github.com/jwasham/coding-interview-university"
    ]
  },

  "Python Developer": {
    title: "Python Developer",
    intro: "Python Developers write clean, efficient code for apps, APIs, automations, data analysis, and web development.",
    roles: ["Backend Python Dev", "Automation Engineer", "Flask/Django Developer"],
    skills: [
      "Python", "APIs (Flask/FastAPI)", "Django", "Automation", "Testing (Pytest)",
      "SQL Databases", "Docker", "Cloud Basics", "Data Processing (Pandas)"
    ],
    roadmap: [
      { text: "Master core Python syntax", difficulty: "Beginner" },
      { text: "Learn to build APIs with Flask/FastAPI", difficulty: "Intermediate" },
      { text: "Master Django for full-stack Python", difficulty: "Advanced" },
      { text: "Automate tasks with Python scripts", difficulty: "Intermediate" },
      { text: "Test code with Pytest", difficulty: "Intermediate" },
      { text: "Work with SQL databases", difficulty: "Intermediate" },
      { text: "Learn Docker for Python apps", difficulty: "Advanced" },
      { text: "Explore data processing with Pandas", difficulty: "Advanced" },
      { text: "Deploy Python apps to cloud", difficulty: "Advanced" },
      { text: "Build complete Python projects", difficulty: "Advanced" }
    ],
    resources: [
      "https://realpython.com/",
      "https://docs.python.org/3/tutorial/",
      "https://djangoproject.com/",
      "https://fastapi.tiangolo.com/learn/",
      "https://pytest.org/"
    ]
  },

  "Application Programmer": {
    title: "Application Programmer",
    intro: "Application Programmers develop software for end-users, focusing on functionality, UI, and integration with services.",
    roles: ["Java Developer", ".NET Developer", "Enterprise App Developer"],
    skills: [
      "Java or C#", "UI Design (Swing/WPF)", "APIs", "Debugging", "Database Integration",
      "Design Patterns", "Multithreading", "Version Control"
    ],
    roadmap: [
      { text: "Pick a language like Java or C#", difficulty: "Beginner" },
      { text: "Learn app architecture & GUI design", difficulty: "Intermediate" },
      { text: "Write backend + UI logic", difficulty: "Intermediate" },
      { text: "Connect to APIs & databases", difficulty: "Intermediate" },
      { text: "Debug and build full features", difficulty: "Advanced" },
      { text: "Study design patterns", difficulty: "Advanced" },
      { text: "Learn multithreading concepts", difficulty: "Advanced" },
      { text: "Build complete desktop applications", difficulty: "Advanced" }
    ],
    resources: [
      "https://docs.oracle.com/javase/tutorial/",
      "https://learn.microsoft.com/en-us/dotnet/",
      "https://www.geeksforgeeks.org/software-engineering-introduction/"
    ]
  },

  "System Programmer": {
    title: "System Programmer",
    intro: "System Programmers develop low-level software such as operating systems, device drivers, and system utilities.",
    roles: ["C/C++ Systems Developer", "Embedded Programmer", "Kernel Engineer"],
    skills: [
      "C/C++", "Memory Management", "OS Internals", "Multithreading",
      "Assembly Basics", "Debugging Tools", "System Calls"
    ],
    roadmap: [
      { text: "Learn C/C++ syntax and compilation", difficulty: "Beginner" },
      { text: "Understand operating systems (schedulers, filesystems)", difficulty: "Intermediate" },
      { text: "Explore low-level memory concepts", difficulty: "Intermediate" },
      { text: "Write command-line utilities", difficulty: "Intermediate" },
      { text: "Learn assembly basics", difficulty: "Advanced" },
      { text: "Study kernel modules and device drivers", difficulty: "Advanced" },
      { text: "Debug with GDB and other tools", difficulty: "Advanced" },
      { text: "Build small OS or kernel modules", difficulty: "Expert" }
    ],
    resources: [
      "https://www.learn-c.org/",
      "https://wiki.osdev.org/",
      "https://www.tutorialspoint.com/unix/index.htm",
      "https://www.gnu.org/software/gdb/documentation/"
    ]
  },

  "SaaS Product Engineer": {
    title: "SaaS Product Engineer",
    intro: "SaaS Product Engineers build scalable cloud-based software products for businesses, integrating backend, frontend, and infrastructure.",
    roles: ["Full Stack Developer", "Platform Engineer", "SaaS Architect"],
    skills: [
      "React or Vue", "Node.js/Django/Rails", "REST APIs", "CI/CD", "AWS/GCP",
      "PostgreSQL", "Stripe Integration", "Multi-tenancy", "Billing Systems"
    ],
    roadmap: [
      { text: "Master a backend stack (Node, Django, or Rails)", difficulty: "Beginner" },
      { text: "Build frontends with React, Vue, or Angular", difficulty: "Intermediate" },
      { text: "Design REST APIs and authentication (OAuth/JWT)", difficulty: "Intermediate" },
      { text: "Deploy apps to cloud platforms (Vercel, AWS)", difficulty: "Intermediate" },
      { text: "Set up monitoring, billing, and analytics", difficulty: "Advanced" },
      { text: "Learn Stripe integration for payments", difficulty: "Advanced" },
      { text: "Implement multi-tenancy", difficulty: "Advanced" },
      { text: "Study product-led growth and feedback loops", difficulty: "Advanced" },
      { text: "Build and launch a SaaS product", difficulty: "Expert" }
    ],
    resources: [
      "https://vercel.com/learn",
      "https://saasbase.dev/",
      "https://buildsaas.io/",
      "https://stripe.com/docs",
      "https://aws.amazon.com/startups/"
    ]
  },

  "Video Game Developer": {
    title: "Video Game Developer",
    intro: "Video Game Developers build interactive games for PC, console, mobile, and VR platforms, blending code, creativity, and storytelling.",
    roles: ["Gameplay Programmer", "Unity Developer", "Game Engine Engineer"],
    skills: [
      "Unity or Unreal Engine", "C# or C++", "Game Loops", "Physics Engines",
      "Animation Systems", "Shaders", "Multiplayer Networking", "Optimization"
    ],
    roadmap: [
      { text: "Learn C# with Unity or C++ with Unreal Engine", difficulty: "Beginner" },
      { text: "Understand game architecture and input systems", difficulty: "Beginner" },
      { text: "Build 2D/3D scenes, characters, and animation controllers", difficulty: "Intermediate" },
      { text: "Implement player controls, UI, and game mechanics", difficulty: "Intermediate" },
      { text: "Learn about performance, rendering, and optimization", difficulty: "Advanced" },
      { text: "Study multiplayer networking", difficulty: "Advanced" },
      { text: "Explore shader programming", difficulty: "Advanced" },
      { text: "Build projects like platformers, puzzles, or shooters", difficulty: "Advanced" },
      { text: "Contribute to game jams", difficulty: "Advanced" }
    ],
    resources: [
      "https://learn.unity.com/",
      "https://www.gamedev.net/",
      "https://www.unrealengine.com/en-US/onlinelearning",
      "https://www.youtube.com/c/Brackeys"
    ]
  },

  // ============================================
  // DATA & ANALYTICS
  // ============================================
  "Data Analyst": {
    title: "Data Analyst",
    intro: "Data Analysts gather, clean, and visualize data to uncover insights that drive business decisions and performance.",
    roles: ["Business Analyst", "Reporting Analyst", "Insights Analyst"],
    skills: [
      "SQL", "Excel", "Python (Pandas)", "Data Visualization (Power BI/Tableau)",
      "Statistics", "Data Cleaning", "A/B Testing", "Data Storytelling",
      "BigQuery/Snowflake", "Business KPIs"
    ],
    roadmap: [
      { text: "Learn Excel and basic statistics", difficulty: "Beginner" },
      { text: "Master SQL for querying databases", difficulty: "Beginner" },
      { text: "Learn Python with Pandas and NumPy", difficulty: "Intermediate" },
      { text: "Understand data cleaning and wrangling", difficulty: "Intermediate" },
      { text: "Learn data visualization with Power BI or Tableau", difficulty: "Intermediate" },
      { text: "Study A/B testing fundamentals", difficulty: "Intermediate" },
      { text: "Learn data storytelling techniques", difficulty: "Advanced" },
      { text: "Explore BigQuery or Snowflake", difficulty: "Advanced" },
      { text: "Understand business KPIs and metrics", difficulty: "Intermediate" },
      { text: "Build a portfolio of analysis projects", difficulty: "Advanced" },
      { text: "Practice with real datasets (Kaggle)", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.kaggle.com/learn/data-analysis",
      "https://www.coursera.org/specializations/data-analysis",
      "https://mode.com/sql-tutorial/",
      "https://www.w3schools.com/sql/",
      "https://learn.microsoft.com/en-us/power-bi/"
    ]
  },

  "Data Scientist": {
    title: "Data Scientist",
    intro: "Data Scientists build intelligent systems that learn from data using machine learning, deep learning, and model optimization techniques.",
    roles: ["Machine Learning Engineer", "AI Developer", "Deep Learning Specialist"],
    skills: [
      "Python", "Machine Learning Algorithms", "Deep Learning (TensorFlow/PyTorch)",
      "SQL", "Data Visualization", "Statistics", "LLMs & Prompt Engineering",
      "RAG Systems", "Vector Databases", "MLOps Basics", "Model Deployment",
      "A/B Testing"
    ],
    roadmap: [
      { text: "Master Python programming", difficulty: "Beginner" },
      { text: "Understand linear algebra, calculus, and probability", difficulty: "Intermediate" },
      { text: "Learn SQL for data extraction", difficulty: "Beginner" },
      { text: "Study machine learning algorithms (supervised & unsupervised)", difficulty: "Intermediate" },
      { text: "Work with scikit-learn and real datasets", difficulty: "Intermediate" },
      { text: "Learn deep learning with TensorFlow or PyTorch", difficulty: "Advanced" },
      { text: "Build ML models for classification, regression, NLP", difficulty: "Advanced" },
      { text: "Explore LLMs and prompt engineering", difficulty: "Advanced" },
      { text: "Understand RAG systems and vector databases", difficulty: "Advanced" },
      { text: "Learn MLOps and model deployment", difficulty: "Advanced" },
      { text: "Deploy models using Flask, FastAPI, or cloud", difficulty: "Advanced" },
      { text: "Work on end-to-end ML projects", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.coursera.org/learn/machine-learning",
      "https://www.deeplearning.ai/",
      "https://scikit-learn.org/stable/",
      "https://www.kaggle.com/learn/intro-to-machine-learning",
      "https://pytorch.org/tutorials/",
      "https://huggingface.co/learn"
    ]
  },

  "Data Engineer": {
    title: "Data Engineer",
    intro: "Data Engineers build and manage pipelines that transform raw data into usable formats for analytics and machine learning.",
    roles: ["ETL Developer", "Big Data Engineer", "Analytics Engineer"],
    skills: [
      "ETL Pipelines", "SQL & NoSQL", "Apache Spark", "Data Warehousing",
      "Cloud Data Services (BigQuery/Redshift)", "Python", "Airflow",
      "Kafka", "dbt", "Data Modeling"
    ],
    roadmap: [
      { text: "Master SQL and data modeling", difficulty: "Beginner" },
      { text: "Learn Python for data processing", difficulty: "Beginner" },
      { text: "Build ETL pipelines", difficulty: "Intermediate" },
      { text: "Work with big data tools (Spark)", difficulty: "Advanced" },
      { text: "Learn orchestration with Apache Airflow", difficulty: "Advanced" },
      { text: "Understand data warehousing (BigQuery, Redshift)", difficulty: "Advanced" },
      { text: "Explore streaming data with Kafka", difficulty: "Advanced" },
      { text: "Learn dbt for transformations", difficulty: "Advanced" },
      { text: "Design scalable data pipelines", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.coursera.org/professional-certificates/data-engineering",
      "https://mode.com/sql-tutorial/",
      "https://spark.apache.org/",
      "https://cloud.google.com/certification/data-engineer",
      "https://airflow.apache.org/docs/"
    ]
  },

  "NLP Engineer": {
    title: "NLP Engineer",
    intro: "NLP Engineers work on algorithms and systems that allow computers to understand, interpret, and generate human language.",
    roles: ["Machine Learning NLP Engineer", "Language Model Developer", "Conversational AI Engineer"],
    skills: [
      "Python", "Transformers (BERT/GPT)", "HuggingFace", "Tokenization",
      "Text Processing", "RAG Systems", "LLM Fine-tuning", "Vector Databases",
      "LangChain", "Prompt Engineering"
    ],
    roadmap: [
      { text: "Master Python and ML basics", difficulty: "Beginner" },
      { text: "Understand NLP fundamentals (tokenization, stemming)", difficulty: "Intermediate" },
      { text: "Learn transformers and attention mechanisms", difficulty: "Advanced" },
      { text: "Use HuggingFace models and datasets", difficulty: "Advanced" },
      { text: "Fine-tune BERT, GPT for specific tasks", difficulty: "Advanced" },
      { text: "Build RAG systems with vector databases", difficulty: "Advanced" },
      { text: "Learn LangChain for complex workflows", difficulty: "Advanced" },
      { text: "Master prompt engineering techniques", difficulty: "Advanced" },
      { text: "Deploy NLP models to production", difficulty: "Expert" }
    ],
    resources: [
      "https://huggingface.co/learn/nlp-course",
      "https://www.coursera.org/learn/language-processing",
      "https://realpython.com/natural-language-processing-spacy/",
      "https://python.langchain.com/docs/get_started/introduction"
    ]
  },

  "Computer Vision Engineer": {
    title: "Computer Vision Engineer",
    intro: "Computer Vision Engineers develop systems that extract, analyze, and interpret visual data from images or video using AI.",
    roles: ["Vision ML Developer", "AI Imaging Engineer", "Video Analytics Engineer"],
    skills: [
      "Python", "OpenCV", "Image Processing", "Deep Learning (CNNs)",
      "YOLO/Detectron", "PyTorch/TensorFlow", "Object Detection", "Image Segmentation",
      "Model Optimization", "ONNX/TFLite"
    ],
    roadmap: [
      { text: "Master Python and NumPy", difficulty: "Beginner" },
      { text: "Learn OpenCV basics", difficulty: "Intermediate" },
      { text: "Understand image processing techniques", difficulty: "Intermediate" },
      { text: "Explore CNNs and transfer learning", difficulty: "Advanced" },
      { text: "Train models for object detection (YOLO)", difficulty: "Advanced" },
      { text: "Learn image segmentation", difficulty: "Advanced" },
      { text: "Optimize models for deployment (ONNX/TFLite)", difficulty: "Advanced" },
      { text: "Build real-time CV applications", difficulty: "Expert" }
    ],
    resources: [
      "https://opencv.org/",
      "https://www.pyimagesearch.com/",
      "https://www.udacity.com/course/computer-vision--ud810",
      "https://paperswithcode.com/task/object-detection"
    ]
  },

  "Machine Learning Ops Engineer": {
    title: "Machine Learning Ops Engineer",
    intro: "MLOps Engineers streamline the development, deployment, and monitoring of machine learning models in production environments.",
    roles: ["MLOps Specialist", "ML Engineer", "AI Infrastructure Engineer"],
    skills: [
      "Python", "ML Frameworks (TF/PyTorch)", "Docker/Kubernetes", "CI/CD for ML",
      "Model Versioning (DVC/MLflow)", "Model Monitoring", "Feature Stores",
      "Data Drift Detection", "Cloud ML Platforms", "ML Pipelines"
    ],
    roadmap: [
      { text: "Master Python and ML fundamentals", difficulty: "Intermediate" },
      { text: "Learn Docker and containerization", difficulty: "Intermediate" },
      { text: "Understand CI/CD pipelines", difficulty: "Intermediate" },
      { text: "Study model versioning with DVC/MLflow", difficulty: "Advanced" },
      { text: "Implement model monitoring", difficulty: "Advanced" },
      { text: "Learn feature stores", difficulty: "Advanced" },
      { text: "Understand data drift detection", difficulty: "Advanced" },
      { text: "Work with cloud ML platforms", difficulty: "Advanced" },
      { text: "Build ML pipelines with Kubeflow/Airflow", difficulty: "Advanced" },
      { text: "Deploy models to production", difficulty: "Advanced" }
    ],
    resources: [
      "https://mlops.community/",
      "https://cloud.google.com/architecture/mlops",
      "https://madewithml.com/",
      "https://github.com/visenger/awesome-mlops"
    ]
  },

  // ============================================
  // CLOUD & DEVOPS
  // ============================================
  "DevOps Engineer": {
    title: "DevOps Engineer",
    intro: "DevOps Engineers bridge the gap between development and operations by automating infrastructure, deployments, and CI/CD pipelines.",
    roles: ["Release Engineer", "Build Engineer", "Automation Specialist"],
    skills: [
      "Linux", "CI/CD (Jenkins/GitHub Actions)", "Docker", "Kubernetes",
      "Monitoring (Grafana/Prometheus)", "Infrastructure as Code (Terraform)",
      "Cloud Platforms (AWS/Azure/GCP)", "Scripting (Bash/Python)", "GitOps (ArgoCD)",
      "Service Mesh (Istio)", "Security Scanning", "Observability"
    ],
    roadmap: [
      { text: "Understand software development lifecycle", difficulty: "Beginner" },
      { text: "Learn Linux and shell scripting", difficulty: "Beginner" },
      { text: "Set up CI/CD pipelines with Jenkins or GitHub Actions", difficulty: "Intermediate" },
      { text: "Learn Docker and containerization", difficulty: "Intermediate" },
      { text: "Master Kubernetes for orchestration", difficulty: "Advanced" },
      { text: "Explore cloud platforms (AWS, GCP, or Azure)", difficulty: "Intermediate" },
      { text: "Implement Infrastructure as Code with Terraform", difficulty: "Advanced" },
      { text: "Learn monitoring with Prometheus and Grafana", difficulty: "Intermediate" },
      { text: "Study GitOps with ArgoCD", difficulty: "Advanced" },
      { text: "Understand service mesh (Istio)", difficulty: "Advanced" },
      { text: "Implement security scanning in pipelines", difficulty: "Advanced" },
      { text: "Build complete DevOps workflows", difficulty: "Advanced" }
    ],
    resources: [
      "https://roadmap.sh/devops",
      "https://www.udemy.com/course/devops-practical-guide/",
      "https://learn.microsoft.com/en-us/devops/",
      "https://www.freecodecamp.org/news/devops-engineer-roadmap/",
      "https://kubernetes.io/docs/",
      "https://www.terraform.io/docs"
    ]
  },

  "Cloud Engineer": {
    title: "Cloud Engineer",
    intro: "Cloud Engineers design and maintain cloud infrastructure, automate deployments, and support DevOps practices in cloud environments.",
    roles: ["Azure Cloud Engineer", "AWS Cloud Specialist", "Cloud DevOps Engineer"],
    skills: [
      "Cloud Platforms (AWS, Azure, GCP)", "Linux", "Networking (VPC, DNS)",
      "Infrastructure as Code (Terraform)", "Containers (Docker, Kubernetes)",
      "CI/CD Pipelines", "Monitoring & Logging", "Security & IAM",
      "Cloud Native Services", "Cost Optimization"
    ],
    roadmap: [
      { text: "Understand core cloud concepts (IaaS, PaaS, SaaS)", difficulty: "Beginner" },
      { text: "Pick a cloud provider (AWS, Azure, GCP)", difficulty: "Beginner" },
      { text: "Learn Linux and CLI usage", difficulty: "Beginner" },
      { text: "Understand IAM, roles, and security", difficulty: "Intermediate" },
      { text: "Master core services (EC2, S3, VPC / VM, Blob)", difficulty: "Intermediate" },
      { text: "Learn networking in cloud (VPC, DNS, Load Balancers)", difficulty: "Intermediate" },
      { text: "Get hands-on with Infrastructure as Code (Terraform)", difficulty: "Advanced" },
      { text: "Build and deploy using CI/CD tools", difficulty: "Advanced" },
      { text: "Learn containerization (Docker) and orchestration (K8s)", difficulty: "Advanced" },
      { text: "Implement monitoring and logging", difficulty: "Intermediate" },
      { text: "Study cloud security best practices", difficulty: "Advanced" },
      { text: "Learn cost optimization strategies", difficulty: "Advanced" },
      { text: "Prepare for cloud certifications", difficulty: "Advanced" }
    ],
    resources: [
      "https://learn.microsoft.com/en-us/training/azure/",
      "https://aws.amazon.com/training/",
      "https://cloud.google.com/training",
      "https://www.udemy.com/course/aws-certified-solutions-architect-associate/",
      "https://roadmap.sh/cloud-devops"
    ]
  },

  "Cloud Architect": {
    title: "Cloud Architect",
    intro: "Cloud Architects design secure, scalable cloud-based systems and guide businesses in cloud adoption strategies.",
    roles: ["Cloud Solutions Architect", "Azure Architect", "AWS Certified Architect"],
    skills: [
      "Cloud Solution Design", "Networking", "IAM & Security", "Infrastructure as Code",
      "Containers & Orchestration", "Cost Optimization", "High Availability",
      "Disaster Recovery", "Cloud Migration", "Enterprise Architecture"
    ],
    roadmap: [
      { text: "Gain deep knowledge of one or more cloud platforms", difficulty: "Advanced" },
      { text: "Learn to design secure, scalable architectures", difficulty: "Advanced" },
      { text: "Understand multi-tier deployments", difficulty: "Advanced" },
      { text: "Explore cost-effective design", difficulty: "Advanced" },
      { text: "Master high availability and DR", difficulty: "Advanced" },
      { text: "Study cloud migration strategies", difficulty: "Expert" },
      { text: "Learn enterprise architecture frameworks", difficulty: "Expert" },
      { text: "Prepare for certifications (Azure Architect, AWS SAA)", difficulty: "Expert" }
    ],
    resources: [
      "https://learn.microsoft.com/en-us/certifications/azure-solutions-architect/",
      "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
      "https://cloud.google.com/certification/cloud-architect",
      "https://www.udemy.com/course/aws-certified-solutions-architect-associate/"
    ]
  },

  "Site Reliability Engineer (SRE)": {
    title: "Site Reliability Engineer (SRE)",
    intro: "SREs ensure large-scale systems are reliable, scalable, and highly available through automation and engineering practices.",
    roles: ["Reliability Engineer", "SRE DevOps", "Infrastructure SRE"],
    skills: [
      "Linux Systems", "Monitoring & Logging", "Incident Response", "Service Level Objectives",
      "Cloud Infrastructure", "Automation (Python, Go)", "Chaos Engineering",
      "Capacity Planning", "Observability", "Troubleshooting"
    ],
    roadmap: [
      { text: "Understand SRE principles (SLI/SLO/SLA)", difficulty: "Intermediate" },
      { text: "Set up logging/monitoring tools (Prometheus, Grafana)", difficulty: "Intermediate" },
      { text: "Practice incident response & on-call scenarios", difficulty: "Intermediate" },
      { text: "Automate routine ops tasks with scripts", difficulty: "Intermediate" },
      { text: "Design fault-tolerant systems", difficulty: "Advanced" },
      { text: "Learn chaos engineering", difficulty: "Advanced" },
      { text: "Master capacity planning", difficulty: "Advanced" },
      { text: "Implement comprehensive observability", difficulty: "Advanced" }
    ],
    resources: [
      "https://sre.google/books/",
      "https://landing.google.com/sre/",
      "https://www.udemy.com/course/site-reliability-engineering-sre/",
      "https://www.pluralsight.com/paths/site-reliability-engineering"
    ]
  },

  // ============================================
  // SECURITY
  // ============================================
  "Cybersecurity Specialist": {
    title: "Cybersecurity Specialist",
    intro: "Cybersecurity Specialists protect systems and data by identifying vulnerabilities, responding to threats, and implementing defenses.",
    roles: ["Security Engineer", "SOC Analyst", "Threat Hunter", "Compliance Analyst"],
    skills: [
      "Network Security", "Risk Assessment", "Penetration Testing", "Incident Response",
      "Firewalls & IDS/IPS", "Security Compliance (GDPR/HIPAA)", "SIEM Tools (Splunk/Sentinel)",
      "Cloud Security (CSPM)", "Zero Trust", "DevSecOps", "Identity Management",
      "SOAR", "Container Security"
    ],
    roadmap: [
      { text: "Learn networking fundamentals (TCP/IP, DNS, firewalls)", difficulty: "Beginner" },
      { text: "Understand security principles (CIA triad)", difficulty: "Beginner" },
      { text: "Explore operating systems and vulnerabilities", difficulty: "Intermediate" },
      { text: "Study cryptography and malware analysis", difficulty: "Intermediate" },
      { text: "Practice with penetration testing tools", difficulty: "Intermediate" },
      { text: "Get hands-on with SIEM tools (Splunk, Sentinel)", difficulty: "Advanced" },
      { text: "Learn cloud security principles", difficulty: "Advanced" },
      { text: "Understand DevSecOps practices", difficulty: "Advanced" },
      { text: "Study compliance frameworks (GDPR, HIPAA, SOC2)", difficulty: "Advanced" },
      { text: "Get certified (Security+, CISSP, CEH)", difficulty: "Advanced" },
      { text: "Build a home lab and practice", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.cybrary.it/",
      "https://www.coursera.org/specializations/cyber-security",
      "https://tryhackme.com/",
      "https://owasp.org/",
      "https://learn.microsoft.com/en-us/azure/sentinel/"
    ]
  },

  "Security Analyst": {
    title: "Security Analyst",
    intro: "Security Analysts defend networks and systems by detecting threats, monitoring logs, and responding to incidents.",
    roles: ["SOC Analyst", "Threat Analyst", "Cybersecurity Analyst"],
    skills: [
      "Vulnerability Management", "SIEM Tools", "Threat Detection", "SOC Monitoring",
      "Risk Assessment", "Incident Response", "Log Analysis", "Threat Intelligence"
    ],
    roadmap: [
      { text: "Understand roles of a SOC and Tier 1 analyst", difficulty: "Beginner" },
      { text: "Monitor events and triage alerts in SIEM tools", difficulty: "Intermediate" },
      { text: "Analyze common threats and attack vectors", difficulty: "Intermediate" },
      { text: "Use TryHackMe or BlueTeam labs for simulations", difficulty: "Intermediate" },
      { text: "Build familiarity with real logs and events", difficulty: "Intermediate" },
      { text: "Learn incident response procedures", difficulty: "Advanced" },
      { text: "Study threat intelligence", difficulty: "Advanced" },
      { text: "Get certified (Security+, CySA+)", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.cybrary.it/",
      "https://tryhackme.com/",
      "https://www.sans.org/cyber-security-courses/security-essentials/",
      "https://learn.microsoft.com/en-us/azure/sentinel/"
    ]
  },

  "Ethical Hacker": {
    title: "Ethical Hacker",
    intro: "Ethical Hackers use offensive security techniques to test, expose, and help fix vulnerabilities in systems and applications.",
    roles: ["Penetration Tester", "Red Teamer", "Security Tester"],
    skills: [
      "Penetration Testing", "Web App Security (OWASP)", "Kali Linux", "Burp Suite",
      "Network Scanning", "Exploit Development", "Social Engineering",
      "Cloud Pentesting", "Mobile App Security", "API Security", "Active Directory"
    ],
    roadmap: [
      { text: "Learn ethical hacking fundamentals", difficulty: "Beginner" },
      { text: "Study OWASP Top 10 and real exploits", difficulty: "Intermediate" },
      { text: "Master Kali Linux and its tools", difficulty: "Intermediate" },
      { text: "Learn penetration testing tools (Nmap, Burp Suite)", difficulty: "Intermediate" },
      { text: "Practice on HackTheBox, TryHackMe", difficulty: "Intermediate" },
      { text: "Study exploit development", difficulty: "Advanced" },
      { text: "Learn cloud penetration testing", difficulty: "Advanced" },
      { text: "Understand mobile app security", difficulty: "Advanced" },
      { text: "Master API security testing", difficulty: "Advanced" },
      { text: "Learn Active Directory attacks", difficulty: "Advanced" },
      { text: "Pursue CEH or OSCP certification", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.hacker101.com/",
      "https://owasp.org/",
      "https://tryhackme.com/",
      "https://www.hackthebox.com/",
      "https://www.offsec.com/courses/pen-200/"
    ]
  },

  "Data Privacy Officer": {
    title: "Data Privacy Officer",
    intro: "Data Privacy Officers ensure that companies handle user data in compliance with laws like GDPR, HIPAA, and CCPA.",
    roles: ["Privacy Analyst", "Compliance Officer", "Data Protection Officer (DPO)"],
    skills: [
      "GDPR/CCPA/HIPAA", "Policy Writing", "Risk Assessment", "Data Governance",
      "Incident Response", "Legal Interpretation", "Privacy Impact Assessments",
      "Data Mapping", "Consent Management"
    ],
    roadmap: [
      { text: "Learn major privacy laws (GDPR, CCPA, HIPAA)", difficulty: "Beginner" },
      { text: "Understand what qualifies as PII", difficulty: "Beginner" },
      { text: "Write privacy policies", difficulty: "Intermediate" },
      { text: "Assess data lifecycle", difficulty: "Intermediate" },
      { text: "Audit systems for data leaks", difficulty: "Advanced" },
      { text: "Learn data mapping techniques", difficulty: "Advanced" },
      { text: "Study privacy impact assessments", difficulty: "Advanced" },
      { text: "Collaborate with legal teams", difficulty: "Advanced" },
      { text: "Earn certifications like CIPP/E or CIPM", difficulty: "Advanced" }
    ],
    resources: [
      "https://iapp.org/",
      "https://gdpr.eu/",
      "https://www.coursera.org/learn/introduction-to-gdpr",
      "https://hipaatraining.com/"
    ]
  },

  "Cloud Security Engineer": {
    title: "Cloud Security Engineer",
    intro: "Cloud Security Engineers protect cloud environments from threats by securing infrastructure, identity, storage, and network access.",
    roles: ["Azure Security Engineer", "Cloud Risk Analyst", "DevSecOps Engineer"],
    skills: [
      "IAM", "Encryption", "Network Security", "Cloud Workload Protection",
      "SIEM Tools", "Compliance", "Terraform Security", "CSPM",
      "Container Security", "Serverless Security"
    ],
    roadmap: [
      { text: "Learn cloud basics (IaaS, PaaS, SaaS)", difficulty: "Beginner" },
      { text: "Understand IAM, role-based access control", difficulty: "Intermediate" },
      { text: "Implement firewall rules and WAF", difficulty: "Intermediate" },
      { text: "Use CSPM tools (AWS Security Hub, Azure Security Center)", difficulty: "Advanced" },
      { text: "Learn container security", difficulty: "Advanced" },
      { text: "Study DevSecOps practices", difficulty: "Advanced" },
      { text: "Implement cloud compliance frameworks", difficulty: "Advanced" },
      { text: "Get certified (CCSP, AWS Security)", difficulty: "Advanced" }
    ],
    resources: [
      "https://learn.microsoft.com/en-us/azure/security/",
      "https://www.cyberary.it/",
      "https://cloudsecurityalliance.org/",
      "https://securitylabs.datadoghq.com/"
    ]
  },

  // ============================================
  // NETWORKING & INFRASTRUCTURE
  // ============================================
  "Network Engineer": {
    title: "Network Engineer",
    intro: "Network Engineers build and maintain secure, efficient computer networks that keep data flowing between systems and users.",
    roles: ["Network Specialist", "Infrastructure Engineer", "CCNA Engineer"],
    skills: [
      "Routing & Switching", "Network Protocols (TCP/IP)", "Firewalls", "Network Security",
      "SD-WAN", "Network Automation (Python/Ansible)", "Cloud Networking",
      "Wireless Networking", "Network Monitoring", "VPNs"
    ],
    roadmap: [
      { text: "Understand OSI Model and TCP/IP", difficulty: "Beginner" },
      { text: "Learn routing protocols (OSPF, EIGRP, BGP)", difficulty: "Intermediate" },
      { text: "Master switching (VLANs, STP, trunking)", difficulty: "Intermediate" },
      { text: "Practice with Cisco Packet Tracer or GNS3", difficulty: "Intermediate" },
      { text: "Study network security (firewalls, VPNs)", difficulty: "Advanced" },
      { text: "Learn SD-WAN technologies", difficulty: "Advanced" },
      { text: "Explore network automation with Python/Ansible", difficulty: "Advanced" },
      { text: "Understand cloud networking (AWS VPC, Azure VNet)", difficulty: "Advanced" },
      { text: "Prepare for CCNA certification", difficulty: "Advanced" },
      { text: "Work on network simulation projects", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.cisco.com/",
      "https://www.pluralsight.com/paths/network-fundamentals",
      "https://www.networklessons.com/",
      "https://networkchuck.com/",
      "https://www.gns3.com/"
    ]
  },

  "Network Administrator": {
    title: "Network Administrator",
    intro: "Network Administrators manage and troubleshoot network infrastructure, including IP addressing, firewalls, and routing.",
    roles: ["IT Infrastructure Admin", "LAN/WAN Engineer", "Security-focused Net Admin"],
    skills: [
      "Subnetting", "Firewall Rules", "Access Control", "Troubleshooting",
      "DHCP/DNS", "VPNs", "Network Monitoring", "Documentation"
    ],
    roadmap: [
      { text: "Learn about IP addressing/subnetting", difficulty: "Beginner" },
      { text: "Set up DHCP, DNS, routing", difficulty: "Beginner" },
      { text: "Configure firewalls and ACLs", difficulty: "Intermediate" },
      { text: "Monitor networks with tools", difficulty: "Intermediate" },
      { text: "Troubleshoot network issues", difficulty: "Intermediate" },
      { text: "Set up VPNs", difficulty: "Advanced" },
      { text: "Create documentation & reports", difficulty: "Intermediate" },
      { text: "Learn automation basics", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.cloudflare.com/learning/ddos/what-is-a-firewall/",
      "https://www.packetlife.net/",
      "https://nmap.org/book/"
    ]
  },

  "System Administrator": {
    title: "System Administrator",
    intro: "System Administrators manage servers, networks, and IT infrastructure to ensure uptime, security, and performance.",
    roles: ["Linux Admin", "Windows Admin", "Infrastructure Ops"],
    skills: [
      "Linux/Windows Servers", "Networking (DNS/DHCP)", "Shell Scripting (Bash/PowerShell)",
      "Monitoring Tools", "Virtualization (VMware/Hyper-V)", "Backup & Recovery",
      "Cloud Migration", "Infrastructure as Code", "Container Administration",
      "Active Directory", "Patch Management"
    ],
    roadmap: [
      { text: "Get comfortable with Linux terminal and system tools", difficulty: "Beginner" },
      { text: "Manage users, groups, and permissions", difficulty: "Beginner" },
      { text: "Configure network settings, DNS, DHCP", difficulty: "Intermediate" },
      { text: "Automate tasks with Bash or PowerShell", difficulty: "Intermediate" },
      { text: "Monitor system health with Nagios, Zabbix", difficulty: "Intermediate" },
      { text: "Manage backups and disaster recovery", difficulty: "Intermediate" },
      { text: "Learn virtualization (VMware, Hyper-V)", difficulty: "Advanced" },
      { text: "Study cloud migration strategies", difficulty: "Advanced" },
      { text: "Learn container administration (Docker)", difficulty: "Advanced" },
      { text: "Implement Infrastructure as Code", difficulty: "Advanced" },
      { text: "Manage Active Directory", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.linux.org/",
      "https://www.udemy.com/course/linux-system-administration/",
      "https://learn.microsoft.com/en-us/training/windows/",
      "https://www.vmware.com/learn"
    ]
  },

  "Database Administrator": {
    title: "Database Administrator",
    intro: "Database Administrators ensure data availability, integrity, and performance by managing and securing database systems.",
    roles: ["SQL DBA", "Database Engineer", "Data Operations Engineer"],
    skills: [
      "SQL (Advanced)", "Database Design", "Performance Tuning", "Backup & Recovery",
      "Replication", "Database Security", "Cloud Databases (RDS, Cloud SQL)",
      "NoSQL Databases", "Data Modeling", "Query Optimization"
    ],
    roadmap: [
      { text: "Master SQL syntax and complex queries", difficulty: "Beginner" },
      { text: "Understand database normalization and design", difficulty: "Intermediate" },
      { text: "Learn indexing and performance tuning", difficulty: "Intermediate" },
      { text: "Master backup and recovery procedures", difficulty: "Intermediate" },
      { text: "Study replication and high availability", difficulty: "Advanced" },
      { text: "Learn database security best practices", difficulty: "Advanced" },
      { text: "Explore cloud databases (RDS, Cloud SQL)", difficulty: "Advanced" },
      { text: "Work with NoSQL databases", difficulty: "Intermediate" },
      { text: "Learn data modeling techniques", difficulty: "Advanced" },
      { text: "Practice with real-world scenarios", difficulty: "Advanced" }
    ],
    resources: [
      "https://sqlzoo.net/",
      "https://learn.microsoft.com/en-us/sql/",
      "https://www.postgresql.org/docs/",
      "https://www.mongodb.com/docs/",
      "https://aws.amazon.com/rds/"
    ]
  },

  // ============================================
  // DESIGN & CREATIVE
  // ============================================
  "UI/UX Designer": {
    title: "UI/UX Designer",
    intro: "UI/UX Designers craft intuitive user interfaces and experiences through design thinking, wireframing, prototyping, and user research.",
    roles: ["Product Designer", "UX Researcher", "UI Designer", "Interaction Designer"],
    skills: [
      "Design Thinking", "Figma/Sketch/Adobe XD", "User Research", "Wireframing",
      "Prototyping", "Interaction Design", "Usability Testing", "Visual Design",
      "Design Systems", "Micro-interactions", "Accessibility", "UX Writing"
    ],
    roadmap: [
      { text: "Learn design thinking and user-centered design", difficulty: "Beginner" },
      { text: "Master Figma for UI design", difficulty: "Beginner" },
      { text: "Practice wireframing and prototyping", difficulty: "Intermediate" },
      { text: "Conduct user research and interviews", difficulty: "Intermediate" },
      { text: "Learn visual design principles (color, typography)", difficulty: "Intermediate" },
      { text: "Study interaction design patterns", difficulty: "Intermediate" },
      { text: "Practice usability testing", difficulty: "Advanced" },
      { text: "Build and maintain design systems", difficulty: "Advanced" },
      { text: "Learn micro-interactions and animation", difficulty: "Advanced" },
      { text: "Study accessibility standards (WCAG)", difficulty: "Advanced" },
      { text: "Create a portfolio with case studies", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.figma.com/learn/",
      "https://www.nngroup.com/articles/",
      "https://www.interaction-design.org/",
      "https://www.coursera.org/specializations/ui-ux-design",
      "https://uxplanet.org/"
    ]
  },

  "Creative Technologist": {
    title: "Creative Technologist",
    intro: "Creative Technologists blend design, storytelling, and technology to craft interactive experiences, installations, and prototypes.",
    roles: ["Interactive Designer", "Tech Artist", "Innovation Prototyper"],
    skills: [
      "JavaScript", "WebGL/Three.js", "3D Tools (Blender)", "Arduino",
      "Figma", "Design Thinking", "Generative Art", "AR/VR Basics"
    ],
    roadmap: [
      { text: "Learn creative coding tools (p5.js, Three.js)", difficulty: "Beginner" },
      { text: "Work with interactive hardware (sensors, LED)", difficulty: "Intermediate" },
      { text: "Design prototypes in Figma", difficulty: "Intermediate" },
      { text: "Integrate sound, visuals, and web technologies", difficulty: "Advanced" },
      { text: "Build creative installations", difficulty: "Advanced" },
      { text: "Experiment with WebXR, generative art", difficulty: "Advanced" },
      { text: "Learn Blender for 3D", difficulty: "Advanced" }
    ],
    resources: [
      "https://thecodingtrain.com/",
      "https://threejs.org/",
      "https://www.creativeapplications.net/",
      "https://glitch.com/",
      "https://www.blender.org/"
    ]
  },

  "Voice UX Designer": {
    title: "Voice UX Designer",
    intro: "Voice UX Designers create conversational interfaces and voice-first user experiences for devices like Alexa, Google Assistant, and chatbots.",
    roles: ["VUI Designer", "Conversation Designer", "Voice Interaction Architect"],
    skills: [
      "Conversation Design", "UX Research", "Voice Prototyping", "Storyboarding",
      "Speech Synthesis", "Dialog Flow", "Voiceflow", "Alexa Skills Kit",
      "Google Actions", "NLU Basics"
    ],
    roadmap: [
      { text: "Learn the basics of UX and conversation flow", difficulty: "Beginner" },
      { text: "Study how people interact with voice assistants", difficulty: "Beginner" },
      { text: "Use prototyping tools like Voiceflow", difficulty: "Intermediate" },
      { text: "Design intents, utterances, and voice personalities", difficulty: "Intermediate" },
      { text: "Build and test with Alexa Skills Kit", difficulty: "Advanced" },
      { text: "Create Google Actions", difficulty: "Advanced" },
      { text: "Refine interactions using user feedback", difficulty: "Advanced" }
    ],
    resources: [
      "https://learn.voiceflow.com/",
      "https://designguidelines.withgoogle.com/",
      "https://developer.amazon.com/en-US/alexa",
      "https://conversationdesigninstitute.com/"
    ]
  },

  "Instructional Designer (EdTech)": {
    title: "Instructional Designer (EdTech)",
    intro: "Instructional Designers create engaging, effective learning experiences using technology, multimedia, and learning science.",
    roles: ["E-learning Developer", "Curriculum Designer", "Learning Experience Designer"],
    skills: [
      "Instructional Design Models (ADDIE)", "LMS Platforms", "Articulate 360/Camtasia",
      "Storyboarding", "Assessment Design", "Learning Science", "Multimedia Tools",
      "SCORM/xAPI", "Accessibility"
    ],
    roadmap: [
      { text: "Study ADDIE, Bloom's Taxonomy, and learning science", difficulty: "Beginner" },
      { text: "Learn to use LMSs like Moodle or Canvas", difficulty: "Intermediate" },
      { text: "Create storyboards and wireframes", difficulty: "Intermediate" },
      { text: "Use tools like Articulate Rise, Camtasia", difficulty: "Intermediate" },
      { text: "Build quizzes, interactive content", difficulty: "Advanced" },
      { text: "Learn SCORM/xAPI standards", difficulty: "Advanced" },
      { text: "Gather learner feedback and iterate", difficulty: "Advanced" }
    ],
    resources: [
      "https://instructionaldesign.org/",
      "https://www.edapp.com/blog/instructional-design-books/",
      "https://www.linkedin.com/learning/paths/become-an-instructional-designer",
      "https://www.theelearningcoach.com/"
    ]
  },

  // ============================================
  // HARDWARE & EMBEDDED
  // ============================================
  "IoT Developer": {
    title: "IoT Developer",
    intro: "IoT Developers build smart connected devices using sensors, microcontrollers, wireless communication, and edge computing.",
    roles: ["Embedded IoT Developer", "Smart Device Engineer", "Hardware Engineer"],
    skills: [
      "Microcontrollers (Arduino/ESP32)", "C/C++/MicroPython", "Sensors & Actuators",
      "Wireless Protocols (WiFi/BT/Zigbee)", "MQTT", "Cloud IoT (AWS IoT/Azure IoT)",
      "Edge Computing", "RTOS", "PCB Design Basics", "Data Visualization"
    ],
    roadmap: [
      { text: "Learn electronics fundamentals", difficulty: "Beginner" },
      { text: "Master Arduino or ESP32 programming", difficulty: "Beginner" },
      { text: "Work with sensors and actuators", difficulty: "Intermediate" },
      { text: "Learn wireless protocols (WiFi, Bluetooth)", difficulty: "Intermediate" },
      { text: "Implement MQTT for communication", difficulty: "Intermediate" },
      { text: "Connect devices to cloud IoT platforms", difficulty: "Advanced" },
      { text: "Study edge computing concepts", difficulty: "Advanced" },
      { text: "Learn RTOS for real-time applications", difficulty: "Advanced" },
      { text: "Design basic PCBs", difficulty: "Advanced" },
      { text: "Build complete IoT projects", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.arduino.cc/",
      "https://randomnerdtutorials.com/",
      "https://www.raspberrypi.com/",
      "https://aws.amazon.com/iot/",
      "https://azure.microsoft.com/en-us/solutions/iot/"
    ]
  },

  "Embedded AI Developer": {
    title: "Embedded AI Developer",
    intro: "Embedded AI Developers integrate machine learning models into tiny hardware systems for edge computing, robotics, and smart devices.",
    roles: ["TinyML Engineer", "ML on Microcontrollers", "AI Firmware Developer"],
    skills: [
      "MicroPython/C++", "TensorFlow Lite", "Microcontrollers", "Signal Processing",
      "Model Optimization", "RTOS", "Sensor Fusion", "Edge AI"
    ],
    roadmap: [
      { text: "Learn microcontroller basics", difficulty: "Beginner" },
      { text: "Understand digital signal processing", difficulty: "Intermediate" },
      { text: "Use TensorFlow Lite for Microcontrollers", difficulty: "Advanced" },
      { text: "Optimize models for size and power", difficulty: "Advanced" },
      { text: "Deploy on edge hardware", difficulty: "Advanced" },
      { text: "Work on robotics or IoT automation", difficulty: "Advanced" },
      { text: "Join TinyML community", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.tensorflow.org/lite/microcontrollers",
      "https://tinyml.org/",
      "https://www.edgeimpulse.com/",
      "https://github.com/tinyMLx"
    ]
  },

  "Hardware Test Engineer": {
    title: "Hardware Test Engineer",
    intro: "Hardware Test Engineers design and execute test plans to validate the functionality and reliability of electronic components and devices.",
    roles: ["QA Hardware Engineer", "Test Automation Engineer", "Bench Test Technician"],
    skills: [
      "Oscilloscope/Multimeter", "Test Planning", "Scripting (Python/LabVIEW)",
      "PCB Debugging", "Embedded Systems", "Signal Analysis", "Automation Testing",
      "HIL Testing", "Compliance Testing"
    ],
    roadmap: [
      { text: "Learn electronics basics", difficulty: "Beginner" },
      { text: "Understand PCB layouts and schematics", difficulty: "Intermediate" },
      { text: "Practice test instrumentation", difficulty: "Intermediate" },
      { text: "Write test scripts to automate validation", difficulty: "Intermediate" },
      { text: "Document failures and debug issues", difficulty: "Advanced" },
      { text: "Learn HIL testing", difficulty: "Advanced" },
      { text: "Study compliance standards", difficulty: "Advanced" },
      { text: "Work with cross-functional teams", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.allaboutcircuits.com/",
      "https://learn.sparkfun.com/tutorials",
      "https://www.ti.com/tool/TINA-TI",
      "https://www.analog.com/en/education.html"
    ]
  },

  "Computer Hardware Engineer": {
    title: "Computer Hardware Engineer",
    intro: "Computer Hardware Engineers design, build, and test physical components and embedded systems for computing devices.",
    roles: ["Firmware Engineer", "Embedded Systems Engineer", "Board Design Engineer"],
    skills: [
      "Electronics", "Circuit Design", "PCB Layout", "Firmware Development",
      "Signal Integrity", "Power Management", "FPGA Basics", "Verification"
    ],
    roadmap: [
      { text: "Study electronics and schematics", difficulty: "Beginner" },
      { text: "Design and test circuits", difficulty: "Intermediate" },
      { text: "Learn PCB layout tools", difficulty: "Intermediate" },
      { text: "Work with Arduino/Raspberry Pi", difficulty: "Intermediate" },
      { text: "Build embedded firmware", difficulty: "Advanced" },
      { text: "Study signal integrity", difficulty: "Advanced" },
      { text: "Learn FPGA basics", difficulty: "Advanced" },
      { text: "Prototype physical computing projects", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.allaboutcircuits.com/",
      "https://www.tinkercad.com/",
      "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
    ]
  },

  // ============================================
  // EMERGING TECH
  // ============================================
  "Prompt Engineer": {
    title: "Prompt Engineer",
    intro: "Prompt Engineers specialize in crafting, testing, and refining text-based inputs that direct large language models like ChatGPT or Claude.",
    roles: ["AI Interaction Designer", "LLM Prompt Developer", "AI Engineer"],
    skills: [
      "Prompt Design", "LLM APIs (OpenAI/Anthropic)", "Few-shot Prompting",
      "Chain of Thought", "LangChain", "RAG Systems", "Embeddings",
      "Vector Databases", "Python", "Critical Thinking"
    ],
    roadmap: [
      { text: "Understand how LLMs work", difficulty: "Beginner" },
      { text: "Learn prompt patterns (zero-shot, few-shot, CoT)", difficulty: "Beginner" },
      { text: "Experiment with OpenAI Playground", difficulty: "Intermediate" },
      { text: "Learn Python for API integration", difficulty: "Intermediate" },
      { text: "Study LangChain for complex workflows", difficulty: "Advanced" },
      { text: "Understand RAG and embeddings", difficulty: "Advanced" },
      { text: "Work with vector databases", difficulty: "Advanced" },
      { text: "Build AI-powered applications", difficulty: "Advanced" },
      { text: "Study prompt evaluation techniques", difficulty: "Advanced" }
    ],
    resources: [
      "https://learnprompting.org/",
      "https://platform.openai.com/docs/guides/prompt-engineering",
      "https://github.com/f/awesome-chatgpt-prompts",
      "https://www.promptingguide.ai/",
      "https://python.langchain.com/docs/get_started/introduction"
    ]
  },

  "Blockchain Developer": {
    title: "Blockchain Developer",
    intro: "Blockchain Developers write smart contracts and build decentralized apps (dApps) on platforms like Ethereum, Solana, and more.",
    roles: ["Smart Contract Engineer", "Web3 Developer", "Solidity Developer"],
    skills: [
      "Solidity", "Smart Contracts", "Ethereum/EVM", "Web3.js/Ethers.js",
      "dApp Development", "Hardhat/Truffle", "Security Auditing", "IPFS",
      "DeFi Protocols", "NFT Standards", "Layer 2 Solutions"
    ],
    roadmap: [
      { text: "Understand blockchain basics (consensus, blocks)", difficulty: "Beginner" },
      { text: "Learn Solidity and write smart contracts", difficulty: "Intermediate" },
      { text: "Test and deploy contracts on testnets", difficulty: "Intermediate" },
      { text: "Build dApps using React + Web3.js", difficulty: "Intermediate" },
      { text: "Learn Hardhat/Truffle for development", difficulty: "Intermediate" },
      { text: "Study security vulnerabilities", difficulty: "Advanced" },
      { text: "Understand DeFi protocols", difficulty: "Advanced" },
      { text: "Learn NFT standards (ERC721, ERC1155)", difficulty: "Advanced" },
      { text: "Explore Layer 2 solutions", difficulty: "Advanced" },
      { text: "Build complete Web3 projects", difficulty: "Advanced" }
    ],
    resources: [
      "https://ethereum.org/en/developers/",
      "https://soliditylang.org/",
      "https://cryptozombies.io/",
      "https://learnweb3.io/",
      "https://www.web3.university/"
    ]
  },

  "Edge AI Developer": {
    title: "Edge AI Developer",
    intro: "Edge AI Developers deploy machine learning models directly to edge devices such as smartphones, sensors, and drones.",
    roles: ["Embedded ML Developer", "AI on Device Engineer", "Edge Vision Engineer"],
    skills: [
      "TinyML", "TensorFlow Lite", "ONNX", "Microcontrollers", "Optimization",
      "C/C++", "Python", "Model Quantization", "Edge Hardware"
    ],
    roadmap: [
      { text: "Learn embedded system basics", difficulty: "Beginner" },
      { text: "Train lightweight ML models", difficulty: "Intermediate" },
      { text: "Optimize models with quantization", difficulty: "Advanced" },
      { text: "Use TFLite or ONNX for deployment", difficulty: "Advanced" },
      { text: "Work with Arduino, Raspberry Pi, or NVIDIA Jetson", difficulty: "Advanced" },
      { text: "Test latency and accuracy", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.edgeimpulse.com/",
      "https://www.tensorflow.org/lite",
      "https://tinyml.org/",
      "https://developer.nvidia.com/embedded"
    ]
  },

  "AI Ethics Researcher": {
    title: "AI Ethics Researcher",
    intro: "AI Ethics Researchers investigate the social, legal, and ethical implications of AI systems and their impact on individuals and society.",
    roles: ["Responsible AI Researcher", "AI Policy Analyst", "Fairness & Bias Consultant"],
    skills: [
      "Ethical Reasoning", "Bias & Fairness", "Philosophy of Tech", "Policy Writing",
      "Research Methods", "AI Risk Analysis", "Explainability", "Privacy"
    ],
    roadmap: [
      { text: "Study philosophy, law, or sociology of technology", difficulty: "Beginner" },
      { text: "Understand how ML models generate bias", difficulty: "Intermediate" },
      { text: "Research explainability, privacy, surveillance", difficulty: "Advanced" },
      { text: "Write whitepapers and ethical impact statements", difficulty: "Advanced" },
      { text: "Collaborate with legal, product, and technical teams", difficulty: "Advanced" },
      { text: "Get involved in policy drafting", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.fatml.org/",
      "https://partnershiponai.org/",
      "https://aiethicsjournal.org/",
      "https://aiethics.org/learning/"
    ]
  },

  // ============================================
  // MARKETING & COMMUNICATIONS
  // ============================================
  "Digital Marketer": {
    title: "Digital Marketer",
    intro: "Digital Marketers use online channels like SEO, social media, and email to promote products, grow audiences, and drive sales.",
    roles: ["SEO Specialist", "Content Marketer", "Email Marketing Manager", "PPC Specialist"],
    skills: [
      "SEO/SEM", "Content Marketing", "Google Ads", "Analytics", "Email Marketing",
      "Social Media Strategy", "Marketing Automation", "CRM", "A/B Testing",
      "Conversion Rate Optimization"
    ],
    roadmap: [
      { text: "Learn fundamentals of digital marketing", difficulty: "Beginner" },
      { text: "Explore SEO, SEM, email, and social media strategies", difficulty: "Beginner" },
      { text: "Certify via Google or HubSpot", difficulty: "Intermediate" },
      { text: "Run campaigns using free tools", difficulty: "Intermediate" },
      { text: "Track results and optimize strategies", difficulty: "Intermediate" },
      { text: "Learn marketing automation", difficulty: "Advanced" },
      { text: "Study CRM integration", difficulty: "Advanced" },
      { text: "Practice A/B testing", difficulty: "Advanced" }
    ],
    resources: [
      "https://digitalmarketinginstitute.com/",
      "https://moz.com/learn/seo",
      "https://hubspot.com/",
      "https://analytics.google.com/analytics/academy/"
    ]
  },

  "Social Media Manager": {
    title: "Social Media Manager",
    intro: "Social Media Managers create content, manage campaigns, and analyze performance to build brands and engage online communities.",
    roles: ["Content Strategist", "Community Manager", "Digital Marketing Specialist"],
    skills: [
      "Content Creation", "Analytics", "Scheduling Tools (Buffer/Hootsuite)",
      "Community Engagement", "Paid Social", "Brand Strategy", "Influencer Marketing",
      "Crisis Management", "Copywriting"
    ],
    roadmap: [
      { text: "Study platform algorithms (Instagram, TikTok, LinkedIn)", difficulty: "Beginner" },
      { text: "Create a content calendar", difficulty: "Beginner" },
      { text: "Engage audiences and measure KPIs", difficulty: "Intermediate" },
      { text: "Use tools like Hootsuite, Buffer", difficulty: "Intermediate" },
      { text: "Develop a brand voice and content pillars", difficulty: "Intermediate" },
      { text: "Learn paid social advertising", difficulty: "Advanced" },
      { text: "Study influencer marketing", difficulty: "Advanced" },
      { text: "Practice crisis management", difficulty: "Advanced" }
    ],
    resources: [
      "https://buffer.com/resources",
      "https://later.com/blog/",
      "https://sproutsocial.com/insights/",
      "https://business.linkedin.com/marketing-solutions"
    ]
  },

  "Technical Writer": {
    title: "Technical Writer",
    intro: "Technical Writers translate complex technical topics into clear, concise documentation for users, developers, and stakeholders.",
    roles: ["API Writer", "Documentation Specialist", "Content Developer"],
    skills: [
      "Technical Writing", "Markdown/AsciiDoc", "API Documentation", "Information Architecture",
      "Git", "Developer Collaboration", "Style Guides", "Content Strategy",
      "Documentation Tools (Docusaurus, Sphinx)", "Accessibility Writing"
    ],
    roadmap: [
      { text: "Learn technical writing fundamentals", difficulty: "Beginner" },
      { text: "Master Markdown and documentation tools", difficulty: "Beginner" },
      { text: "Study information architecture", difficulty: "Intermediate" },
      { text: "Learn API documentation standards (OpenAPI)", difficulty: "Intermediate" },
      { text: "Practice with Git and version control", difficulty: "Intermediate" },
      { text: "Work on open source documentation", difficulty: "Advanced" },
      { text: "Learn DITA and structured writing", difficulty: "Advanced" },
      { text: "Study style guides (Google, Microsoft)", difficulty: "Intermediate" },
      { text: "Build a portfolio of documentation samples", difficulty: "Advanced" }
    ],
    resources: [
      "https://developers.google.com/tech-writing",
      "https://www.writethedocs.org/guide/",
      "https://idratherbewriting.com/",
      "https://documentation.divio.com/"
    ]
  },

  // ============================================
  // ADDITIONAL CAREERS
  // ============================================
  "Citizen Developer": {
    title: "Citizen Developer",
    intro: "Citizen Developers build apps, automations, and dashboards using no-code or low-code platforms without deep programming knowledge.",
    roles: ["No-Code App Builder", "Automation Specialist", "Business Technologist"],
    skills: [
      "Airtable", "Zapier/Make", "Bubble", "Power Apps", "Automation Logic",
      "UI/UX Basics", "Database Design (No-Code)", "API Integrations"
    ],
    roadmap: [
      { text: "Explore popular no-code platforms", difficulty: "Beginner" },
      { text: "Learn how to structure databases in Airtable", difficulty: "Beginner" },
      { text: "Automate tasks with Zapier or Make", difficulty: "Intermediate" },
      { text: "Create app UIs and logic flows without coding", difficulty: "Intermediate" },
      { text: "Deploy internal tools and MVPs", difficulty: "Intermediate" },
      { text: "Build a portfolio and consult", difficulty: "Advanced" }
    ],
    resources: [
      "https://www.nocode.tech/",
      "https://zapier.com/learn/",
      "https://bubble.io/academy",
      "https://webflow.com/learn"
    ]
  },

  "Tech Support Specialist": {
    title: "Tech Support Specialist",
    intro: "Tech Support Specialists help users resolve hardware, software, and network issues while documenting solutions and improving workflows.",
    roles: ["Help Desk Analyst", "IT Support Technician", "Desktop Support Specialist"],
    skills: [
      "Windows/Linux Admin", "Customer Support", "Troubleshooting", "Remote Tools",
      "Ticketing Systems", "Hardware Replacement", "VPN & Email Setup", "Documentation"
    ],
    roadmap: [
      { text: "Learn common OSes (Windows, Mac, Linux basics)", difficulty: "Beginner" },
      { text: "Understand hardware components", difficulty: "Beginner" },
      { text: "Use remote support tools", difficulty: "Beginner" },
      { text: "Master ticketing systems (Zendesk, Jira)", difficulty: "Intermediate" },
      { text: "Document solutions and escalation steps", difficulty: "Intermediate" },
      { text: "Study for CompTIA A+, ITIL", difficulty: "Advanced" }
    ],
    resources: [
      "https://support.google.com/",
      "https://www.comptia.org/certifications/a",
      "https://www.udemy.com/course/technical-support-fundamentals/",
      "https://www.codecademy.com/learn/intro-to-it"
    ]
  }
};

export default careerRoadmapsFull;