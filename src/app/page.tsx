"use client";

import { useState } from "react";
import { Activity, Dumbbell, BarChart3, Bot } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GeneratePlanForm } from "@/components/generate-plan-form";
import { AnalyzeFeedbackForm } from "@/components/analyze-feedback-form";
import { WorkoutPlanDisplay } from "@/components/workout-plan-display";
import type { GenerateWorkoutPlanOutput } from "@/ai/flows/generate-workout-plan";
import { FeedbackAnalysisDisplay } from "@/components/feedback-analysis-display";
import type { AnalyzeWorkoutFeedbackOutput } from "@/ai/flows/analyze-workout-feedback";

export default function Home() {
  const [workoutPlan, setWorkoutPlan] = useState<GenerateWorkoutPlanOutput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeWorkoutFeedbackOutput | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-4">
            <Activity className="h-12 w-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-headline">
              OptimumPulse
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ваш помощник на базе ИИ для персональных тренировок, интеллектуального отслеживания и достижения пиковой производительности.
          </p>
        </header>

        <Tabs defaultValue="generate-plan" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto mb-8">
            <TabsTrigger value="generate-plan" className="gap-2">
              <Dumbbell className="h-5 w-5" /> Создать план
            </TabsTrigger>
            <TabsTrigger value="analyze-feedback" className="gap-2">
              <BarChart3 className="h-5 w-5" /> Анализ обратной связи
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
                {workoutPlan ? (
                  <WorkoutPlanDisplay data={workoutPlan} />
                ) : (
                  <Card className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                     <CardHeader>
                      <CardTitle className="flex items-center justify-center gap-2">
                        <Bot className="h-8 w-8 text-primary" />
                        Ваш план, сгенерированный ИИ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Ваш персональный план тренировок появится здесь после его создания. Заполните форму, чтобы начать!
                      </p>
                    </CardContent>
                  </Card>
                )}
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
                        <Bot className="h-8 w-8 text-primary" />
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
        </Tabs>
      </main>
    </div>
  );
}
