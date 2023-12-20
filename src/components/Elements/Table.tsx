import { PaginateResponse } from "@/@core/domain/entities/response/paginate.response";
import { PAGE_SIZES } from "@/shared/constants/theme";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { useRouter } from "next/router";

type PaginationPage = { page?: number, perpage?: number }

interface Props<T> {
  records: T[]
  columns: DataTableColumn<T>[]
  fetching?: boolean
  pagination?: PaginateResponse<T>
  onChange?: ({ page, perpage }: PaginationPage) => void
}

function Table<T>(props: Props<T>) {
  const router = useRouter()

  const handleTableChange = ({ page, perpage }: PaginationPage) => {
    const params: PaginationPage = {
      page: page ?? (router?.query?.page ? router?.query?.page as unknown as number : undefined) ?? 1,
      perpage: perpage ?? (router?.query?.perpage ? router?.query?.perpage as unknown as number : undefined) ?? PAGE_SIZES[0],
    }
    if (props?.onChange) {
      props.onChange(params)
    }
  }

  return (
    <DataTable<T>
      noRecordsText="Tidak Ada Data"
      highlightOnHover
      className="table-hover"
      records={props?.records ?? []}
      columns={props?.columns ?? []}
      fetching={props?.fetching ?? false}
      totalRecords={props?.pagination?.total ?? 0}
      recordsPerPage={props?.pagination?.perpage ?? PAGE_SIZES[0]}
      page={props?.pagination?.current_page ?? 1}
      onPageChange={(p) => handleTableChange({ page: p })}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={(p) => handleTableChange({ perpage: p })}
      paginationText={({ from, to, totalRecords }) => `Menampilkan ${from} s/d ${to} dari ${totalRecords} data`}
    />
  )
}

Table.defaultProps = {
  records: [],
  columns: [],
  fetching: false,
  pagination: null,
}

export default Table
