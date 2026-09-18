import { ditadorQuiz } from './questions/ditador';
import { linuxQuiz } from './questions/linux';
import { frutaQuiz } from './questions/fruta';
import { politicoQuiz } from './questions/politico';

export const quizzesList = [
  ditadorQuiz,
  linuxQuiz,
  frutaQuiz,
  politicoQuiz
];

export const quizzesBySlug = {
  [ditadorQuiz.id]: ditadorQuiz,
  [linuxQuiz.id]: linuxQuiz,
  [frutaQuiz.id]: frutaQuiz,
  [politicoQuiz.id]: politicoQuiz,
  // Aliases curtos para conveniência na URL
  'ditador': ditadorQuiz,
  'linux': linuxQuiz,
  'fruta': frutaQuiz,
  'politico': politicoQuiz
};
