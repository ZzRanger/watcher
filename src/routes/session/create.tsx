import { For, createResource, createSignal } from 'solid-js';
import { RouteDataArgs, useNavigate, useRouteData } from 'solid-start';
import BackComponent from '~/components/BackComponent';
import ClassroomComponent from '~/components/Classroom';
import Fab from '~/components/Fab';
import H1 from '~/components/H1';

import { supabase } from '~/root';
import { ClassroomType } from '~/utils/models';
import { createUniquSessionId } from '~/utils/utils';
export function routeData({ params }: RouteDataArgs) {
  const [classroomsData] = createResource(async () => {
    const { data, error } = await supabase.from('classroom').select();

    if (error === null) return data as ClassroomType[];
    return error;
  });

  return { classroomsData };
}

export default function Create() {
  const { classroomsData } = useRouteData<typeof routeData>();
  const navigate = useNavigate();
  const [name, setName] = createSignal<string>('');
  const [classroomIds, setClassroomIds] = createSignal<number[]>([]);

  const handleSelect = (classroomId: any) => {
    if (classroomIds().includes(classroomId)) {
      setClassroomIds(classroomIds().filter((t) => t !== classroomId));
    } else {
      setClassroomIds([...classroomIds(), classroomId]);
    }
  };

  const createSession = async () => {
    // Basic input validation
    if (name() === '' || classroomIds().length === 0) {
      return alert('Please add a name and select at least one classroom');
    }
    const { data, error } = await supabase
      .from('session')
      .insert({
        id: createUniquSessionId(),
        name: name(),
        classroomIds: classroomIds(),
      })
      .select();

    if (error) {
      alert('An error has occurred creating a session');
    }
    if (data) {
      navigate(`/session/${data[0].id}`);
    }
  };

  return (
    <main class="flex-col-center layout gap-y-[20px]">
      <BackComponent url="/" />
      <H1>Create Session</H1>
      <section class="flex-col-center gap-y-[30px]">
        <article class="flex flex-col gap-y-[10px]">
          <h3 class="self-start text-xl font-bold">Name</h3>
          <input
            class=" h-[36px] w-full rounded-[10px] bg-[#EBEBEB] px-5 text-xl text-[#6B7280] placeholder-[#6B7280]"
            placeholder="Ex. Bob"
            onChange={(e) => setName(e.target.value)}
            value={name()}
          />
        </article>
        <article class="flex w-full flex-col gap-y-[10px]">
          <h3 class=" self-start text-xl font-bold">Classrooms</h3>
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
        </article>
        <button
          onClick={() => navigate(`/classroom/addClassroom`)}
          class="flex items-center justify-center rounded-[50px] border-2 border-solid border-[#999999] px-8 py-3 text-[#444444]"
        >
          + Add New Classroom
        </button>
      </section>

      <div class="absolute bottom-[5vh] left-0 flex h-10 w-screen items-center justify-center">
        <Fab
          onClick={() => createSession()}
          class="bg-primary text-xl text-white"
        >
          Save
        </Fab>
      </div>
    </main>
  );
}
