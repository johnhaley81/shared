// @flow

import Joi from 'joi-browser';
import moment from 'moment';

export opaque type YearMonthBucketType: string = string;

export const YearMonthBucketRegex = /^\d{4}-\d{2}$/;
export const YearMonthBucketSchema = Joi.string().regex(YearMonthBucketRegex);

const validateEmailPostBody = (
  maybeYMB: string
): Promise<YearMonthBucketType> =>
  Promise.resolve().then((): Promise<string> | YearMonthBucketType => {
    const { error, value } = Joi.validate(maybeYMB, YearMonthBucketSchema);

    if (error) {
      return Promise.reject(error.annotate(true));
    }

    return value;
  });

export const getYearMonthBucket = (maybeYMB: string) =>
  validateEmailPostBody(maybeYMB);

export const getCurrentYearMonthBucket = () =>
  getYearMonthBucket(moment().format('YYYY-MM'));
