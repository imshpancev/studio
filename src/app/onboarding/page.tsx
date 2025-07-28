
'use client';

import { OnboardingForm } from "@/components/onboarding-form";
import { OptimumPulseLogo } from "@/components/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-muted/40 py-8">
            <main className="container mx-auto px-4 max-w-2xl">
                 <div className="flex justify-center items-center mb-8 gap-4">
                    <OptimumPulseLogo className="h-12 w-auto" />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Добро пожаловать в OptimumPulse!</CardTitle>
                        <CardDescription>
                            Пожалуйста, заполните информацию ниже, чтобы мы могли персонализировать ваш опыт и создать идеальный план тренировок для вас.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OnboardingForm />
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
