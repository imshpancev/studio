"use client";

import { useState } from "react";
import { Dumbbell, BarChart3, User } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GeneratePlanForm } from "@/components/generate-plan-form";
import { AnalyzeFeedbackForm } from "@/components/analyze-feedback-form";
import { WorkoutPlanDisplay } from "@/components/workout-plan-display";
import type { GenerateWorkoutPlanOutput } from "@/ai/flows/generate-workout-plan";
import { FeedbackAnalysisDisplay } from "@/components/feedback-analysis-display";
import type { AnalyzeWorkoutFeedbackOutput } from "@/ai/flows/analyze-workout-feedback";
import { LighSportLogo } from "@/components/logo";
import { ProfilePage } from "@/components/profile-page";

export default function Home() {
  const [workoutPlan, setWorkoutPlan] = useState<GenerateWorkoutPlanOutput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeWorkoutFeedbackOutput | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-4">
            <LighSportLogo className="h-16 w-auto" />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ваш помощник на базе ИИ для персональных тренировок, интеллектуального отслеживания и достижения пиковой производительности.
          </p>
        </header>

        <Tabs defaultValue="generate-plan" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="generate-plan" className="gap-2">
              <Dumbbell className="h-5 w-5" /> Создать план
            </TabsTrigger>
            <TabsTrigger value="analyze-feedback" className="gap-2">
              <BarChart3 className="h-5 w-5" /> Анализ обратной связи
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-5 w-5" /> Профиль
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate-plan">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <Card>
                <CardHeader>
                  <CardTitle>Создайте свой план тренировок</CardTitle>
                  <CardDescription>
                    Расскажите нам о своих целях и предпочтениях, и наш ИИ разработает для вас идеальный план.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GeneratePlanForm onPlanGenerated={setWorkoutPlan} />
                </CardContent>
              </Card>
              <div className="lg:sticky top-8">
                <WorkoutPlanDisplay data={workoutPlan} />
              </div>
            </div>
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
          <TabsContent value="profile">
            <ProfilePage />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
