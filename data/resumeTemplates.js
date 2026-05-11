// data/resumeTemplates.js
export const resumeTemplates = {
  modern: {
    id: 'modern',
    name: 'Modern Clean',
    description: 'Clean, minimalist design with subtle colors',
    sections: ['summary', 'skills', 'experience', 'education', 'projects'],
    colors: {
      primary: '#2563eb',
      secondary: '#4b5563',
      background: '#ffffff',
      text: '#111827'
    },
    fonts: {
      heading: 'Inter-Bold',
      body: 'Inter-Regular'
    }
  },
  
  technical: {
    id: 'technical',
    name: 'Technical Focus',
    description: 'Emphasizes skills and projects for tech roles',
    sections: ['technicalSkills', 'projects', 'experience', 'certifications', 'education'],
    colors: {
      primary: '#059669',
      secondary: '#1f2937',
      background: '#f9fafb',
      text: '#111827'
    },
    fonts: {
      heading: 'Roboto-Bold',
      body: 'Roboto-Regular'
    }
  },
  
  creative: {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Visual design with portfolio highlights',
    sections: ['summary', 'featuredProjects', 'skills', 'experience', 'education'],
    colors: {
      primary: '#7c3aed',
      secondary: '#6b7280',
      background: '#ffffff',
      text: '#1f2937'
    },
    fonts: {
      heading: 'Poppins-Bold',
      body: 'Poppins-Regular'
    }
  },
  
  executive: {
    id: 'executive',
    name: 'Executive Profile',
    description: 'For senior roles and management positions',
    sections: ['summary', 'achievements', 'leadership', 'experience', 'education'],
    colors: {
      primary: '#1e3a8a',
      secondary: '#475569',
      background: '#f8fafc',
      text: '#0f172a'
    },
    fonts: {
      heading: 'Montserrat-Bold',
      body: 'Montserrat-Regular'
    }
  }
};