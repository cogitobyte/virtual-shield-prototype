
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from '@/components/Icon';
import { PermissionType } from '@/modules/types';
import { motion } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";

interface PermissionLessonProps {
  onComplete: () => void;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  permissionType: PermissionType;
  icon: string;
  scenarios: Scenario[];
  currentScenario: number;
  completed: boolean;
}

interface Scenario {
  id: string;
  description: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  answered: boolean;
  userAnswer: boolean | null;
}

export function InteractivePermissionLearning({ onComplete }: PermissionLessonProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationText, setExplanationText] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "location",
      title: "Location Privacy",
      description: "Learn about location tracking and how to control it",
      permissionType: "LOCATION",
      icon: "map-pin",
      scenarios: [
        {
          id: "location-1",
          description: "A social media app requests your precise location while using the app.",
          question: "Should you grant this permission?",
          options: [
            {
              text: "Yes, always allow",
              isCorrect: false,
              explanation: "Allowing continuous access to your location can compromise privacy. Consider 'Only while using' instead."
            },
            {
              text: "Only while using the app",
              isCorrect: true,
              explanation: "Good choice! This limits location tracking to when you're actively using the app."
            },
            {
              text: "Deny",
              isCorrect: false,
              explanation: "This would work, but some features like nearby friends might not function properly."
            }
          ],
          answered: false,
          userAnswer: null
        },
        {
          id: "location-2",
          description: "A weather app asks for background location access.",
          question: "Is this a reasonable request?",
          options: [
            {
              text: "Yes, it needs this for weather alerts",
              isCorrect: true,
              explanation: "Correct! Weather apps can use background location for timely alerts about changing conditions."
            },
            {
              text: "No, it should only need foreground access",
              isCorrect: false,
              explanation: "Weather apps often need background access to provide timely alerts for your current location."
            }
          ],
          answered: false,
          userAnswer: null
        }
      ],
      currentScenario: 0,
      completed: false
    },
    {
      id: "contacts",
      title: "Contacts Access",
      description: "Understand why apps request access to your contacts",
      permissionType: "CONTACTS",
      icon: "users",
      scenarios: [
        {
          id: "contacts-1",
          description: "A messaging app requests access to your contacts.",
          question: "Is this necessary for the app to function?",
          options: [
            {
              text: "Yes, to find friends on the platform",
              isCorrect: true,
              explanation: "Correct! Messaging apps need contacts access to help you connect with friends on the service."
            },
            {
              text: "No, I can add contacts manually",
              isCorrect: false,
              explanation: "While you could add contacts manually, this would be very time-consuming and limit functionality."
            }
          ],
          answered: false,
          userAnswer: null
        },
        {
          id: "contacts-2",
          description: "A gaming app requests access to your contacts.",
          question: "Should you grant this permission?",
          options: [
            {
              text: "Yes, always",
              isCorrect: false,
              explanation: "Most games don't need your contacts to function. Be cautious about what data you share."
            },
            {
              text: "No, unless it has social features I want",
              isCorrect: true,
              explanation: "Good decision! Only grant contacts access if the app has specific social features you want to use."
            }
          ],
          answered: false,
          userAnswer: null
        }
      ],
      currentScenario: 0,
      completed: false
    },
    {
      id: "camera",
      title: "Camera Access",
      description: "Learn when to grant camera permissions",
      permissionType: "FILE_ACCESS",
      icon: "camera",
      scenarios: [
        {
          id: "camera-1",
          description: "A photo editing app requests camera access.",
          question: "Is this request appropriate?",
          options: [
            {
              text: "Yes, it needs this to function",
              isCorrect: true,
              explanation: "Correct! A photo editing app needs camera access to take photos for editing."
            },
            {
              text: "No, it should only need gallery access",
              isCorrect: false,
              explanation: "While gallery access is needed, camera access allows you to directly take and edit photos."
            }
          ],
          answered: false,
          userAnswer: null
        },
        {
          id: "camera-2",
          description: "A calculator app requests camera access during setup.",
          question: "Does this seem suspicious?",
          options: [
            {
              text: "No, it might need it for scanning",
              isCorrect: false,
              explanation: "Standard calculators don't need camera access. This could be a privacy risk."
            },
            {
              text: "Yes, this is unnecessary for a calculator",
              isCorrect: true,
              explanation: "Good instinct! A basic calculator app has no legitimate need for camera access."
            }
          ],
          answered: false,
          userAnswer: null
        }
      ],
      currentScenario: 0,
      completed: false
    }
  ]);

  const currentLesson = lessons[currentLessonIndex];
  const currentScenario = currentLesson.scenarios[currentLesson.currentScenario];

  const handleAnswerSelect = (isCorrect: boolean, explanation: string) => {
    setIsCorrect(isCorrect);
    setExplanationText(explanation);
    setShowExplanation(true);
    
    // Update the lesson state
    const updatedLessons = [...lessons];
    const lesson = updatedLessons[currentLessonIndex];
    lesson.scenarios[lesson.currentScenario].answered = true;
    lesson.scenarios[lesson.currentScenario].userAnswer = isCorrect;
    setLessons(updatedLessons);
    
    // Calculate progress
    const totalScenarios = updatedLessons.reduce((sum, lesson) => sum + lesson.scenarios.length, 0);
    const answeredScenarios = updatedLessons.reduce((sum, lesson) => 
      sum + lesson.scenarios.filter(s => s.answered).length, 0);
    
    setProgress(Math.round((answeredScenarios / totalScenarios) * 100));
  };

  const moveToNextScenario = () => {
    setShowExplanation(false);
    setIsCorrect(null);
    
    const updatedLessons = [...lessons];
    const lesson = updatedLessons[currentLessonIndex];
    
    // Check if there are more scenarios in this lesson
    if (lesson.currentScenario < lesson.scenarios.length - 1) {
      lesson.currentScenario += 1;
      setLessons(updatedLessons);
      return;
    }
    
    // Mark this lesson as completed
    lesson.completed = true;
    
    // Find the next uncompleted lesson
    const nextLessonIndex = updatedLessons.findIndex((l, index) => 
      index > currentLessonIndex && !l.completed);
    
    if (nextLessonIndex !== -1) {
      setCurrentLessonIndex(nextLessonIndex);
    } else {
      // All lessons completed
      setCompleted(true);
    }
    
    setLessons(updatedLessons);
  };

  if (completed) {
    return (
      <motion.div 
        className="space-y-6 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-shield/10 border-shield/20 p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-shield-light/20 rounded-full flex items-center justify-center">
              <Icon name="check" className="w-8 h-8 text-shield" />
            </div>
            <h3 className="text-xl font-bold">Learning Complete!</h3>
            <p className="text-muted-foreground">
              You've completed all the privacy permission lessons. You're now better equipped to make informed decisions about app permissions.
            </p>
            <Button onClick={onComplete} className="w-full sm:w-auto bg-shield hover:bg-shield-dark">
              Continue to Dashboard
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">{currentLesson.title}</h3>
          <p className="text-sm text-muted-foreground">{currentLesson.description}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-shield/20 flex items-center justify-center">
          <Icon name={currentLesson.icon as any} className="h-5 w-5 text-shield" />
        </div>
      </div>
      
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-shield"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <Card className="p-6 space-y-4 bg-white shadow-md border-shield/10">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Scenario {currentLesson.currentScenario + 1} of {currentLesson.scenarios.length}
          </p>
          <p className="font-medium">{currentScenario.description}</p>
          <p className="font-semibold text-shield-dark">{currentScenario.question}</p>
        </div>
        
        {!showExplanation ? (
          <div className="space-y-3">
            {currentScenario.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(option.isCorrect, option.explanation)}
                variant="outline"
                className="w-full text-left justify-start h-auto py-3 px-4"
              >
                {option.text}
              </Button>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
          >
            <div className="flex items-start">
              <div className={`mr-3 flex-shrink-0 mt-1 rounded-full p-1 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                <Icon name={isCorrect ? "check" : "x"} className={`h-4 w-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <div>
                <p className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite right.'}
                </p>
                <p className="mt-1 text-sm">{explanationText}</p>
              </div>
            </div>
            <Button 
              onClick={moveToNextScenario} 
              className="w-full mt-4 bg-shield hover:bg-shield-dark"
            >
              Continue
            </Button>
          </motion.div>
        )}
      </Card>
      
      <div className="flex justify-between">
        <ToggleGroup type="single" value={currentLessonIndex.toString()}>
          {lessons.map((lesson, index) => (
            <ToggleGroupItem
              key={lesson.id}
              value={index.toString()}
              onClick={() => !showExplanation && setCurrentLessonIndex(index)}
              disabled={showExplanation}
              className={`${
                lesson.completed ? 'bg-shield/20 text-shield-dark' : 
                index === currentLessonIndex ? 'bg-shield text-white' : 
                'bg-gray-100'
              } px-4 py-2 rounded-md`}
            >
              <Icon name={lesson.icon as any} className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{lesson.title}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        
        <Button variant="outline" size="sm" onClick={onComplete}>
          Skip Tutorial
        </Button>
      </div>
    </div>
  );
}

export default InteractivePermissionLearning;
