import { useGameState } from '@context/GameStateContext';
import { QuestionCard } from './QuestionCard';
import { Button } from '@components/ui/Button';

export function QuestionFlow() {
  const {
    currentGenre,
    currentQuestionIndex,
    answers,
    canProceed,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    resetGame,
  } = useGameState();

  if (!currentGenre) return null;

  const question = currentGenre.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= currentGenre.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Progress indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-medium text-[var(--color-text-muted)]">
            Question {currentQuestionIndex + 1} of {currentGenre.questions.length}
          </span>
          <button
            onClick={resetGame}
            className="text-base text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors px-3 py-1"
          >
            Start Over
          </button>
        </div>
        <div className="w-full bg-[var(--color-border)] rounded-full h-3">
          <div
            className="bg-[var(--color-primary)] h-3 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / currentGenre.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="mb-12 animate-fade-in">
        <QuestionCard
          question={question}
          value={answers[question.id]}
          onChange={(value) => answerQuestion(question.id, value)}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-4 justify-between max-w-2xl mx-auto px-4">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={isFirstQuestion}
          className="min-w-[120px]"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Button>

        <Button
          onClick={nextQuestion}
          disabled={!canProceed}
          className="min-w-[120px]"
        >
          {isLastQuestion ? 'Generate Board' : 'Next'}
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isLastQuestion ? 'M5 13l4 4L19 7' : 'M9 5l7 7-7 7'}
            />
          </svg>
        </Button>
      </div>

      {/* Helper text */}
      {!canProceed && (
        <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
          Please select an option to continue
        </p>
      )}
    </div>
  );
}