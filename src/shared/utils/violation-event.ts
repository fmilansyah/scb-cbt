import { ViolationEventCode } from "../constants/enums"

export const getViolationData = (code: string) => {
  const violationData = ViolationEventCode.List.find((obj) => obj.id === code)
  return {
    code: violationData?.id ?? null,
    name: violationData?.name ?? null,
    description: violationData?.description ?? null,
  }
}
