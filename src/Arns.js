// @flow

export const getAnalyzeFeedbackTopicName = (stage: string) =>
  `analyze-feedback-${stage}`;

export const getAnalyzeFeedbackSNS = (stage: string) => ({
  'Fn::Join': [
    '',
    [
      'arn:aws:sns:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      `:${getAnalyzeFeedbackTopicName(stage)}*`,
    ],
  ],
});

export const getTableNamePrefix = (stage: string) =>
  `feedback-analysis-api-${stage}`;

export const getDynamoDbGlobalArn = (stage: string) => ({
  'Fn::Join': [
    '',
    [
      'arn:aws:dynamodb:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      `:table/${getTableNamePrefix(stage)}*`,
    ],
  ],
});
