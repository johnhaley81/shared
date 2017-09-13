// @flow

import Joi from 'joi-browser';

// prettier will remove the surrounding /*:: */ which is needed since other
// plugins don't fully support flow opague types yet
/* eslint-disable prettier/prettier */
/*::
export opaque type YearMonthBucketType: string = string;
*/
/* eslint-enable */

const YearMonthBucketSchema = Joi.string().regex(/^\d{4}-\d{2}$/);

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
