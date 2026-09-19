interface ListeningActivity {
  assignedDate: Date | string
}

export function calculateListeningGoal(
  activities: ListeningActivity[],
  startOfWeek: Date,
  goalMinutes = 60,
  minutesPerChunk = 3
) {
  const weeklyChunks = activities.filter(
    ({ assignedDate }) => new Date(assignedDate) >= startOfWeek
  ).length

  return {
    activeListeningGoalMinutes: goalMinutes,
    activeListeningMinutes: weeklyChunks * minutesPerChunk,
  }
}
