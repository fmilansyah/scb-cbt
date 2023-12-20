export type Organization = {
  id: number
  code: string
  name: string
  organization_level_id: string
  actived: number
  expired_at?: string
  created_at?: string
  updated_at?: string
  created_by?: string
  updated_by?: string
  logo_url?: string
  data?: OrganizationData
}

export type OrganizationData = {
  id: number
  organization_id: number
  logo?: string
  address?: string
  email?: string
  website?: string
  phone?: string
  village_name?: string
  city_name?: string
  district_name?: string
  province_name?: string
  postal_code?: string
  headmaster_name?: string
  headmaster_nip?: string
  logo_url?: string
}
