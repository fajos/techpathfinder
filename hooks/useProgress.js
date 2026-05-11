// hooks/useProgress.js
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserProfileStore } from '../store/userProfileStore';
import careerRoadmapsFull from '../data/careerRoadmapsFull';

export const useProgress = (careerId) => {
  const { user } = useAuth();
  const { 
    getCurrentProfile, 
    updateRoadmapProgress,
    getCareerProgress,
    addStudySession,
    markResourceComplete
  } = useUserProfileStore();
  
  const [progress, setProgress] = useState({ stepsCompleted: [] });
  const [percentage, setPercentage] = useState(0);
  
  useEffect(() => {
    if (user && careerId) {
      const careerProgress = getCareerProgress(careerId);
      setProgress(careerProgress);
      
      const total = careerRoadmapsFull[careerId]?.roadmap?.length || 0;
      const completed = careerProgress.stepsCompleted.length;
      setPercentage(total > 0 ? (completed / total) * 100 : 0);
    }
  }, [user, careerId]);
  
  const markStepComplete = (stepIndex) => {
    if (!user) return false;
    updateRoadmapProgress(user.uid, careerId, stepIndex);
    setProgress(prev => ({
      ...prev,
      stepsCompleted: [...prev.stepsCompleted, stepIndex]
    }));
    return true;
  };
  
  const logStudyTime = (duration) => {
    if (!user) return false;
    addStudySession(user.uid, duration, careerId);
    return true;
  };
  
  const completeResource = (resourceId) => {
    if (!user) return false;
    markResourceComplete(user.uid, resourceId, careerId);
    return true;
  };
  
  return {
    progress,
    percentage,
    stepsCompleted: progress.stepsCompleted,
    markStepComplete,
    logStudyTime,
    completeResource,
    isStepCompleted: (stepIndex) => progress.stepsCompleted.includes(stepIndex)
  };
};