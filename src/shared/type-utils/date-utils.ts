export class DateUtils {
  static isEndDateAfterStartDate(startDate: Date, endDate: Date): boolean {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      throw new TypeError('Invalid date objects');
    }
    const timeDifference = endDate.getTime() - startDate.getTime();

    const oneDayInMilliseconds = 30 * 24 * 60 * 60 * 1000; //todo need to change it to be more precise

    return timeDifference >= oneDayInMilliseconds;
  }
}
