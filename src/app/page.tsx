
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { BarChart3, User, Map, LayoutDashboard, CalendarCheck, History, LogIn, UserPlus } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GeneratePlanForm } from "@/components/generate-plan-form";
import { AnalyzeFeedbackForm } from "@/components/analyze-feedback-form";
import type { GenerateWorkoutPlanInput, GenerateWorkoutPlanOutput } from "@/ai/flows/generate-workout-plan";
import { FeedbackAnalysisDisplay } from "@/components/feedback-analysis-display";
import type { AnalyzeWorkoutFeedbackOutput } from "@/ai/flows/analyze-workout-feedback";
import { LighSportLogo } from "@/components/logo";
import { ProfilePage } from "@/components/profile-page";
import { WorkoutTrackingPage } from "@/components/workout-tracking-page";
import { MyPlanPage } from "@/components/my-plan-page";
import { DashboardPage } from "@/components/dashboard-page";
import { WorkoutHistoryPage } from "@/components/workout-history-page";
import { Button } from "@/components/ui/button";


export default function Home() {
  const [workoutPlan, setWorkoutPlan] = useState<GenerateWorkoutPlanOutput | null>(null);
  const [workoutPlanInput, setWorkoutPlanInput] = useState<GenerateWorkoutPlanInput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeWorkoutFeedbackOutput | null>(null);
  const [activeTab, setActiveTab] = useState("my-plan");
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mock auth state

  // Load workout plan and input from localStorage on initial render
  useEffect(() => {
    const savedPlan = localStorage.getItem('workoutPlan');
    const savedInput = localStorage.getItem('workoutPlanInput');
    if (savedPlan) {
      try {
        setWorkoutPlan(JSON.parse(savedPlan));
      } catch (e) {
        console.error("Failed to parse saved workout plan", e);
        localStorage.removeItem('workoutPlan');
      }
    }
     if (savedInput) {
      try {
        setWorkoutPlanInput(JSON.parse(savedInput));
      } catch (e) {
        console.error("Failed to parse saved workout input", e);
        localStorage.removeItem('workoutPlanInput');
      }
    }
  }, []);

  const handlePlanGenerated = (plan: GenerateWorkoutPlanOutput | null, input: GenerateWorkoutPlanInput | null) => {
    setWorkoutPlan(plan);
    setWorkoutPlanInput(input);
    setIsEditingPlan(false); // Exit editing mode
    if (plan && input) {
      localStorage.setItem('workoutPlan', JSON.stringify(plan));
      localStorage.setItem('workoutPlanInput', JSON.stringify(input));
      // Switch to "My Plan" tab after generating a new plan
      setActiveTab("my-plan");
    } else {
      localStorage.removeItem('workoutPlan');
      localStorage.removeItem('workoutPlanInput');
    }
  };

  const handleStartEditing = () => {
    setIsEditingPlan(true);
    setActiveTab("my-plan");
  }


  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
             <Link href="/" className="flex items-center gap-4">
                <LighSportLogo className="h-16 w-auto" />
             </Link>
          </div>
          {isAuthenticated ? (
             <p className="text-lg md:text-xl text-muted-foreground max-w-3xl text-center">
                Ваш помощник на базе ИИ для персональных тренировок.
             </p>
          ) : (
            <div className="flex gap-2">
                <Button asChild variant="ghost">
                    <Link href="/login"><LogIn /> Войти</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup"><UserPlus /> Регистрация</Link>
                </Button>
            </div>
          )}

        </header>

       {isAuthenticated ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 md:grid-cols-6 max-w-4xl mx-auto mb-8">
            <TabsTrigger value="my-plan" className="gap-2">
              <CalendarCheck className="h-5 w-5" /> Мой план
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-5 w-5" /> Дашборд
            </TabsTrigger>
             <TabsTrigger value="history" className="gap-2">
              <History className="h-5 w-5" /> История
            </TabsTrigger>
            <TabsTrigger value="analyze-feedback" className="gap-2">
              <BarChart3 className="h-5 w-5" /> Анализ
            </TabsTrigger>
            <TabsTrigger value="maps" className="gap-2">
              <Map className="h-5 w-5" /> Карты
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-5 w-5" /> Профиль
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-plan">
             {isEditingPlan || !workoutPlan ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{workoutPlan ? 'Измените свой план' : 'Создайте свой план'}</CardTitle>
                    <CardDescription>
                      Расскажите нам о своих целях и предпочтениях, и наш ИИ разработает или обновит для вас идеальный план.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GeneratePlanForm 
                        onPlanGenerated={handlePlanGenerated} 
                        existingPlanInput={workoutPlanInput} 
                    />
                  </CardContent>
                </Card>
              ) : (
                <MyPlanPage 
                  workoutPlan={workoutPlan} 
                  onGeneratePlan={() => setIsEditingPlan(true)}
                  onEditPlan={handleStartEditing}
                />
             )}
          </TabsContent>

          <TabsContent value="dashboard">
            <DashboardPage />
          </TabsContent>
          
          <TabsContent value="history">
            <WorkoutHistoryPage />
          </TabsContent>

          <TabsContent value="analyze-feedback">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <Card>
                <CardHeader>
                  <CardTitle>Проанализируйте свою тренировку</CardTitle>
                  <CardDescription>
                    Оставьте отзыв о вашей последней тренировке, чтобы помочь нашему ИИ адаптировать и оптимизировать ваш план.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyzeFeedbackForm onAnalysisComplete={setAnalysisResult} />
                </CardContent>
              </Card>
              <div className="lg:sticky top-8">
              {analysisResult ? (
                  <FeedbackAnalysisDisplay data={analysisResult} />
                ) : (
                  <Card className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-center gap-2">
                        <User className="h-8 w-8 text-primary" />
                         Анализ на базе ИИ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Ваш анализ тренировки и рекомендации появятся здесь.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
           <TabsContent value="maps">
            <WorkoutTrackingPage />
          </TabsContent>
          <TabsContent value="profile">
            <ProfilePage />
          </TabsContent>
        </Tabs>
        ) : (
             <div className="text-center py-16">
                <Card className="max-w-lg mx-auto">
                    <CardHeader>
                        <CardTitle>Добро пожаловать в LighSport!</CardTitle>
                        <CardDescription>Ваш персональный помощник для тренировок. Пожалуйста, войдите или зарегистрируйтесь, чтобы начать.</CardDescription>
                    </CardHeader>
                     <CardContent className="flex justify-center gap-4">
                        <Button asChild>
                            <Link href="/login"><LogIn className="mr-2" /> Войти</Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link href="/signup"><UserPlus className="mr-2" /> Зарегистрироваться</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )}
      </main>
    </div>
  );
}
