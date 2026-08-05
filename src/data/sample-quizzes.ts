import type { Quiz } from '@/types/quiz'

export const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Capitales du Monde',
    description: 'Testez vos connaissances sur les capitales des pays',
    questions: [
      {
        id: 'q1-1',
        text: 'Quelle est la capitale de la France ?',
        options: ['Londres', 'Paris', 'Berlin', 'Madrid'],
        correctAnswerIndex: 1,
      },
      {
        id: 'q1-2',
        text: "Quelle est la capitale de l'Espagne ?",
        options: ['Lisbonne', 'Madrid', 'Rome', 'Athènes'],
        correctAnswerIndex: 1,
      },
      {
        id: 'q1-3',
        text: "Quelle est la capitale de l'Allemagne ?",
        options: ['Vienne', 'Berlin', 'Bruxelles', 'Amsterdam'],
        correctAnswerIndex: 1,
      },
      {
        id: 'q1-4',
        text: "Quelle est la capitale de l'Italie ?",
        options: ['Rome', 'Milan', 'Venise', 'Naples'],
        correctAnswerIndex: 0,
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'Mathématiques de Base',
    description: 'Des questions simples de mathématiques',
    questions: [
      {
        id: 'q2-1',
        text: 'Combien font 2 + 2 ?',
        options: ['3', '4', '5', '6'],
        correctAnswerIndex: 1,
      },
      {
        id: 'q2-2',
        text: 'Combien font 5 × 3 ?',
        options: ['10', '15', '20', '25'],
        correctAnswerIndex: 1,
      },
      {
        id: 'q2-3',
        text: 'Combien font 10 - 7 ?',
        options: ['2', '3', '4', '5'],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'quiz-3',
    title: 'Culture Générale',
    description: 'Questions variées de culture générale',
    questions: [
      {
        id: 'q3-1',
        text: 'Qui a peint la Joconde ?',
        options: ['Vincent van Gogh', 'Pablo Picasso', 'Léonard de Vinci', 'Michel-Ange'],
        correctAnswerIndex: 2,
      },
      {
        id: 'q3-2',
        text: 'Quel est le plus grand océan du monde ?',
        options: ['Océan Atlantique', 'Océan Indien', 'Océan Pacifique', 'Océan Arctique'],
        correctAnswerIndex: 2,
      },
      {
        id: 'q3-3',
        text: 'En quelle année a eu lieu la Révolution Française ?',
        options: ['1789', '1889', '1689', '1989'],
        correctAnswerIndex: 0,
      },
    ],
  },
  {
    id: 'quiz-4',
    title: 'Speed Quiz - capitales',
    description: 'Répondez rapidement ! 30 secondes pour tout le quiz',
    timeLimit: 30,
    questions: [
      {
        id: 'q4-1',
        text: 'Quelle est la capitale du Japon ?',
        options: ['Pékin', 'Tokyo', 'Séoul', 'Bangkok'],
        correctAnswerIndex: 1,
      },
      {
        id: 'q4-2',
        text: 'Quelle est la capitale du Brésil ?',
        options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'],
        correctAnswerIndex: 2,
      },
      {
        id: 'q4-3',
        text: 'Quelle est la capitale du Canada ?',
        options: ['Toronto', 'Montréal', 'Ottawa', 'Vancouver'],
        correctAnswerIndex: 2,
      },
    ],
  },
  {
    id: 'quiz-5',
    title: 'Défi Temps - questions individuelles',
    description: 'Chaque question a son propre temps limite',
    questions: [
      {
        id: 'q5-1',
        text: '2 + 2 ?',
        options: ['3', '4', '5', '6'],
        correctAnswerIndex: 1,
        timeLimit: 5, // 5 secondes par question
      },
      {
        id: 'q5-2',
        text: '5 × 5 ?',
        options: ['20', '25', '30', '15'],
        correctAnswerIndex: 1,
        timeLimit: 10,
      },
      {
        id: 'q5-3',
        text: '100 - 50 ?',
        options: ['40', '50', '60', '30'],
        correctAnswerIndex: 1,
        timeLimit: 7,
      },
    ],
  },
  {
    id: 'quiz-6',
    title: 'Quiz Aléatoire - Capitales',
    description: 'Les questions seront mélangées à chaque fois !',
    shuffleQuestions: true,
    questions: [
      {
        id: 'q6-1',
        text: 'Quelle est la capitale de la France ?',
        options: ['Londres', 'Paris', 'Berlin', 'Madrid'],
        correctAnswerIndex: 1,
      },
      {
        id: 'q6-2',
        text: 'Quelle est la capitale de l\'Espagne ?',
        options: ['Lisbonne', 'Madrid', 'Rome', 'Athènes'],
        correctAnswerIndex: 1,
      },
      {
        id: 'q6-3',
        text: 'Quelle est la capitale de l\'Italie ?',
        options: ['Rome', 'Milan', 'Venise', 'Naples'],
        correctAnswerIndex: 0,
      },
      {
        id: 'q6-4',
        text: 'Quelle est la capitale de l\'Allemagne ?',
        options: ['Vienne', 'Berlin', 'Bruxelles', 'Amsterdam'],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'quiz-7',
    title: 'Quiz Réponses Mélangées - Maths',
    description: 'Les réponses sont mélangées à chaque question !',
    shuffleAnswers: true,
    questions: [
      {
        id: 'q7-1',
        text: 'Quelle est la capitale de la France ?',
        options: ['Londres', 'Paris', 'Berlin', 'Madrid'],
        correctAnswerIndex: 2,
      },
      {
        id: 'q7-2',
        text: 'Quel est le résultat de 3 + 5 ?',
        options: ['7', '8', '9', '10'],
        correctAnswerIndex: 2,
      },
      {
        id: 'q7-3',
        text: 'Quel est le plus grand pays du monde ?',
        options: ['Chine', 'États-Unis', 'Russie', 'Canada'],
        correctAnswerIndex: 3,
      },
    ],
  },
  {
    id: 'quiz-8',
    title: 'Quiz Mixte - Mélange Sélectif',
    description: 'Certaines questions ont leurs réponses mélangées',
    questions: [
      {
        id: 'q8-1',
        text: '2 + 2 ?',
        options: ['3', '4', '5', '6'],
        correctAnswerIndex: 1,
        shuffleAnswers: true, // Cette question seulement
      },
      {
        id: 'q8-2',
        text: '5 × 5 ?',
        options: ['20', '25', '30', '15'],
        correctAnswerIndex: 1,
        // Pas de shuffleAnswers, donc les réponses restent dans l'ordre
      },
      {
        id: 'q8-3',
        text: '10 - 3 ?',
        options: ['6', '7', '8', '9'],
        correctAnswerIndex: 1,
        shuffleAnswers: true, // Cette question aussi
      },
    ],
  },
]

export function hasInitializedQuizzes(quizzes: Quiz[]): boolean {
  return quizzes.length > 0
}
