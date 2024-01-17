const QuestionTypeEnum = {
  SEQUENCE: 1,
  NOT_SEQUENCE: 2,
}
export const QuestionType = QuestionTypeEnum && {
  Enum: QuestionTypeEnum,
  List: [
    {
      id: QuestionTypeEnum.SEQUENCE,
      name: 'Berurutan',
    },
    {
      id: QuestionTypeEnum.NOT_SEQUENCE,
      name: 'Tidak Berurutan',
    },
  ],
}