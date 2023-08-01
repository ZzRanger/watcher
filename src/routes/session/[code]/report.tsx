import { For, createResource } from 'solid-js';
import { A, RouteDataArgs, useParams, useRouteData } from 'solid-start';
import BackComponent from '~/components/BackComponent';
import H1 from '~/components/H1';
import Navbar from '~/components/Navbar';
import Person from '~/components/Person';
import { supabase } from '~/root';
import { PersonType, SessionType } from '~/utils/models';
import { formatReportDate, formatReportTime } from '~/utils/utils';

const baseUrl = import.meta.env.VITE_VERCEL_URL;

export function routeData({ params }: RouteDataArgs) {
  // load some data

  const [peopleData] = createResource(async () => {
    const { data, error } = await supabase
      .from('check_in')
      .select(
        `
        *,
    person(*)
    `
      )
      .eq('session', params.code);

    if (error === null) return data;
    return error;
  });

  const [sessionData] = createResource(async () => {
    const { data, error } = await supabase
      .from('session')
      .select()
      .eq('id', params.code)
      .single();

    if (error === null) return data as SessionType;
    throw error;
  });

  return { peopleData, sessionData };
}

export default function Report() {
  const params = useParams<{ code: string }>();

  const { peopleData, sessionData } = useRouteData<typeof routeData>();

  // Add SQL code to get all total check-ins

  return (
    <main class="flex-col-center layout gap-y-[20px]">
      <BackComponent />
      <section class="flex-col-center gap-y-2">
        <H1>Report</H1>
        <p>Name: {sessionData()?.name}</p>
        <p>
          Created:{' '}
          {new Date(sessionData()?.created_at ?? '').toLocaleString('en-US')}
        </p>
        <h3>Attendance:</h3>
      </section>
      <section class="w-[300px]">
        <For each={peopleData() as any[] | null}>
          {(personData, index) => {
            console.log(personData);
            return (
              <article class="flex h-fit w-full flex-row items-center border-b-[1px] border-solid border-b-[#737373] px-[13px] py-[10px]">
                <div class="flex flex-grow flex-col items-start justify-between gap-y-2">
                  <div class="text-base text-[#737373]">
                    {formatReportTime(
                      personData.check_in_time,
                      personData.check_out_time
                    )}
                  </div>
                  <div class="text-xl font-medium">
                    {personData.person.name}
                  </div>
                </div>
                <div class="self-start text-base text-[#737373]">
                  {' '}
                  {formatReportDate(
                    personData.check_in_time,
                    personData.check_out_time
                  )}
                </div>
              </article>
            );
          }}
        </For>
      </section>
    </main>
  );
}
