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

export {
  getAnalyzeFeedbackSNS,
  getAnalyzeFeedbackTopicName,
  getTableNamePrefix,
  getDynamoDbGlobalArn,
} from './Arns';

export type ModelSavedFieldsType = {|
  accountId: string,
  createdAt: string,
  id: string,
  updatedAt?: string,
|};

const ModelSavedFieldsSchema = {
  accountId: Joi.string().required(),
  createdAt: Joi.string()
    .isoDate()
    .required(),
  id: Joi.string()
    .guid()
    .default(() => uuid.v4(), 'uuid v4'),
  updatedAt: Joi.string().isoDate(),
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

export type SentimentType = {|
  magnitude: number,
  score: number,
|};

export const SentimentSchema = Joi.object({
  magnitude: Joi.number()
    .min(0)
    .required(),
  score: Joi.number()
    .min(-1)
    .max(1)
    .required(),
}).unknown();

export type CategoryConfidenceType = {
  categoryName: string,
  confidence: number,
};

export const CategorySchema = Joi.object({
  categoryName: Joi.string().required(),
  confidence: Joi.number()
    .min(0)
    .max(1)
    .required(),
}).unknown();

export type SentenceType = {|
  sentiment: SentimentType,
  text: TextSpanType,
|};

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

export type FeedbackType = 'email' | 'twitter' | 'zenDesk';

export type ZenDeskUserType = {|
  email: string,
  id: number,
  name: string,
|};

export const ZenDeskUserSchema = Joi.object({
  email: Joi.string().email(),
  id: Joi.number()
    .min(0)
    .required(),
  name: Joi.string().required(),
}).unknown();

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

export type UserType = EmailUserType | TwitterUserType | ZenDeskUserType;

export const UserSchema = Joi.compile([
  TwitterUserSchema,
  EmailUserSchema,
  ZenDeskUserSchema,
]);

export type FeedbackSentimentAndCategorizationType = {|
  contentSentiment: SentimentType,
  documentCategorization: CategoryConfidenceType[],
  sentences: Array<{
    categorization: CategoryConfidenceType[],
    ...SentenceType,
  }>,
  topDocumentCategories: Array<string>,
  topSentenceCategories: Array<string>,
|};

export type FeedbackAnalysisUnsavedType = {|
  ...FeedbackSentimentAndCategorizationType,
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
  documentCategorization: Joi.array()
    .items(CategorySchema)
    .default(() => [], 'Do not allow undefined or null to come out of the DB'),
  feedbackId: Joi.string()
    .guid()
    .default(() => uuid.v4(), 'uuid v4'),
  feedbackType: Joi.string()
    .allow(['email', 'twitter', 'zenDesk'])
    .required(),
  sentences: Joi.array()
    .items(
      SentenceSchema.keys({
        categorization: Joi.array()
          .items(CategorySchema)
          .default(
            () => [],
            'Do not allow undefined or null to come out of the DB'
          ),
      }).required()
    )
    .default(() => [], 'Do not allow undefined or null to come out of the DB'),
  topDocumentCategories: Joi.array()
    .items(Joi.string())
    .default(() => [], 'Do not allow undefined or null to come out of the DB'),
  topSentenceCategories: Joi.array()
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

export type ZenDeskTicketPostBodyType = {|
  description: string,
  ticketId: number,
  title: string,
  user: ZenDeskUserType,
|};

export const ZenDeskTicketPostBodySchema = Joi.object({
  description: Joi.string().required(),
  ticketId: Joi.number().required(),
  title: Joi.string().required(),
  user: ZenDeskUserSchema.required(),
})
  .unknown()
  .required();

export type ZenDeskTicketUnsavedType = {|
  ...ZenDeskTicketPostBodyType,
  accountId: string,
|};

export type ZenDeskTicketType = {|
  ...ZenDeskTicketUnsavedType,
  ...ModelSavedFieldsType,
|};

export const ZenDeskTicketSchema = ZenDeskTicketPostBodySchema.keys({
  ...ModelSavedFieldsSchema,
})
  .unknown()
  .required();

export type ZenDeskTicketWithMaybeAnalysisType = {
  ...ZenDeskTicketType,
  analysis: ?FeedbackAnalysisType,
};

export const ZenDeskTicketWithMaybeAnalysisSchema = ZenDeskUserSchema.keys({
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

export type AccountTierType = 'notApproved' | 'free';

export type AccountIntegrationStatusType =
  | 'disconnected'
  | 'awaitingApproval'
  | 'connected';

export type AccountIntegrationType = {|
  status: AccountIntegrationStatusType,
  token?: string,
|};

export type ZenDeskIntegrationType = {
  ...AccountIntegrationType,
  confidenceThreshold: number,
  fieldId?: number,
  subdomain: string,
  ticketImport: {
    inProgress: boolean,
    nextPage: number,
  },
};

export const AccountIntegrationSchema = Joi.object({
  status: Joi.string()
    .valid(['disconnected', 'awaitingApproval', 'connected'])
    .default('disconnected'),
  token: Joi.string().required(),
})
  .optionalKeys('token')
  .unknown()
  .default();

export const ZenDeskIntegrationSchema = AccountIntegrationSchema.keys({
  confidenceThreshold: Joi.number(),
  fieldId: Joi.number(),
  subdomain: Joi.string()
    .allow('')
    .default(''),
  ticketImport: Joi.object({
    inProgress: Joi.boolean().default(false),
    nextPage: Joi.number().default(0),
  })
    .unknown()
    .default(),
});

export type AccountSettingPostBodyType = {|
  integrations?: {|
    zenDesk: {|
      confidenceThreshold: number,
    |},
  |},
  twitterSearches?: string[],
|};

export const AccountSettingPostBodySchema = Joi.object({
  integrations: Joi.object({
    zenDesk: Joi.object({
      confidenceThreshold: Joi.number(),
    }),
  }),
  twitterSearches: Joi.array()
    .items(Joi.string())
    .default(() => [], 'Do not allow undefined or null to come out of the DB'),
})
  .unknown()
  .required();

export type WatsonClassifierType = {|
  classifier_id: string,
  created: string,
  language: string,
  name: string,
  status: 'Non Existent' | 'Training' | 'Failed' | 'Available' | 'Unavailable',
  status_description: string,
  url: string,
|};

export const WatsonClassifierSchema = Joi.object({
  classifier_id: Joi.string().required(),
  created: Joi.string().required(),
  language: Joi.string().required(),
  name: Joi.string().required(),
  status: Joi.string()
    .valid(['Non Existent', 'Training', 'Failed', 'Available', 'Unavailable'])
    .required(),
  status_description: Joi.string().required(),
  url: Joi.string().required(),
});

export type AccountSettingUnsavedType = {|
  accountId: string,
  apiToken: ?string,
  feedbackUsageByDate: {
    [key: YearMonthBucketType]: number,
  },
  integrations: {
    zenDesk: ZenDeskIntegrationType,
  },
  tier: AccountTierType,
  twitterSearches?: string[],
  watsonClassifier: ?WatsonClassifierType,
|};

export type AccountSettingType = {
  ...AccountSettingUnsavedType,
  ...ModelSavedFieldsType,
};

export const AccountSettingSchema = Joi.object({
  ...ModelSavedFieldsSchema,
  apiToken: Joi.string().guid(),
  feedbackUsageByDate: Joi.object()
    .pattern(
      YearMonthBucketRegex,
      Joi.number()
        .min(0)
        .required()
    )
    .required(),
  id: Joi.string().required(),
  integrations: Joi.object({
    zenDesk: ZenDeskIntegrationSchema,
  }).default(),
  tier: Joi.string()
    .valid(['notApproved', 'free'])
    .default('notApproved'),
  twitterSearches: Joi.array()
    .items(Joi.string())
    .default(() => [], 'Do not allow undefined or null to come out of the DB'),
  watsonClassifier: WatsonClassifierSchema,
})
  .unknown()
  .required();
