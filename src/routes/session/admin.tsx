import { For, createResource } from 'solid-js';
import { A, RouteDataArgs, useRouteData } from 'solid-start';
import BackComponent from '~/components/BackComponent';
import H1 from '~/components/H1';
import Person from '~/components/Person';
import PersonInfo from '~/components/PersonInfo';
import BackIcon from '~/components/icons/BackIcon';
import { supabase } from '~/root';

export function routeData({ params }: RouteDataArgs) {
  // load some data

  const [sessionData] = createResource(async () => {
    const { data, error } = await supabase.from('session').select();

    if (error === null) return data;
    return error;
  });

  const [peopleData] = createResource(async () => {
    const { data, error } = await supabase.from('person').select();

    if (error === null) return data;
    return error;
  });

  return { sessionData, peopleData };
}

export default function AdminDashboard() {
  // Should show all the sessions created
  // As well as all the children

  const { sessionData, peopleData } = useRouteData<typeof routeData>();

  return (
    <main class="flex-col-center layout gap-y-[20px] overflow-y-scroll">
      <BackComponent />

      <section class="flex-col-center gap-y-1">
        <H1>Children</H1>
        <div class="font-bold">
          {!peopleData.loading ? peopleData()!.length : '0'} total children
        </div>
      </section>
      <section class="flex-col-center w-[300px]">
        <input
          class="h-[36px] w-full rounded-[10px] bg-[#EBEBEB] px-5 text-xl text-[#6B7280] placeholder-[#6B7280]"
          placeholder="Search"
          onChange={(e) => {}}
        />
        <For each={peopleData() as any[] | null}>
          {(person, _) => {
            return (
              <A href={`/editChild/${person.id}`} class="w-[300px]">
                <PersonInfo personData={person} />
              </A>
            );
          }}
        </For>
      </section>
      <section class="flex-col-center mt-10 gap-y-1">
        <H1>Sessions</H1>
        <div class="font-bold">
          {!peopleData.loading ? peopleData()!.length : '0'} total sessions
        </div>
      </section>
      <section class="flex-col-center w-[300px]">
        <input
          class="h-[36px] w-full rounded-[10px] bg-[#EBEBEB] px-5 text-xl text-[#6B7280] placeholder-[#6B7280]"
          placeholder="Search"
          onChange={(e) => {}}
        />
        <For each={sessionData() as any[] | null}>
          {(session, _) => {
            return (
              <A href={`/session/${session.id}`} class="w-full">
                <article class="flex h-fit w-full flex-col items-start border-b-[1px] border-solid border-b-[#737373] px-[13px] py-[10px]">
                  <div class="text-base text-[#737373]">Created: 10:00AM</div>
                  <div class="text-xl font-medium">
                    {session.name ?? 'session name'}
                  </div>
                </article>
              </A>
            );
          }}
        </For>
      </section>
    </main>
  );
}
