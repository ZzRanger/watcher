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
import { CheckinType, ClassroomType, PersonType } from '~/utils/models';
import BackComponent from '~/components/BackComponent';

// Add ability to see children checked in
export function routeData({ params }: RouteDataArgs) {
  const [peopleData, { mutate: mutatePeopleData, refetch: refetchPeopleData }] =
    createResource(async () => {
      const { data: peopleData, error: peopleDataError } = await supabase
        .from('check_in')
        .select(
          `
          *,
      person(*)
      `
        )
        .eq('session', params.code)
        .is('check_out_time', null);

      if (peopleDataError !== null) throw peopleDataError;

      const peopleIds: number[] = peopleData.map((person) => person.id);

      const { data, error } = await supabase.from('person').select();

      if (error === null)
        return data.filter((person) => !peopleIds.includes(person.id));
      throw error;
    });

  const [classroomsData] = createResource(async () => {
    // Fetch session data
    const { data: sessionData, error: sessionDataError } = await supabase
      .from('session')
      .select()
      .eq('id', params.code)
      .single();

    const classroomIds: number[] = sessionData!.classroomIds ?? [];

    const { data, error } = await supabase
      .from('classroom')
      .select()
      .in('id', classroomIds);

    if (error === null) return data;
    throw error;
  });
  return { peopleData, classroomsData };
}

export default function SessionPage() {
  const { peopleData, classroomsData } = useRouteData<typeof routeData>();
  const params = useParams<{ code: string }>();

  const [selectedIds, setSelectedIds] = createSignal([] as number[]);
  const [classroom, setClassroom] = createSignal('Classroom');

  const navigate = useNavigate();

  const handleSelect = (selectedId: number) => {
    if (selectedIds().includes(selectedId)) {
      setSelectedIds(selectedIds().filter((t) => t !== selectedId));
    } else {
      setSelectedIds([...selectedIds(), selectedId]);
    }
  };

  const handleSubmit = async () => {
    // Add basic input validation

    const currentTime = new Date().toISOString();

    const newCheckins: CheckinType[] = selectedIds().map((id) => {
      return {
        person: id,
        session: params.code,
        check_in_time: currentTime,
        classroomId: Number(classroom()),
      };
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
      <BackComponent />
      <H1>Check-in</H1>

      <section class="flex w-[320px] flex-row items-center justify-between ">
        {/* In future make this separate page */}
        <select
          id="countries"
          class="block w-[140px] rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          value={classroom()}
          onChange={(e) => setClassroom(e.target.value)}
        >
          <option selected>Classroom</option>

          <For each={classroomsData() as ClassroomType[]}>
            {(classroom) => (
              <option value={`${classroom.id}`}>{classroom.name}</option>
            )}
          </For>
        </select>
        <A
          href={`/session/${params.code}/checkin/addChild`}
          class="text-sm text-primary"
        >
          + Add new child
        </A>
      </section>
      {/* <input
        class=" h-[36px] w-[350px] rounded-[10px] bg-[#EBEBEB] px-5 text-xl text-[#6B7280] placeholder-[#6B7280]"
        placeholder="Search"
        onChange={(e) => {}}
      /> */}
      <section class="mt-2 w-[350px] overflow-y-scroll">
        <For each={peopleData() as PersonType[] | null}>
          {(personData) => (
            <Person
              person={personData}
              checkinTime={'Not checked in'}
              classroom=""
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
