// @flow

import Joi from 'joi-browser';
import uuid from 'uuid';

// https://github.com/benmosher/eslint-plugin-import/issues/921
/* eslint-disable import/named */
import type { YearMonthBucketType } from './YearMonthBucket';
/* eslint-enable */

export type ModelSavedFieldsType = {|
  createdAt: string,
  id: string,
  updatedAt?: string,
|};

export type SupportedLanguageType =
  | 'zh'
  | 'zh-Hant'
  | 'en'
  | 'fr'
  | 'de'
  | 'it'
  | 'ja'
  | 'ko'
  | 'pt'
  | 'es';

export const SupportedLanguageSchema = Joi.string().valid([
  'zh',
  'zh-Hant',
  'en',
  'fr',
  'de',
  'it',
  'ja',
  'ko',
  'pt',
  'es',
]);

type TextSpanType = {
  beginOffset: number,
  content: string,
};

export const TextSpanSchema = Joi.object({
  beginOffset: Joi.number()
    .min(-1)
    .required(),
  content: Joi.string().required(),
}).unknown();

export type SentimentType = {
  magnitude: number,
  score: number,
};

export const SentimentSchema = Joi.object({
  magnitude: Joi.number()
    .min(0)
    .required(),
  score: Joi.number()
    .min(-1)
    .max(1)
    .required(),
}).unknown();

export type ClassType = {
  className: string,
  confidence: number,
};

export const ClassSchema = Joi.object({
  className: Joi.string().required(),
  confidence: Joi.number()
    .min(0)
    .max(1)
    .required(),
}).unknown();

export type SentenceType = {
  sentiment: SentimentType,
  text: TextSpanType,
};

export const SentenceSchema = Joi.object({
  sentiment: SentimentSchema.required(),
  text: TextSpanSchema.required(),
}).unknown();

export type SentimentAnalysisResponseType = {|
  documentSentiment: SentimentType,
  language: SupportedLanguageType,
  sentences: SentenceType[],
|};

export const SentimentAnalysisResponseSchema = Joi.object({
  documentSentiment: SentimentSchema.required(),
  language: SupportedLanguageSchema.required(),
  sentences: Joi.array()
    .items(SentenceSchema)
    .required(),
}).unknown();

export type FeedbackType = 'email' | 'twitter';

export type FeedbackSentimentAndClassificationType = {|
  contentSentiment: SentimentType,
  documentClassification: ClassType[],
  sentences: Array<{
    classification: ClassType,
    ...SentenceType,
  }>,
  topDocumentClasses: Array<string>,
  topSentenceClasses: Array<string>,
|};

export type FeedbackAnalysisUnsavedType = {|
  ...FeedbackSentimentAndClassificationType,
  accountId: string,
  feedbackId: string,
  feedbackType: FeedbackType,
|};

export type FeedbackAnalysisType = {
  ...FeedbackAnalysisUnsavedType,
  ...ModelSavedFieldsType,
};

export const FeedbackAnalysisSchema = Joi.object({
  accountId: Joi.string().required(),
  contentSentiment: SentimentSchema.required(),
  documentClassification: Joi.array()
    .items(ClassSchema)
    .required(),
  feedbackId: Joi.string()
    .guid()
    .default(() => uuid.v4(), 'uuid v4'),
  feedbackType: Joi.string()
    .allow(['email', 'twitter'])
    .required(),
  id: Joi.string()
    .guid()
    .default(() => uuid.v4(), 'uuid v4'),
  sentences: Joi.array()
    .items(
      SentenceSchema.keys({
        classification: Joi.array()
          .items(ClassSchema)
          .required(),
      }).required()
    )
    .required(),
  topDocumentClasses: Joi.array()
    .items(Joi.string())
    .required(),
  topSentenceClasses: Joi.array()
    .items(Joi.string())
    .required(),
})
  .unknown()
  .required();

export type WatsonClassifyResponseType = {
  classes: Array<{ class_name: string, confidence: number }>,
  classifier_id: string,
  text: string,
  top_class: string,
  url: string,
};

export const WatsonClassifyResponseSchema = Joi.object({
  classes: Joi.array()
    .items(
      Joi.object({
        class_name: Joi.string().required(),
        confidence: Joi.number()
          .min(0)
          .max(1)
          .required(),
      }).unknown()
    )
    .required(),
  classifier_id: Joi.string().required(),
  text: Joi.string().required(),
  top_class: Joi.string().required(),
  url: Joi.string()
    .uri({ allowRelative: true })
    .required(),
});

export type EmailFeedbackPostBodyType = {|
  content: string,
  emailSentDate: string,
  from: string,
  subject: string,
  to: string,
|};

export const EmailFeedbackPostBodySchema = Joi.object({
  content: Joi.string().required(),
  emailSentDate: Joi.string()
    .isoDate()
    .required(),
  from: Joi.string()
    .email()
    .required(),
  subject: Joi.string().required(),
  to: Joi.string()
    .email()
    .required(),
})
  .unknown()
  .required();

export type EmailFeedbackUnsavedType = {|
  ...EmailFeedbackPostBodyType,
  accountId: string,
|};

export type EmailFeedbackType = {
  ...EmailFeedbackUnsavedType,
  ...ModelSavedFieldsType,
};

export const EmailFeedbackSchema = EmailFeedbackPostBodySchema.keys({
  accountId: Joi.string().required(),
  id: Joi.string()
    .guid()
    .default(() => uuid.v4(), 'uuid v4'),
});

export type EmailFeedbackWithMaybeAnalysisType = {
  ...EmailFeedbackType,
  analysis: ?FeedbackAnalysisType,
};

export type TwitterFeedbackUnsavedType = {|
  accountId: string,
  statusId: string,
|};

export type TwitterFeedbackType = {
  ...TwitterFeedbackUnsavedType,
  ...ModelSavedFieldsType,
};

export const TwitterFeedbackSchema = Joi.object({
  accountId: Joi.string().required(),
  id: Joi.string()
    .guid()
    .default(() => uuid.v4(), 'uuid v4'),
  statusId: Joi.string().required(),
})
  .unknown()
  .required();

export type TwitterFeedbackWithMaybeAnalysisType = {
  ...TwitterFeedbackType,
  analysis: ?FeedbackAnalysisType,
};

// currently only 1 tier
export type AccountTierType = 'free';

export type AccountSettingPostBodyType = {|
  twitterSearches: string[],
|};

export type AccountSettingUnsavedType = {|
  ...AccountSettingPostBodyType,
  accountId: string,
  feedbackUsageByDate: {
    [key: YearMonthBucketType]: number,
  },
  tier: AccountTierType,
|};

export type AccountSettingType = {
  ...AccountSettingUnsavedType,
  ...ModelSavedFieldsType,
};

export const AccountSettingPostBodySchema = Joi.object({
  twitterSearches: Joi.array()
    .items(Joi.string().required())
    .required(),
})
  .unknown()
  .required();
