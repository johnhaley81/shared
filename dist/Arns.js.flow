// @flow

export const getAnalyzeFeedbackTopicName = (stage: string) =>
  `analyze-feedback-${stage}`;

export const getAnalyzeFeedbackSNS = (stage: string) =>
  `arn:aws:sns:#{AWS::Region}:#{AWS::AccountId}:${getAnalyzeFeedbackTopicName(
    stage
  )}`;

export const getTableNamePrefix = (stage: string) =>
  `feedback-analysis-api-${stage}`;

export const getDynamoDbGlobalArn = (stage: string) =>
  `arn:aws:dynamodb:#{AWS::Region}:#{AWS::AccountId}:table/${getTableNamePrefix(
    stage
  )}`;
