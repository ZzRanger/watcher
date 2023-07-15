import { For, createResource } from 'solid-js';
import { A, RouteDataArgs, useParams, useRouteData } from 'solid-start';
import Person from '~/components/Person';
import { supabase } from '~/root';

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
      .eq('session', params.code)
      .is('check_out_time', null);

    if (error === null) return data;
    return error;
  });

  const [sessionData] = createResource(async () => {
    const { data, error } = await supabase
      .from('session')
      .select()
      .eq('id', params.code)
      .single();

    if (error === null) return data;
    return error;
  });

  console.log(peopleData());
  console.log('HI');

  return { peopleData, sessionData };
}

export default function Report() {
  const params = useParams<{ code: string }>();

  const { peopleData, sessionData } = useRouteData<typeof routeData>();

  // Add SQL code to get all total check-ins

  return (
    <div
      style={{
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        padding: '16px',
        'justify-content': 'center',
        height: '100vh',
      }}
    >
      <h1>{sessionData()?.name}</h1>
      <p>
        Created: {new Date(sessionData()?.created_at).toLocaleString('en-US')}
      </p>
      <h3>Attendance:</h3>
      <For each={peopleData() as any[] | null}>
        {(personData, index) => {
          return (
            <div
              style={{
                background: `${index() % 2 == 0 ? 'lightgray' : ''}`,
              }}
            >
              {personData.person.name}
            </div>
          );
        }}
      </For>
    </div>
  );
}
