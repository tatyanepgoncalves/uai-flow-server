export function calculatePronunciationGoal(completedDrills: number, goal = 5) {
  return {
    pronunciationDrillsCompleted: completedDrills,
    pronunciationDrillsGoal: goal,
    pronunciationDrillsProgress: Math.min((completedDrills / goal) * 100, 100),
  }
}
