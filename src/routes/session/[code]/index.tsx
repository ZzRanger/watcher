import { supabase } from '~/root';
import { For, Show, createResource, createSignal } from 'solid-js';
import { A, RouteDataArgs, useParams, useRouteData } from 'solid-start';
import Person from '~/components/Person';
import Navbar from '~/components/Navbar';
import Fab from '~/components/Fab';
import H1 from '~/components/H1';

export function routeData({ params }: RouteDataArgs) {
  // load some data

  const [peopleData, { mutate: mutatePeopleData, refetch: refetchPeopleData }] =
    createResource(async () => {
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
  console.log('HI');
  console.log(peopleData());

  return { peopleData, mutatePeopleData, refetchPeopleData, sessionData };
}

export default function SessionPage() {
  // Write some sort of code to fetch user data
  const { peopleData, refetchPeopleData, sessionData } =
    useRouteData<typeof routeData>();
  // Store all the selected ids here
  // Use a signal for now, modify if it's jank
  const [selectedIds, setSelectedIds] = createSignal([] as any[]);

  const params = useParams<{ code: string }>();

  const handleSelect = (val: any) => {
    if (selectedIds().includes(val)) {
      setSelectedIds(selectedIds().filter((t) => t !== val));
    } else {
      setSelectedIds([...selectedIds(), val]);
    }
  };

  const handleCheckout = async () => {
    // Data to insert
    const currentTime = new Date().toISOString();

    for (const id of selectedIds()) {
      const { data, error } = await supabase
        .from('check_in')
        .update({ check_out_time: currentTime })
        .eq('person', id);
      if (error) {
        alert('ERROR');
        return;
      }
    }
    refetchPeopleData();
    setSelectedIds([]); // Clear select
    alert('Successfully checked out');
  };

  return (
    <main class="flex-col-center layout gap-y-[40px]">
      <Navbar />

      <article class="flex-col-center gap-y-[10px]">
        <H1>
          {!sessionData.loading
            ? sessionData()!.name ?? 'Session Name'
            : 'Session name'}
        </H1>
        <button
          onClick={() => {
            navigator.clipboard.writeText(params.code);
            alert('Code copied');
          }}
          class="flex h-[50px] w-[200px] flex-row items-center justify-center gap-x-2 rounded-[50px] bg-primary text-[16px] text-white"
        >
          <span>Join Code: {params.code}</span>
          <img src="/icon.png" class="mt-[-2px] h-5" />
        </button>
      </article>

      <section class="flex-col-center w-[300px]">
        <input
          class="h-[36px] w-full rounded-[10px] bg-[#EBEBEB] px-5 text-xl text-[#6B7280] placeholder-[#6B7280]"
          placeholder="Search"
          onChange={(e) => {}}
        />
        <article class="mt-2 w-full overflow-y-scroll">
          <For each={peopleData() as any[] | null}>
            {(personData, index) => {
              return (
                <div>
                  <Person
                    personData={personData.person}
                    checkinData={personData.check_in_time}
                    handleSelect={handleSelect}
                  />
                </div>
              );
            }}
          </For>
        </article>

        <Show
          when={selectedIds().length > 0}
          fallback={
            <A
              href="checkin"
              class="absolute bottom-[5vh] left-0 flex h-10 w-screen items-center justify-center"
            >
              <Fab class="bg-primary text-xl text-white">Check-in</Fab>
            </A>
          }
        >
          <div class="absolute bottom-[5vh] left-0 flex h-10 w-screen items-center justify-center">
            <Fab
              onClick={() => handleCheckout()}
              class="bg-primary text-xl text-white"
            >
              Check-out
            </Fab>
          </div>
        </Show>
      </section>
    </main>
  );
}
