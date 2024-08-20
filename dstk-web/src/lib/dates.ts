import { intervalToDuration } from 'date-fns';

export const getLastModified = (date: string) => {
    const interval = intervalToDuration({
        start: new Date(parseInt(date)),
        end: new Date(),
    });

    if (interval.years !== undefined) {
        return `${interval.years} year${interval.years !== 1 ? 's' : ''} ago`;
    }

    if (interval.months) {
        return `${interval.months} month${interval.months !== 1 ? 's' : ''} ago`;
    }

    if (interval.weeks) {
        return `${interval.weeks} week${interval.weeks !== 1 ? 's' : ''} ago`;
    }

    if (interval.days) {
        return `${interval.days} day${interval.days !== 1 ? 's' : ''} ago`;
    }

    if (interval.minutes) {
        return `${interval.minutes} minute${interval.minutes !== 1 ? 's' : ''} ago`;
    }

    return `${interval.seconds} second${interval.seconds !== 1 ? 's' : ''} ago`;
};
