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

export type FeedbackAnalysisUnsavedType = {|
  accountId: string,
  classification: { [key: string]: number },
  content: string,
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
  classification: Joi.object().pattern(/./, Joi.number()),
  content: Joi.string().required(),
  feedbackId: Joi.string()
    .guid()
    .default(() => uuid.v4(), 'uuid v4'),
  feedbackType: Joi.string()
    .allow(['email', 'twitter', 'zenDesk'])
    .required(),
  user: UserSchema,
  userId: Joi.string().required(),
})
  .unknown()
  .required();

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
  confidenceThresholds: { [key: string]: number },
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
  confidenceThresholds: Joi.object()
    .pattern(/./, Joi.number())
    .required(),
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
      confidenceThresholds: { [key: string]: number },
    |},
  |},
  twitterSearches?: string[],
|};

export const AccountSettingPostBodySchema = Joi.object({
  integrations: Joi.object({
    zenDesk: Joi.object({
      confidenceThresholds: Joi.object()
        .pattern(/./, Joi.number())
        .required(),
    }),
  }),
  twitterSearches: Joi.array()
    .items(Joi.string())
    .default(() => [], 'Do not allow undefined or null to come out of the DB'),
})
  .unknown()
  .required();

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
})
  .unknown()
  .required();
