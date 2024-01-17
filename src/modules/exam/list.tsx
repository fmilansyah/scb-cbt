import { ExamUseCase } from '@/@core/application/exam/exam.usecase';
import { Exam, ExamListRequest } from '@/@core/domain/entities/exam';
import { PaginateResponse } from '@/@core/domain/entities/response/paginate.response';
import { Registry, container } from '@/@core/infrastructure/container-registry';
import { NetworkStatus } from '@/shared/constants/network';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { serialize } from '@/shared/utils/normalize';
import { PAGE_SIZES } from '@/shared/constants/theme';
import { isKeyNotAvailable } from '@/shared/utils/formatter';
import { Button, Table } from '@/components/Elements';
import Link from 'next/link';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween)

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
          return dayjs(record?.date, 'YYYY-MM-DD').format('DD MMM YYYY')
        }
        return
      }
    },
    { accessor: 'start_time', title: 'Jam Mulai' },
    { accessor: 'end_time', title: 'Jam Selesai' },
    {
      accessor: 'accessor',
      title: 'Aksi',
      render: (record: Exam) => {
        const date = dayjs(record.date, 'YYYY-MM-DDTHH:mm:ssZ').format('YYYY-MM-DD')
        if (dayjs().isBetween(
          dayjs(date + ' ' + record.start_time, 'YYYY-MM-DD HH:mm:ss'),
          dayjs(date + ' ' + record.end_time, 'YYYY-MM-DD HH:mm:ss')
        )) {
          return (
            <Link href={`/exam/${record?.id}/verify-token`}>
              <Button rounded={true} type="primary">Kerjakan</Button>
            </Link>
          )
        } else if (dayjs().isAfter(dayjs(date + ' ' + record.end_time, 'YYYY-MM-DD HH:mm:ss'))) {
          return <Button rounded={true} type="danger" disabled={true}>Kadaluarsa</Button>
        } else if (dayjs().isBefore(dayjs(date + ' ' + record.start_time, 'YYYY-MM-DD HH:mm:ss'))) {
          return <Button rounded={true} type="warning" disabled={true}>Belum Dimulai</Button>
        }
        return (
          <Button rounded={true} type='primary' disabled={true}>Kerjakan</Button>
        )
      }
    }
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
      <form>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
          <div>
            <input type="text" name="title" defaultValue={router?.query?.title} placeholder="Sesi Ujian" className="form-input" />
          </div>
          <div>
            <input type="text" name="exam_name" defaultValue={router?.query?.exam_name} placeholder="Nama Ujian" className="form-input" />
          </div>
          <div>
            <Button htmlType='submit'>Cari</Button>
          </div>
        </div>
      </form>
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
