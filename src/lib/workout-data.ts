/**
 * @fileoverview This file contains a structured "database" of workouts and exercises
 * categorized by sport. This data is used by the AI to generate structured and
 * relevant workout plans.
 */

export enum Sport {
  Gym = 'Тренажерный зал',
  Running = 'Бег',
  Home = 'Домашние тренировки',
}

export interface Exercise {
  name: string;
  description: string; // Brief description for the AI to understand the exercise
  muscleGroups: string[];
  equipmentNeeded: string[]; // e.g., ['dumbbell', 'barbell', 'none']
}

export interface Workout {
  name: string;
  description: string; // Brief description of the workout type
  exercises: Exercise[];
}

export interface SportWorkouts {
  sport: Sport;
  workouts: Workout[];
}

// Using a Record for easier lookup
export const workoutDatabase: Record<Sport, SportWorkouts> = {
  [Sport.Gym]: {
    sport: Sport.Gym,
    workouts: [
      {
        name: 'Комплексная тренировка (Full Body)',
        description: 'Тренировка, нацеленная на проработку всех основных мышечных групп за одно занятие.',
        exercises: [
          { name: 'Приседания со штангой', description: 'Базовое упражнение для ног и ягодиц.', muscleGroups: ['quads', 'glutes', 'hamstrings'], equipmentNeeded: ['barbell'] },
          { name: 'Жим штанги лежа', description: 'Базовое упражнение для грудных мышц, трицепсов и дельт.', muscleGroups: ['chest', 'triceps', 'shoulders'], equipmentNeeded: ['barbell', 'bench'] },
          { name: 'Становая тяга', description: 'Комплексное упражнение для спины, ног и ягодиц.', muscleGroups: ['back', 'hamstrings', 'glutes'], equipmentNeeded: ['barbell'] },
          { name: 'Подтягивания', description: 'Упражнение для широчайших мышц спины и бицепсов.', muscleGroups: ['back', 'biceps'], equipmentNeeded: ['pull-up bar'] },
          { name: 'Армейский жим', description: 'Упражнение для плеч.', muscleGroups: ['shoulders', 'triceps'], equipmentNeeded: ['barbell'] },
          { name: 'Тяга штанги в наклоне', description: 'Упражнение для мышц спины.', muscleGroups: ['back', 'biceps'], equipmentNeeded: ['barbell'] },
        ],
      },
      {
        name: 'Тренировка на верхнюю часть тела (Upper Body)',
        description: 'Тренировка, сфокусированная на мышцах груди, спины, плеч и рук.',
        exercises: [
          { name: 'Жим гантелей лежа', description: 'Упражнение для грудных мышц.', muscleGroups: ['chest', 'shoulders', 'triceps'], equipmentNeeded: ['dumbbell', 'bench'] },
          { name: 'Тяга верхнего блока', description: 'Упражнение для широчайших мышц спины.', muscleGroups: ['back', 'biceps'], equipmentNeeded: ['cable machine'] },
          { name: 'Махи гантелями в стороны', description: 'Изолирующее упражнение для средних дельт.', muscleGroups: ['shoulders'], equipmentNeeded: ['dumbbell'] },
          { name: 'Сгибания рук со штангой на бицепс', description: 'Упражнение для бицепсов.', muscleGroups: ['biceps'], equipmentNeeded: ['barbell'] },
          { name: 'Французский жим', description: 'Упражнение для трицепсов.', muscleGroups: ['triceps'], equipmentNeeded: ['barbell', 'bench'] },
        ],
      },
      {
        name: 'Тренировка на нижнюю часть тела (Lower Body)',
        description: 'Тренировка, сфокусированная на мышцах ног и ягодиц.',
        exercises: [
          { name: 'Выпады с гантелями', description: 'Упражнение для ног и ягодиц.', muscleGroups: ['quads', 'glutes', 'hamstrings'], equipmentNeeded: ['dumbbell'] },
          { name: 'Жим ногами в тренажере', description: 'Упражнение для квадрицепсов.', muscleGroups: ['quads', 'glutes'], equipmentNeeded: ['leg press machine'] },
          { name: 'Сгибание ног в тренажере', description: 'Изолирующее упражнение для бицепса бедра.', muscleGroups: ['hamstrings'], equipmentNeeded: ['leg curl machine'] },
          { name: 'Подъемы на носки', description: 'Упражнение для икроножных мышц.', muscleGroups: ['calves'], equipmentNeeded: ['none'] },
          { name: 'Румынская становая тяга', description: 'Упражнение для бицепса бедра и ягодиц.', muscleGroups: ['hamstrings', 'glutes'], equipmentNeeded: ['barbell'] },
        ],
      },
    ],
  },
  [Sport.Running]: {
    sport: Sport.Running,
    workouts: [
      {
        name: 'Восстановительный бег',
        description: 'Легкий бег в медленном темпе для восстановления после тяжелых нагрузок.',
        exercises: [
          { name: 'Легкий бег', description: 'Бег в разговорном темпе.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: ['none'] },
          { name: 'Заминка и растяжка', description: 'Легкая растяжка основных групп мышц.', muscleGroups: ['full body'], equipmentNeeded: ['none'] },
        ],
      },
      {
        name: 'Скоростная тренировка (Темповый бег)',
        description: 'Бег с комфортно-тяжелой скоростью на определенное время или дистанцию.',
        exercises: [
          { name: 'Разминка', description: '10-15 минут легкого бега.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: ['none'] },
          { name: 'Темповый бег', description: 'Бег с постоянной скоростью на грани анаэробного порога.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: ['none'] },
          { name: 'Заминка', description: '10-15 минут легкого бега.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: ['none'] },
        ],
      },
      {
        name: 'Интервальная тренировка',
        description: 'Чередование коротких отрезков быстрого бега с периодами восстановления.',
        exercises: [
          { name: 'Разминка', description: '10-15 минут легкого бега.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: ['none'] },
          { name: 'Интервалы', description: 'Например, 400м быстрого бега, 400м трусцой.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: ['none'] },
          { name: 'Заминка', description: '10-15 минут легкого бега.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: ['none'] },
        ],
      },
      {
        name: 'Длительный бег',
        description: 'Продолжительный бег в легком или умеренном темпе для развития выносливости.',
        exercises: [
          { name: 'Длительный бег', description: 'Бег на длинную дистанцию в легком темпе.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: ['none'] },
        ],
      },
    ],
  },
  [Sport.Home]: {
    sport: Sport.Home,
    workouts: [
      {
        name: 'Домашняя комплексная тренировка (Full Body)',
        description: 'Тренировка на все тело с использованием собственного веса или минимального инвентаря.',
        exercises: [
          { name: 'Отжимания', description: 'Упражнение для груди, плеч и трицепсов.', muscleGroups: ['chest', 'shoulders', 'triceps'], equipmentNeeded: ['none'] },
          { name: 'Приседания с собственным весом', description: 'Базовое упражнение для ног.', muscleGroups: ['quads', 'glutes'], equipmentNeeded: ['none'] },
          { name: 'Планка', description: 'Упражнение для мышц кора.', muscleGroups: ['core'], equipmentNeeded: ['none'] },
          { name: 'Выпады', description: 'Упражнение для ног и ягодиц.', muscleGroups: ['quads', 'glutes'], equipmentNeeded: ['none'] },
          { name: 'Берпи', description: 'Комплексное кардио-упражнение.', muscleGroups: ['full body', 'cardio'], equipmentNeeded: ['none'] },
          { name: 'Подтягивания на турнике', description: '(Если есть) Упражнение для спины и бицепсов.', muscleGroups: ['back', 'biceps'], equipmentNeeded: ['pull-up bar'] },
        ],
      },
      {
        name: 'Домашняя кардио-тренировка',
        description: 'Высокоинтенсивная интервальная тренировка (HIIT) для сжигания калорий и улучшения выносливости.',
        exercises: [
          { name: 'Прыжки "Jumping Jacks"', description: 'Классическое кардио-упражнение.', muscleGroups: ['cardio', 'full body'], equipmentNeeded: ['none'] },
          { name: 'Высокое поднимание коленей', description: 'Интенсивное кардио-упражнение.', muscleGroups: ['cardio', 'legs', 'core'], equipmentNeeded: ['none'] },
          { name: 'Скалолазы (Mountain Climbers)', description: 'Упражнение для кора и кардио.', muscleGroups: ['core', 'cardio', 'shoulders'], equipmentNeeded: ['none'] },
          { name: 'Берпи', description: 'Комплексное кардио-упражнение.', muscleGroups: ['full body', 'cardio'], equipmentNeeded: ['none'] },
        ],
      },
    ],
  },
};
