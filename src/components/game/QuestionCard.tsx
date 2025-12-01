import type { Question } from '@data/types';
import { cn } from '@utils/cn';

interface QuestionCardProps {
  question: Question;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  const handleSingleChoice = (optionValue: string) => {
    onChange(optionValue);
  };

  const handleMultipleChoice = (optionValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    onChange(newValues);
  };

  const isSelected = (optionValue: string): boolean => {
    if (question.type === 'single') {
      return value === optionValue;
    }
    return Array.isArray(value) && value.includes(optionValue);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold mb-4">{question.text}</h2>
        {question.type === 'multiple' && (
          <p className="text-base text-[var(--color-text-muted)]">
            Select all that apply
          </p>
        )}
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() =>
              question.type === 'single'
                ? handleSingleChoice(option.value)
                : handleMultipleChoice(option.value)
            }
            className={cn(
              'w-full p-4 rounded-lg border-2 text-left transition-all duration-200',
              'hover:border-[var(--color-primary)] hover:shadow-md',
              isSelected(option.value)
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-text)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]'
            )}
          >
            <div className="flex items-center gap-3">
              {/* Checkbox/Radio indicator */}
              <div
                className={cn(
                  'flex-shrink-0 w-5 h-5 rounded border-2 transition-all flex items-center justify-center',
                  question.type === 'single' && 'rounded-full',
                  isSelected(option.value)
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                    : 'border-[var(--color-border)]'
                )}
              >
                {isSelected(option.value) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              <span className="font-medium">{option.text}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}