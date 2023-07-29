import { createResource } from 'solid-js';
import {
  A,
  RouteDataArgs,
  useNavigate,
  useParams,
  useRouteData,
} from 'solid-start';
import BackComponent from '~/components/BackComponent';
import Button from '~/components/Button';
import Classroom from '~/components/Classroom';
import Fab from '~/components/Fab';
import H1 from '~/components/H1';
import BackIcon from '~/components/icons/BackIcon';
import { supabase } from '~/root';

export function routeData({ params }: RouteDataArgs) {
  // load some data

  const [sessionData, { mutate: mutateSessionData }] = createResource(
    async () => {
      const { data, error } = await supabase
        .from('session')
        .select()
        .eq('id', params.code)
        .single();

      if (error === null) return data;
      return error;
    }
  );

  return { sessionData, mutateSessionData };
}

export default function Settings() {
  const { sessionData, mutateSessionData } = useRouteData<typeof routeData>();

  const navigate = useNavigate();

  const params = useParams<{ code: string }>();

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from('session')
      .update({
        ...sessionData(),
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
          />
        </article>
        <Classroom name="test" handleSelect={() => console.log('HI')} />
        <button class="flex items-center justify-center rounded-[50px] border-2 border-solid border-[#999999] px-8 py-3 text-[#444444]">
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
