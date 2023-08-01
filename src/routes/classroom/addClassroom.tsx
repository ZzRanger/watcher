import { createResource, createSignal } from 'solid-js';
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

export default function AddClassroom() {
  const navigate = useNavigate();
  const [name, setName] = createSignal('');

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from('classroom')
      .insert({ name: name() })
      .select();

    if (data) {
      navigate(`/session/create`);
    }
    if (error) {
      alert('An error has occured');
    }
  };

  return (
    <main class="flex-col-center layout gap-y-[20px]">
      <BackComponent />
      <H1>Add Classroom</H1>
      <section class="flex-col-center gap-y-[20px]">
        <article class="flex flex-col">
          <h3 class="ml-5 self-start text-xl font-bold">Name</h3>
          <input
            class=" h-[36px] w-full rounded-[10px] bg-[#EBEBEB] px-5 text-xl text-[#6B7280] placeholder-[#6B7280]"
            placeholder="Ex. Bob"
            value={name()}
            onChange={(e) => setName(e.target.value)}
          />
        </article>
      </section>

      <div class="absolute bottom-[5vh] left-0 flex h-10 w-screen items-center justify-center">
        <Fab onClick={handleSubmit} class="bg-primary text-xl text-white">
          Save
        </Fab>
      </div>
    </main>
  );
}
