// @flow

import Joi from 'joi-browser';
import uuid from 'uuid';

// https://github.com/benmosher/eslint-plugin-import/issues/921
/* eslint-disable import/named */
import {
  YearMonthBucketRegex,
  type YearMonthBucketType,
} from './YearMonthBucket';
/* eslint-enable */

export type ModelSavedFieldsType = {|
  accountId: string,
  createdAt: string,
  id: string,
  updatedAt?: string,
|};

const ModelSavedFieldsSchema = {
  accountId: Joi.string().required(),
  createdAt: Joi.date()
    .iso()
    .required(),
  id: Joi.string()
    .guid()
    .default(() => uuid.v4(), 'uuid v4'),
  updatedAt: Joi.date().iso(),
};

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
    .default(() => [], 'Do not allow undefined or null to come out of the DB'),
}).unknown();

export type FeedbackType = 'email' | 'twitter';

export type TwitterUserType = {|
  avatarUrl: string,
  id: string,
  username: string,
|};

export const TwitterUserSchema = Joi.object({
  avatarUrl: Joi.string()
    .uri()
    .required(),
  id: Joi.string().required(),
  username: Joi.string().required(),
}).unknown();

export type EmailUserType = {|
  id: string,
|};

export const EmailUserSchema = Joi.object({
  id: Joi.string()
    .email()
    .required(),
}).unknown();

export type UserType = EmailUserType | TwitterUserType;

export const UserSchema = Joi.compile([TwitterUserSchema, EmailUserSchema]);

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
  user: UserType,
  userId: string,
|};

export type FeedbackAnalysisType = {
  ...FeedbackAnalysisUnsavedType,
  ...ModelSavedFieldsType,
};

export const FeedbackAnalysisSchema = Joi.object({
  ...ModelSavedFieldsSchema,
  contentSentiment: SentimentSchema.required(),
  documentClassification: Joi.array()
    .items(ClassSchema)
    .default(() => [], 'Do not allow undefined or null to come out of the DB'),
  feedbackId: Joi.string()
    .guid()
    .default(() => uuid.v4(), 'uuid v4'),
  feedbackType: Joi.string()
    .allow(['email', 'twitter'])
    .required(),
  sentences: Joi.array()
    .items(
      SentenceSchema.keys({
        classification: Joi.array()
          .items(ClassSchema)
          .default(
            () => [],
            'Do not allow undefined or null to come out of the DB'
          ),
      }).required()
    )
    .default(() => [], 'Do not allow undefined or null to come out of the DB'),
  topDocumentClasses: Joi.array()
    .items(Joi.string())
    .default(() => [], 'Do not allow undefined or null to come out of the DB'),
  topSentenceClasses: Joi.array()
    .items(Joi.string())
    .default(() => [], 'Do not allow undefined or null to come out of the DB'),
  user: UserSchema,
  userId: Joi.string().required(),
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
    .default(() => [], 'Do not allow undefined or null to come out of the DB'),
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
  ...ModelSavedFieldsSchema,
})
  .unknown()
  .required();

export type EmailFeedbackWithMaybeAnalysisType = {
  ...EmailFeedbackType,
  analysis: ?FeedbackAnalysisType,
};

export const EmailFeedbackWithMaybeAnalysisSchema = EmailFeedbackSchema.keys({
  analysis: FeedbackAnalysisSchema,
})
  .unknown()
  .required();

export type TwitterFeedbackUnsavedType = {|
  accountId: string,
  statusId: string,
  user: TwitterUserType,
|};

export type TwitterFeedbackType = {
  ...TwitterFeedbackUnsavedType,
  ...ModelSavedFieldsType,
};

export const TwitterFeedbackSchema = Joi.object({
  ...ModelSavedFieldsSchema,
  statusId: Joi.string().required(),
  user: TwitterUserSchema.required(),
})
  .unknown()
  .required();

export type TwitterFeedbackWithMaybeAnalysisType = {
  ...TwitterFeedbackType,
  analysis: ?FeedbackAnalysisType,
};

export const TwitterFeedbackWithMaybeAnalysisSchema = TwitterFeedbackSchema.keys(
  {
    analysis: FeedbackAnalysisSchema,
  }
)
  .unknown()
  .required();

// currently only 1 tier
export type AccountTierType = 'free';

export type AccountSettingPostBodyType = {|
  twitterSearches: string[],
|};

export const AccountSettingPostBodySchema = Joi.object({
  twitterSearches: Joi.array()
    .items(Joi.string())
    .default(() => [], 'Do not allow undefined or null to come out of the DB'),
})
  .unknown()
  .required();

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

export const AccountSettingSchema = Joi.object({
  ...ModelSavedFieldsSchema,
  feedbackUsageByDate: Joi.object()
    .pattern(
      YearMonthBucketRegex,
      Joi.number()
        .min(0)
        .required()
    )
    .required(),
  id: Joi.string().required(),
  tier: Joi.string()
    .valid(['free'])
    .required(),
  twitterSearches: Joi.array()
    .items(Joi.string())
    .default(() => [], 'Do not allow undefined or null to come out of the DB'),
})
  .unknown()
  .required();
