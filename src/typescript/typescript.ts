

import * as Commons from './modules/commons';
import moment from 'moment';

export class Library {

    public static VERSION: string = '1.0.0';

    private static instance: Library = new Library();

    private constructor() {
    }

    private static getInstance(): Library {
        console.info('Typescript library accessed. version : ' + Library.VERSION);

        return Library.instance;
    }

    public setCurrentDate(moment: moment.Moment | string | Date): void {
        Commons.DateUtils.init(moment);
    }

    public getCurrentDate(): moment.Moment {
        return Commons.DateUtils.getCurrentDate();
    }
}