export interface PracticeSessionInput {
  sessionMinutes: number
  minutesPerQuestion: number
}

export function validatePracticeSession(input: PracticeSessionInput): string[] {
  const errors: string[] = []
  if (input.sessionMinutes < 5 || input.sessionMinutes > 240) {
    errors.push('Session time must be between 5 and 240 minutes')
  }
  if (input.minutesPerQuestion < 0.5 || input.minutesPerQuestion > 10) {
    errors.push('Time per question must be between 0.5 and 10 minutes')
  }
  return errors
}
