'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { AnalyzeWorkoutFeedbackOutput } from '@/ai/flows/analyze-workout-feedback';
import { Lightbulb, RefreshCw } from 'lucide-react';

type FeedbackAnalysisDisplayProps = {
  data: AnalyzeWorkoutFeedbackOutput;
};

export function FeedbackAnalysisDisplay({ data }: FeedbackAnalysisDisplayProps) {
  // Attempt to parse the adapted workout plan if it's a JSON string
  let formattedPlan = data.adaptedWorkoutPlan;
  try {
    const parsedJson = JSON.parse(data.adaptedWorkoutPlan);
    formattedPlan = JSON.stringify(parsedJson, null, 2);
  } catch (e) {
    // If it's not a valid JSON string, display it as is.
  }

  return (
    <ScrollArea className="h-[70vh]">
      <div className="space-y-6 pr-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Адаптированный план тренировок
            </CardTitle>
            <CardDescription>
              Ваш план был скорректирован на основе ваших отзывов.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="w-full rounded-md bg-muted p-4 text-sm overflow-x-auto">
              <code>{formattedPlan}</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              Рекомендации ИИ
            </CardTitle>
            <CardDescription>
              Предложения по улучшению ваших будущих тренировок.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recommendations.split('\n').map((rec, index) => (
                rec.trim() && (
                  <p key={index} className="text-sm">
                    {rec.replace(/^- /, '• ')}
                  </p>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
