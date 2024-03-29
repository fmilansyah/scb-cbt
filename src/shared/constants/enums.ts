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

const DurationTypeEnum = {
  PACKAGE: 'package',
  QUESTION: 'question',
}
export const DurationType = DurationTypeEnum && {
  Enum: DurationTypeEnum,
  List: [
    {
      id: DurationTypeEnum.PACKAGE,
      name: 'Paket Soal',
    },
    {
      id: DurationTypeEnum.QUESTION,
      name: 'Soal',
    },
  ],
}

const ViolationEventCodeEnum = {
  MULTI_LOGIN: 'MLG',
  FULL_SCREEN: 'FSC',
  LOST_FOCUS: 'LFS',
}
export const ViolationEventCode = ViolationEventCodeEnum && {
  Enum: ViolationEventCodeEnum,
  List: [
    {
      id: ViolationEventCodeEnum.MULTI_LOGIN,
      name: 'Multi Login',
      description: 'Peserta ujian ini terdeteksi membuka ujian pada lebih dari 1 perangkat',
    },
    {
      id: ViolationEventCodeEnum.FULL_SCREEN,
      name: 'Full Screen',
      description: 'Peserta ujian ini terdeteksi keluar dari mode layar penuh',
    },
    {
      id: ViolationEventCodeEnum.LOST_FOCUS,
      name: 'Lost Focus',
      description: 'Peserta ujian ini terdeteksi meninggalkan layar ujian',
    },
  ],
}
