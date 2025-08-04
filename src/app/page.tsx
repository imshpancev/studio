
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BarChart3, User, Rocket, History, LogIn, UserPlus, Loader2, Rss, BookOpen, Trophy, CalendarCheck, PersonStanding } from "lucide-react";
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GeneratePlanForm } from "@/components/generate-plan-form";
import type { GenerateWorkoutPlanInput, GenerateWorkoutPlanOutput } from "@/ai/flows/generate-workout-plan";
import { TheLighSportLogo } from "@/components/logo";
import { ProfilePage } from "@/components/profile-page";
import { MyPlanPage } from "@/components/my-plan-page";
import { Button } from "@/components/ui/button";
import { AnalyticsPage } from "@/components/analytics-page";
import { auth } from "@/lib/firebase";
import { QuickStartPage } from "@/components/quick-start-page";
import { NotificationBell } from "@/components/notification-bell";
import WorkoutHistoryPage from "./history/page";
import { RecordsPage } from "@/components/records-page";
import { FeedPage } from "@/components/feed-page";
import { NutritionDiaryPage } from "@/components/nutrition-diary-page";
import { getUserProfile, updateUserProfile, UserProfile } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<GenerateWorkoutPlanOutput | null>(null);
  const [workoutPlanInput, setWorkoutPlanInput] = useState<GenerateWorkoutPlanInput | null>(null);
  
  const defaultTab = searchParams.get('tab') || "analytics";
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoadingAuth(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          const profile = await getUserProfile(currentUser.uid);
          
          if (!profile || !profile.onboardingCompleted) {
            console.warn(`No profile found or onboarding incomplete for user ${currentUser.uid}, redirecting.`);
            // Sign out to clear any partial state before redirecting to login
            await auth.signOut(); 
            // The redirect to /login will be handled by the 'else' block below
            return;
          }
          
          setUserProfile(profile);

          if (profile.workoutPlan) {
            setWorkoutPlan(profile.workoutPlan);
          }
          if (profile.workoutPlanInput) {
            setWorkoutPlanInput(profile.workoutPlanInput);
          }
        } catch (e) {
          console.error("Failed to fetch user profile or plan", e);
          toast({
            variant: "destructive",
            title: "Ошибка загрузки данных",
            description: "Не удалось загрузить ваш профиль. Попробуйте перезагрузить страницу."
          })
          // Sign out if profile loading fails critically
          await auth.signOut();
        } finally {
          setLoadingAuth(false);
        }
      } else {
        // User is signed out
        setUser(null);
        setWorkoutPlan(null);
        setWorkoutPlanInput(null);
        setUserProfile(null);
        setLoadingAuth(false);
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router, toast]);

  useEffect(() => {
    // Sync URL with active tab
    if (activeTab) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('tab', activeTab);
        window.history.replaceState({ ...window.history.state, as: newUrl.href, url: newUrl.href }, '', newUrl.href);
    }
  }, [activeTab]);


  const handlePlanGenerated = async (plan: GenerateWorkoutPlanOutput | null, input: GenerateWorkoutPlanInput | null) => {
    setWorkoutPlan(plan);
    setWorkoutPlanInput(input);
    setIsEditingPlan(false);
    if (plan && input && user) {
      await updateUserProfile(user.uid, { workoutPlan: plan, workoutPlanInput: input });
      setActiveTab("my-plan");
    }
  };
  
  const handlePlanFinished = async () => {
    if (user) {
        await updateUserProfile(user.uid, { workoutPlan: null, workoutPlanInput: null });
    }
    setWorkoutPlan(null);
    setWorkoutPlanInput(null);
    setIsEditingPlan(false);
    setActiveTab('my-plan'); 
  }

  const handleStartEditing = () => {
    setIsEditingPlan(true);
    setActiveTab("my-plan");
  }
  
  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  }

  if (loadingAuth) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
    )
  }


  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
             <Link href="/" className="flex items-center gap-4">
                <TheLighSportLogo className="h-12 w-auto" />
             </Link>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
                 <p className="text-lg md:text-xl text-muted-foreground max-w-3xl text-center hidden md:block">
                    Ваш помощник на базе ИИ для персональных тренировок.
                 </p>
                 <NotificationBell />
            </div>
          ) : (
            <div className="flex gap-2">
                <Button asChild variant="ghost">
                    <Link href="/login"><LogIn className="h-5 w-5 mr-2" /> Войти</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup"><UserPlus className="h-5 w-5 mr-2" /> Регистрация</Link>
                </Button>
            </div>
          )}

        </header>

       {user && userProfile ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-5 md:grid-cols-8 max-w-6xl mx-auto mb-8">
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-5 w-5" /> <span className="hidden md:inline">Аналитика</span>
            </TabsTrigger>
             <TabsTrigger value="feed" className="gap-2">
              <Rss className="h-5 w-5" /> <span className="hidden md:inline">Лента</span>
            </TabsTrigger>
            <TabsTrigger value="my-plan" className="gap-2">
              <CalendarCheck className="h-5 w-5" /> <span className="hidden md:inline">Мой план</span>
            </TabsTrigger>
             <TabsTrigger value="quick-start" className="gap-2">
              <Rocket className="h-5 w-5" /> <span className="hidden md:inline">Быстрый старт</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="gap-2">
              <BookOpen className="h-5 w-5" /> <span className="hidden md:inline">Дневник</span>
            </TabsTrigger>
             <TabsTrigger value="history" className="gap-2">
              <History className="h-5 w-5" /> <span className="hidden md:inline">История</span>
            </TabsTrigger>
             <TabsTrigger value="records" className="gap-2">
              <Trophy className="h-5 w-5" /> <span className="hidden md:inline">Рекорды</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-5 w-5" /> <span className="hidden md:inline">Профиль</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics">
            <AnalyticsPage setActiveTab={setActiveTab}/>
          </TabsContent>

           <TabsContent value="feed">
            <FeedPage />
          </TabsContent>

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
                  onFinishPlan={handlePlanFinished}
                />
             )}
          </TabsContent>

           <TabsContent value="quick-start">
            <QuickStartPage />
          </TabsContent>
          
          <TabsContent value="nutrition">
            <NutritionDiaryPage />
          </TabsContent>

          <TabsContent value="history">
            <WorkoutHistoryPage />
          </TabsContent>

          <TabsContent value="records">
            <RecordsPage />
          </TabsContent>

          <TabsContent value="profile">
            <ProfilePage profile={userProfile} onProfileUpdate={handleProfileUpdate} />
          </TabsContent>
        </Tabs>
        ) : (
             <div className="text-center py-16">
                <Card className="max-w-lg mx-auto">
                    <CardHeader>
                        <CardTitle>Добро пожаловать в The LighSport!</CardTitle>
                        <CardDescription>Ваш персональный помощник для тренировок. Пожалуйста, войдите или зарегистрируйтесь, чтобы начать.</CardDescription>
                    </CardHeader>
                     <CardContent className="flex justify-center gap-4">
                        <Button asChild>
                            <Link href="/login"><LogIn className="mr-2 h-5 w-5" /> Войти</Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link href="/signup"><UserPlus className="mr-2 h-5 w-5" /> Зарегистрироваться</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )}
      </main>
    </div>
  );
}
