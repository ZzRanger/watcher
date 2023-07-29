import { supabase } from '~/root';
import { For, createResource, createSignal } from 'solid-js';
import {
  A,
  RouteDataArgs,
  useNavigate,
  useParams,
  useRouteData,
} from 'solid-start';
import Person from '~/components/Person';
import { createEffect } from 'solid-js';
import H1 from '~/components/H1';
import Navbar from '~/components/Navbar';
import Fab from '~/components/Fab';

export function routeData({ params }: RouteDataArgs) {
  // load some data
  const [peopleData] = createResource(async () => {
    const { data, error } = await supabase.from('person').select();

    if (error === null) return data;
    return error;
  });
  return { peopleData };
}

export default function SessionPage() {
  // Write some sort of code to fetch user data

  // Should also display if the user has already been checked in?
  // Or just show people who haven't been checked in I think

  const { peopleData } = useRouteData<typeof routeData>();
  const params = useParams<{ code: string }>();

  // Store all the selected ids here
  // Use a signal for now, modify if it's jank
  const [selectedIds, setSelectedIds] = createSignal([] as any[]);

  const navigate = useNavigate();

  const handleSelect = (val: any) => {
    console.log(selectedIds());
    if (selectedIds().includes(val)) {
      setSelectedIds(selectedIds().filter((t) => t !== val));
    } else {
      setSelectedIds([...selectedIds(), val]);
    }
  };

  const handleSubmit = async () => {
    // Data to insert
    const currentTime = new Date().toISOString();
    console.log(currentTime);
    const newCheckins = selectedIds().map((id) => {
      return { person: id, session: params.code, check_in_time: currentTime };
    });
    const { data, error } = await supabase
      .from('check_in')
      .insert(newCheckins)
      .select();

    if (data) {
      navigate(`/session/${params.code}`);
    }
    if (error) {
      alert('An error has occured');
    }
  };

  return (
    <main class="flex-col-center layout gap-y-[20px]">
      <Navbar />
      <H1>Check-in</H1>

      <section class="flex w-[320px] flex-row items-center justify-between ">
        {/* In future make this separate page */}
        <select
          id="countries"
          class="block w-[140px] rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          <option selected>Classroom</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="FR">France</option>
          <option value="DE">Germany</option>
        </select>
        <A
          href={`/session/${params.code}/checkin/addChild`}
          class="text-sm text-primary"
        >
          + Add new child
        </A>
      </section>
      <input
        class=" h-[36px] w-[350px] rounded-[10px] bg-[#EBEBEB] px-5 text-xl text-[#6B7280] placeholder-[#6B7280]"
        placeholder="Search"
        onChange={(e) => {}}
      />
      <section class="mt-2 w-[350px] overflow-y-scroll">
        <For each={peopleData() as any[] | null}>
          {(personData) => (
            <Person
              personData={personData}
              checkinData={null}
              handleSelect={handleSelect}
            />
          )}
        </For>
      </section>

      <div class="absolute bottom-[5vh] left-0 flex h-10 w-screen items-center justify-center">
        <Fab onClick={handleSubmit} class="bg-primary text-xl text-white">
          Done
        </Fab>
      </div>
    </main>
  );
}
