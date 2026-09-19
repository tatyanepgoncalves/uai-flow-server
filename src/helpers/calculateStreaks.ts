export function calculateStreaks(
  dates: Array<Date | string>,
  referenceDate = new Date()
) {
  const dateKey = (value: Date) => {
    const date = new Date(value)

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const uniqueDates = [
    ...new Set(dates.map((date) => dateKey(new Date(date)))),
  ].sort()

  const toUtcDay = (key: string) => {
    const [year, month, day] = key.split('-').map(Number)
    return Date.UTC(year, month - 1, day)
  }

  let streakRecordDays = 0
  let currentStreakDays = 0
  let temporaryStreak = 0
  let previousDay: number | null = null

  for (const key of uniqueDates) {
    const currentDay = toUtcDay(key)

    if (previousDay !== null && currentDay - previousDay === 86_400_000) {
      // biome-ignore lint/style/noIncrementDecrement: it's necessary
      temporaryStreak++
    } else {
      temporaryStreak = 1
    }

    streakRecordDays = Math.max(streakRecordDays, temporaryStreak)
    previousDay = currentDay
  }

  const activitySet = new Set(uniqueDates)
  const todayKey = dateKey(referenceDate)
  const cursor = new Date(referenceDate)

  if (!activitySet.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1)
  }

  while (activitySet.has(dateKey(cursor))) {
    // biome-ignore lint/style/noIncrementDecrement: it's necessary
    currentStreakDays++
    cursor.setDate(cursor.getDate() - 1)
  }

  return {
    activeStreakDays: currentStreakDays,
    streakRecordDays,
  }
}
