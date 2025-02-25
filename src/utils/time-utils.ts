
export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const calculateTimeRemaining = (endDate: Date): TimeRemaining => {
  const now = new Date();
  const diffTime = Math.max(0, endDate.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffTime / 1000);
  
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  return { days, hours, minutes, seconds };
};
