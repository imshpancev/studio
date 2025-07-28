
/**
 * @fileoverview This file contains a structured "database" of workouts and exercises
 * categorized by sport. This data is used by the AI to generate structured and
 * relevant workout plans.
 */

export enum Sport {
  Gym = 'Тренажерный зал',
  Running = 'Бег',
  Home = 'Домашние тренировки',
  Swimming = 'Плавание',
  Yoga = 'Йога',
}

export const sportsWithEquipment = [Sport.Gym, Sport.Home];

export interface Exercise {
  name: string;
  description: string;
  technique: string;
  muscleGroups: string[];
  equipmentNeeded: string[];
}

export type Workout = {
  name: string;
  description: string;
  exercises: Exercise[];
}

export interface SportWorkouts {
  sport: Sport;
  workouts: Workout[];
}

export const allEquipment = [
    { id: 'barbell', label: 'Штанга' },
    { id: 'dumbbell', label: 'Гантели' },
    { id: 'kettlebell', label: 'Гиря' },
    { id: 'bench', label: 'Скамья' },
    { id: 'pull-up bar', label: 'Турник' },
    { id: 'resistance bands', label: 'Эспандеры' },
    { id: 'cable machine', label: 'Блочный тренажер' },
    { id: 'leg press machine', label: 'Тренажер для жима ногами' },
    { id: 'leg curl machine', label: 'Тренажер для сгибания ног' },
    { id: 'treadmill', label: 'Беговая дорожка' },
    { id: 'yoga mat', label: 'Коврик для йоги' },
    { id: 'kickboard', label: 'Доска для плавания' },
    { id: 'pull buoy', label: 'Колобашка для плавания' },
];


// Using a Record for easier lookup
export const workoutDatabase: Record<Sport, SportWorkouts> = {
  [Sport.Gym]: {
    sport: Sport.Gym,
    workouts: [
      {
        name: 'Комплексная тренировка (Full Body)',
        description: 'Тренировка, нацеленная на проработку всех основных мышечных групп за одно занятие.',
        exercises: [
          { name: 'Приседания со штангой', description: 'Базовое упражнение для ног и ягодиц.', technique: 'Держите спину прямо, штангу на плечах. Приседайте до параллели бедер с полом, контролируя движение.', muscleGroups: ['quads', 'glutes', 'hamstrings'], equipmentNeeded: ['barbell'] },
          { name: 'Жим штанги лежа', description: 'Базовое упражнение для грудных мышц, трицепсов и дельт.', technique: 'Лягте на скамью, возьмите штангу хватом чуть шире плеч. Опускайте штангу к груди, затем выжимайте вверх.', muscleGroups: ['chest', 'triceps', 'shoulders'], equipmentNeeded: ['barbell', 'bench'] },
          { name: 'Становая тяга', description: 'Комплексное упражнение для спины, ног и ягодиц.', technique: 'Подойдите к штанге, ноги на ширине плеч. С прямой спиной опуститесь и возьмитесь за гриф. Поднимайтесь, разгибая ноги и спину одновременно.', muscleGroups: ['back', 'hamstrings', 'glutes'], equipmentNeeded: ['barbell'] },
          { name: 'Подтягивания', description: 'Упражнение для широчайших мышц спины и бицепсов.', technique: 'Возьмитесь за турник широким хватом. Подтягивайтесь до тех пор, пока подбородок не окажется над перекладиной.', muscleGroups: ['back', 'biceps'], equipmentNeeded: ['pull-up bar'] },
          { name: 'Армейский жим', description: 'Упражнение для плеч.', technique: 'Стоя или сидя, поднимите штангу на уровень плеч. Выжмите штангу вверх над головой до полного выпрямления рук.', muscleGroups: ['shoulders', 'triceps'], equipmentNeeded: ['barbell'] },
          { name: 'Тяга штанги в наклоне', description: 'Упражнение для мышц спины.', technique: 'Наклонитесь с прямой спиной. Возьмите штангу и тяните ее к поясу, сводя лопатки.', muscleGroups: ['back', 'biceps'], equipmentNeeded: ['barbell'] },
        ],
      },
      {
        name: 'Тренировка на верхнюю часть тела (Upper Body)',
        description: 'Тренировка, сфокусированная на мышцах груди, спины, плеч и рук.',
        exercises: [
          { name: 'Жим гантелей лежа', description: 'Упражнение для грудных мышц.', technique: 'Лягте на скамью, гантели на уровне груди. Выжимайте гантели вверх, сводя их в верхней точке.', muscleGroups: ['chest', 'shoulders', 'triceps'], equipmentNeeded: ['dumbbell', 'bench'] },
          { name: 'Тяга верхнего блока', description: 'Упражнение для широчайших мышц спины.', technique: 'Сядьте в тренажер, возьмитесь за рукоять широким хватом. Тяните рукоять к верхней части груди, сводя лопатки.', muscleGroups: ['back', 'biceps'], equipmentNeeded: ['cable machine'] },
          { name: 'Махи гантелями в стороны', description: 'Изолирующее упражнение для средних дельт.', technique: 'Стоя, слегка согните руки в локтях. Поднимайте гантели в стороны до уровня плеч.', muscleGroups: ['shoulders'], equipmentNeeded: ['dumbbell'] },
          { name: 'Сгибания рук со штангой на бицепс', description: 'Упражнение для бицепсов.', technique: 'Стоя, держите штангу хватом снизу. Сгибайте руки в локтях, поднимая штангу к плечам.', muscleGroups: ['biceps'], equipmentNeeded: ['barbell'] },
          { name: 'Французский жим', description: 'Упражнение для трицепсов.', technique: 'Лягте на скамью, держите штангу над собой. Сгибайте руки в локтях, опуская штангу ко лбу.', muscleGroups: ['triceps'], equipmentNeeded: ['barbell', 'bench'] },
        ],
      },
      {
        name: 'Тренировка на нижнюю часть тела (Lower Body)',
        description: 'Тренировка, сфокусированная на мышцах ног и ягодиц.',
        exercises: [
          { name: 'Выпады с гантелями', description: 'Упражнение для ног и ягодиц.', technique: 'Сделайте шаг вперед и опуститесь, пока оба колена не согнутся под углом 90 градусов. Вернитесь в исходное положение.', muscleGroups: ['quads', 'glutes', 'hamstrings'], equipmentNeeded: ['dumbbell'] },
          { name: 'Жим ногами в тренажере', description: 'Упражнение для квадрицепсов.', technique: 'Сядьте в тренажер, поставьте ноги на платформу. Выжимайте платформу ногами, не блокируя колени в верхней точке.', muscleGroups: ['quads', 'glutes'], equipmentNeeded: ['leg press machine'] },
          { name: 'Сгибание ног в тренажере', description: 'Изолирующее упражнение для бицепса бедра.', technique: 'Лягте в тренажер, заведите голени под валик. Сгибайте ноги, подтягивая валик к ягодицам.', muscleGroups: ['hamstrings'], equipmentNeeded: ['leg curl machine'] },
          { name: 'Подъемы на носки', description: 'Упражнение для икроножных мышц.', technique: 'Стоя на платформе, поднимайтесь на носки как можно выше, затем медленно опускайтесь.', muscleGroups: ['calves'], equipmentNeeded: ['none'] },
          { name: 'Румынская становая тяга', description: 'Упражнение для бицепса бедра и ягодиц.', technique: 'Держите штангу перед собой. С прямой спиной наклоняйтесь вперед, отводя таз назад, пока не почувствуете растяжение в бицепсе бедра.', muscleGroups: ['hamstrings', 'glutes'], equipmentNeeded: ['barbell'] },
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
          { name: 'Легкий бег', description: 'Бег в разговорном темпе (пульсовая зона 2).', technique: 'Поддерживайте темп, при котором вы можете свободно разговаривать. Следите за каденсом (частотой шагов) около 170-180 шагов в минуту.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: [] },
          { name: 'Заминка и растяжка', description: 'Легкая растяжка основных групп мышц после бега.', technique: 'После бега выполните статическую растяжку квадрицепсов, бицепсов бедра, икроножных мышц и ягодиц, удерживая каждую позу по 30 секунд.', muscleGroups: ['full body'], equipmentNeeded: [] },
        ],
      },
      {
        name: 'Темповый бег',
        description: 'Бег с комфортно-тяжелой скоростью на определенное время или дистанцию для развития анаэробного порога.',
        exercises: [
          { name: 'Разминка', description: '10-15 минут легкого бега.', technique: 'Начните с легкой трусцы, постепенно увеличивая темп до разминочного.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: [] },
          { name: 'Темповый отрезок', description: 'Бег с постоянной скоростью на грани анаэробного порога (пульсовая зона 4).', technique: 'Найдите темп, который вы могли бы поддерживать в течение часа. Бегите в этом темпе указанное время или дистанцию.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: [] },
          { name: 'Заминка', description: '10-15 минут легкого бега.', technique: 'Постепенно снижайте темп до легкой трусцы, чтобы нормализовать пульс.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: [] },
        ],
      },
      {
        name: 'Интервальная тренировка',
        description: 'Чередование коротких отрезков быстрого бега с периодами восстановления для развития МПК (максимального потребления кислорода).',
        exercises: [
          { name: 'Разминка', description: '10-15 минут легкого бега и несколько динамических упражнений.', technique: 'Начните с легкой трусцы, затем сделайте махи ногами, выпады, и т.д.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: [] },
          { name: 'Интервалы', description: 'Например, 6 раз по 400м быстрого бега через 400м медленной трусцы.', technique: 'Пробегите быстрый отрезок с усилием 8-9 из 10. Восстановительный отрезок — очень легкая трусца или ходьба.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: [] },
          { name: 'Заминка', description: '10-15 минут легкого бега.', technique: 'Постепенно снижайте темп до легкой трусцы, чтобы нормализовать пульс.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: [] },
        ],
      },
      {
        name: 'Длительный бег',
        description: 'Продолжительный бег в легком или умеренном темпе для развития общей и мышечной выносливости.',
        exercises: [
          { name: 'Длительный бег', description: 'Бег на длинную дистанцию в легком темпе (пульсовая зона 2-3).', technique: 'Поддерживайте комфортный, разговорный темп на протяжении всей дистанции. Сосредоточьтесь на экономичности движений.', muscleGroups: ['cardio', 'legs'], equipmentNeeded: [] },
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
          { name: 'Отжимания', description: 'Упражнение для груди, плеч и трицепсов.', technique: 'Руки на ширине плеч, тело прямое. Опускайтесь, сгибая локти, пока грудь почти не коснется пола. Вернитесь в исходное положение.', muscleGroups: ['chest', 'shoulders', 'triceps'], equipmentNeeded: [] },
          { name: 'Приседания с собственным весом', description: 'Базовое упражнение для ног.', technique: 'Ноги на ширине плеч, спина прямая. Приседайте, отводя таз назад, как будто садитесь на стул. Опускайтесь до параллели бедер с полом.', muscleGroups: ['quads', 'glutes'], equipmentNeeded: [] },
          { name: 'Планка', description: 'Упражнение для мышц кора.', technique: 'Примите упор на предплечьях и носках. Тело должно образовывать прямую линию от головы до пяток. Удерживайте положение, напрягая мышцы живота.', muscleGroups: ['core'], equipmentNeeded: [] },
          { name: 'Выпады', description: 'Упражнение для ног и ягодиц.', technique: 'Сделайте шаг вперед и опуститесь, пока оба колена не согнутся под углом 90 градусов. Вернитесь в исходное положение и повторите с другой ноги.', muscleGroups: ['quads', 'glutes'], equipmentNeeded: [] },
          { name: 'Берпи', description: 'Комплексное кардио-упражнение.', technique: 'Из положения стоя присядьте, поставьте руки на пол. Отпрыгните ногами назад в планку, сделайте отжимание. Вернитесь в присед и выпрыгните вверх.', muscleGroups: ['full body', 'cardio'], equipmentNeeded: [] },
          { name: 'Подтягивания на турнике', description: '(Если есть) Упражнение для спины и бицепсов.', technique: 'Возьмитесь за турник широким хватом. Подтягивайтесь до тех пор, пока подбородок не окажется над перекладиной.', muscleGroups: ['back', 'biceps'], equipmentNeeded: ['pull-up bar'] },
        ],
      },
      {
        name: 'Домашняя кардио-тренировка',
        description: 'Высокоинтенсивная интервальная тренировка (HIIT) для сжигания калорий и улучшения выносливости.',
        exercises: [
          { name: 'Прыжки "Jumping Jacks"', description: 'Классическое кардио-упражнение.', technique: 'В прыжке расставляйте ноги в стороны и одновременно поднимайте руки над головой. Возвращайтесь в исходное положение.', muscleGroups: ['cardio', 'full body'], equipmentNeeded: [] },
          { name: 'Высокое поднимание коленей', description: 'Интенсивное кардио-упражнение.', technique: 'Бегите на месте, стараясь поднимать колени как можно выше, до уровня таза.', muscleGroups: ['cardio', 'legs', 'core'], equipmentNeeded: [] },
          { name: 'Скалолазы (Mountain Climbers)', description: 'Упражнение для кора и кардио.', technique: 'Примите положение планки на прямых руках. Поочередно подтягивайте колени к груди в быстром темпе.', muscleGroups: ['core', 'cardio', 'shoulders'], equipmentNeeded: [] },
          { name: 'Берпи', description: 'Комплексное кардио-упражнение.', technique: 'Из положения стоя присядьте, поставьте руки на пол. Отпрыгните ногами назад в планку, сделайте отжимание. Вернитесь в присед и выпрыгните вверх.', muscleGroups: ['full body', 'cardio'], equipmentNeeded: [] },
        ],
      },
    ],
  },
  [Sport.Swimming]: {
    sport: Sport.Swimming,
    workouts: [
      {
        name: 'Техническая тренировка',
        description: 'Тренировка, сфокусированная на улучшении техники плавания и "чувства воды".',
        exercises: [
          { name: 'Плавание на ногах', description: 'Изолированная работа ног для улучшения их силы и техники.', technique: 'Держите доску для плавания вытянутыми руками перед собой. Работайте только ногами, стараясь держать тело горизонтально.', muscleGroups: ['legs', 'core'], equipmentNeeded: ['kickboard'] },
          { name: 'Плавание на руках', description: 'Изолированная работа рук для улучшения техники гребка.', technique: 'Зажмите колобашку между бедер, чтобы "отключить" ноги. Плывите, используя только руки. Сосредоточьтесь на высоком локте и мощном завершении гребка.', muscleGroups: ['arms', 'shoulders', 'back', 'core'], equipmentNeeded: ['pull buoy'] },
          { name: 'Упражнения на "чувство воды"', description: 'Различные виды гребков для улучшения контроля над водой.', technique: 'Выполняйте медленные гребки sculling в различных положениях (перед собой, под собой) для развития чувства опоры о воду.', muscleGroups: ['forearms', 'shoulders'], equipmentNeeded: [] },
          { name: 'Плавание в полной координации', description: 'Плавание в основном стиле с акцентом на одном техническом элементе.', technique: 'Плывите в своем обычном темпе, но концентрируйтесь, например, на вращении корпуса или на правильном дыхании.', muscleGroups: ['full body'], equipmentNeeded: [] },
        ],
      },
      {
        name: 'Тренировка на выносливость',
        description: 'Развитие общей и специальной выносливости в воде.',
        exercises: [
          { name: 'Разминка', description: 'Легкое плавание разными стилями.', technique: 'Проплывите 400-500 метров в комфортном темпе, чередуя кроль, брасс и плавание на спине.', muscleGroups: ['full body'], equipmentNeeded: [] },
          { name: 'Основная серия', description: 'Длинные отрезки плавания с коротким отдыхом.', technique: 'Пример: 4 раза по 200 метров кролем с отдыхом 30 секунд. Поддерживайте равномерный темп.', muscleGroups: ['full body', 'cardio'], equipmentNeeded: [] },
          { name: 'Заминка', description: 'Легкое плавание для восстановления.', technique: 'Проплывите 200-300 метров в очень легком темпе, сосредотачиваясь на растяжении мышц в воде.', muscleGroups: ['full body'], equipmentNeeded: [] },
        ],
      }
    ],
  },
  [Sport.Yoga]: {
    sport: Sport.Yoga,
    workouts: [
        {
          name: 'Приветствие Солнцу (Сурья Намаскар)',
          description: 'Динамическая последовательность асан для разогрева тела и синхронизации дыхания с движением.',
          exercises: [
            { name: 'Тадасана (Поза горы)', description: 'Основная стоячая поза, улучшает осанку.', technique: 'Встаньте прямо, стопы вместе. Распределите вес равномерно. Руки вдоль тела.', muscleGroups: ['full body'], equipmentNeeded: ['yoga mat'] },
            { name: 'Урдхва Хастасана (Поза с поднятыми руками)', description: 'Растягивает боковые мышцы тела.', technique: 'На вдохе поднимите руки вверх через стороны.', muscleGroups: ['full body'], equipmentNeeded: ['yoga mat'] },
            { name: 'Уттанасана (Наклон вперед)', description: 'Растягивает заднюю поверхность ног и спину.', technique: 'На выдохе наклонитесь вперед от тазобедренных суставов.', muscleGroups: ['hamstrings', 'back'], equipmentNeeded: ['yoga mat'] },
            { name: 'Ардха Уттанасана (Половинный наклон)', description: 'Вытягивает позвоночник.', technique: 'На вдохе поднимите корпус до половины, спина прямая.', muscleGroups: ['back'], equipmentNeeded: ['yoga mat'] },
            { name: 'Чатуранга Дандасана (Поза посоха на четырех опорах)', description: 'Укрепляет руки и кор.', technique: 'На выдохе отшагните или отпрыгните назад в планку и согните локти до прямого угла.', muscleGroups: ['arms', 'core', 'shoulders'], equipmentNeeded: ['yoga mat'] },
            { name: 'Урдхва Мукха Шванасана (Собака мордой вверх)', description: 'Раскрывает грудную клетку.', technique: 'На вдохе перекатитесь на подъемы стоп, выпрямите руки и прогнитесь, глядя вверх.', muscleGroups: ['chest', 'shoulders', 'back'], equipmentNeeded: ['yoga mat'] },
            { name: 'Адхо Мукха Шванасана (Собака мордой вниз)', description: 'Комплексное вытяжение всего тела.', technique: 'На выдохе поднимите таз вверх, образуя телом перевернутую букву V.', muscleGroups: ['full body'], equipmentNeeded: ['yoga mat'] },
          ],
        },
      ],
    },
};
