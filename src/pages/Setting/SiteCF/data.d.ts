import moment from 'moment';

export interface FormValueType {
    keywords: string;
    description: string;
    siteCreationTime: moment.Moment;
    icp: string;
    copyrightPerson: string;
    copyrightUrl: string;
}

export interface FormValueParamsType extends Omit<FormValueType,"siteCreationTime"> {
    siteCreationTime: string;
}