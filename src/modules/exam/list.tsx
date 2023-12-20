import { ExamUseCase } from '@/@core/application/exam/exam.usecase';
import { Exam, ExamListRequest } from '@/@core/domain/entities/exam';
import { PaginateResponse } from '@/@core/domain/entities/response/paginate.response';
import { Registry, container } from '@/@core/infrastructure/container-registry';
import { NetworkStatus } from '@/shared/constants/network';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { serialize } from '@/shared/utils/normalize';
import { PAGE_SIZES } from '@/shared/constants/theme';
import { isKeyNotAvailable } from '@/shared/utils/formatter';
import { Table } from '@/components/Elements';

const ExamList = () => {
  const router = useRouter()
  const useCase = container.get<ExamUseCase>(Registry.ExamUseCase)

  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<PaginateResponse<Exam>>()

  const getList = async (params: ExamListRequest = {}) => {
    setLoading(true)
    if (isKeyNotAvailable(params.perpage)) {
      params.perpage = PAGE_SIZES[0]
    }
    const exec = await useCase.get(params)
    setLoading(false)
    if (exec.status === NetworkStatus.SUCCESS && exec.data !== null) {
      setData(exec.data)
    }
  }

  useEffect(() => {
    if (!router.isReady) return
    getList(router.query)
  }, [router.isReady])

  const columns = [
    {
      accessor: 'index',
      title: '#',
      width: 50,
      render: (record: Exam, index: number) => index + 1,
    },
    { accessor: 'title', title: 'Sesi Ujian' },
    { accessor: 'exam_name', title: 'Nama Ujian' },
    {
      accessor: 'date', title: 'Tanggal', render: (record: Exam) => {
        if (record?.date) {
          return dayjs(record?.date, 'YYYY-MM-DD').format('DD/MM/YYYY')
        }
        return
      }
    },
    { accessor: 'start_time', title: 'Jam Mulai' },
    { accessor: 'end_time', title: 'Jam Selesai' },
  ]

  const handleTableChange = (params: ExamListRequest) => {
    const newParams = {
      ...(router?.query ?? {}),
      page: params?.page,
      perpage: params?.perpage,
    }
    router.push(location.pathname + '?' + serialize(newParams), undefined, {
      shallow: true,
    })
    getList(newParams)
  }

  return (
    <div>
      <div className="datatables">
        <Table<Exam>
          records={data?.data ?? []}
          columns={columns}
          fetching={loading}
          pagination={data}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default ExamList;
