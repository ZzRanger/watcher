import { createSign } from 'crypto';
import { For, createResource, createSignal } from 'solid-js';
import {
  A,
  RouteDataArgs,
  useNavigate,
  useParams,
  useRouteData,
} from 'solid-start';
import BackComponent from '~/components/BackComponent';
import ClassroomComponent from '~/components/Classroom';
import Fab from '~/components/Fab';
import H1 from '~/components/H1';
import { supabase } from '~/root';
import { ClassroomType, SessionType } from '~/utils/models';

export function routeData({ params }: RouteDataArgs) {
  const [sessionData, { mutate: mutateSessionData }] = createResource(
    async () => {
      const { data, error } = await supabase
        .from('session')
        .select()
        .eq('id', params.code)
        .single();

      if (error === null) return data as SessionType;
      throw error;
    }
  );

  const [classroomsData] = createResource(async () => {
    const { data, error } = await supabase.from('classroom').select();

    if (error === null) return data as ClassroomType[];
    return error;
  });

  return { sessionData, mutateSessionData, classroomsData };
}

export default function Settings() {
  const { sessionData, mutateSessionData, classroomsData } =
    useRouteData<typeof routeData>();

  const [classroomIds, setClassroomIds] = createSignal<number[]>([]);

  const handleSelect = (classroomId: any) => {
    if (classroomIds().includes(classroomId)) {
      setClassroomIds(classroomIds().filter((t) => t !== classroomId));
    } else {
      setClassroomIds([...classroomIds(), classroomId]);
    }
  };

  const navigate = useNavigate();

  const params = useParams<{ code: string }>();

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from('session')
      .update({
        ...sessionData(),
        classroomIds: classroomIds(),
      })
      .eq('id', sessionData()!.id)
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
      <H1>Settings</H1>
      <section class="flex-col-center gap-y-[20px]">
        <article class="flex flex-col">
          <h3 class="ml-5 self-start text-xl font-bold">Name</h3>
          <input
            class=" h-[36px] w-full rounded-[10px] bg-[#EBEBEB] px-5 text-xl text-[#6B7280] placeholder-[#6B7280]"
            placeholder="Ex. Bob"
            value={sessionData()?.name}
            onChange={(e) =>
              mutateSessionData({ ...sessionData()!, name: e.target.value })
            }
          />
        </article>

        <For each={classroomsData() as ClassroomType[] | null}>
          {(classroom, _) => {
            return (
              <ClassroomComponent
                classroom={classroom}
                handleSelect={handleSelect}
              />
            );
          }}
        </For>
        <button
          onClick={() => navigate(`/classroom/addClassroom`)}
          class="flex items-center justify-center rounded-[50px] border-2 border-solid border-[#999999] px-8 py-3 text-[#444444]"
        >
          + Add New Classroom
        </button>
      </section>

      <div class="absolute bottom-[5vh] left-0 flex h-10 w-screen items-center justify-center">
        <Fab onClick={handleSubmit} class="bg-primary text-xl text-white">
          Save
        </Fab>
      </div>
    </main>
  );
}
