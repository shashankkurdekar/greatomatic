import BookAppointmentComponent from './BookAppointmentComponent';
import jwt from 'jsonwebtoken';
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function BookAppointment({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams.id || '';
  const decoded = jwt.decode(id.toString());
  const state = decoded && typeof decoded !== 'string' ? decoded.state : undefined;
  const district = decoded && typeof decoded !== 'string' ? decoded.district : undefined;
  const taluk = decoded && typeof decoded !== 'string' ? decoded.taluk : undefined;
  const landmark = decoded && typeof decoded !== 'string' ? decoded.landmark : undefined;
  const address = `${state}->${district}->${taluk}->${landmark}`
  const date = decoded && typeof decoded !== 'string' ? decoded.date : undefined;
  const start_time = decoded && typeof decoded !== 'string' ? decoded.start_time : undefined;
  const end_time = decoded && typeof decoded !== 'string' ? decoded.end_time : undefined;
  return (
    <BookAppointmentComponent address={address} date={date} start_time={start_time} end_time={end_time} id={id.toString()} />
  )
}
