
import moment from 'moment';

export class DateUtils {
    private static current: moment.Moment = moment();

    public static init(current: moment.Moment | string | Date = moment()): void {
        DateUtils.current = moment(current);
    }

    public static getCurrentDate(): moment.Moment {
        return DateUtils.current.clone().startOf('day');
    }

    public static getCurrentTime(): moment.Moment {
        return DateUtils.current.clone();
    }
}