import { createResource } from 'solid-js';
import {
  RouteDataArgs,
  useNavigate,
  useParams,
  useRouteData,
} from 'solid-start';
import BackComponent from '~/components/BackComponent';
import Fab from '~/components/Fab';
import H1 from '~/components/H1';
import { supabase } from '~/root';
import { PersonType } from '~/utils/models';

export function routeData({ params }: RouteDataArgs) {
  const [personData, { mutate: mutatePersonData }] = createResource(
    async () => {
      const { data, error } = await supabase
        .from('person')
        .select()
        .eq('id', params.childId)
        .single();

      if (error === null) return data as PersonType;
      throw error;
    }
  );

  return { personData, mutatePersonData };
}

export default function EditChild() {
  const { personData, mutatePersonData } = useRouteData<typeof routeData>();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from('person')
      .update({
        ...personData(),
      })
      .eq('id', personData()!.id)
      .select();

    if (data) {
      navigate(`/session/admin`);
    }
    if (error) {
      alert('An error has occured');
    }
  };

  return (
    <main class="flex-col-center layout gap-y-[20px]">
      <BackComponent />
      <H1>Edit Child</H1>

      <article class="flex flex-col">
        <h3 class="ml-5 self-start text-xl font-bold">Name</h3>
        <input
          class=" h-[36px] w-full rounded-[10px] bg-[#EBEBEB] px-5 text-xl text-[#6B7280] placeholder-[#6B7280]"
          value={!personData.loading ? personData()!.name : ''}
          onChange={(e) => {
            mutatePersonData({ ...personData()!, name: e.target.value });
          }}
          placeholder="Ex. Bob"
        />
      </article>

      <article class="flex flex-col">
        <h3 class="ml-5 self-start text-xl font-bold">Parent</h3>
        <input
          class=" h-[36px] w-full rounded-[10px] bg-[#EBEBEB] px-5 text-xl text-[#6B7280] placeholder-[#6B7280]"
          value={!personData.loading ? personData()!.parent : ''}
          onChange={(e) => {
            mutatePersonData({ ...personData()!, parent: e.target.value });
          }}
          placeholder="Ex. Susan"
        />
      </article>
      <article class="flex flex-col">
        <h3 class="ml-5 self-start text-xl font-bold">Phone number</h3>
        <input
          class=" h-[36px] w-full rounded-[10px] bg-[#EBEBEB] px-5 text-xl text-[#6B7280] placeholder-[#6B7280]"
          value={!personData.loading ? personData()!.phone_number : ''}
          onChange={(e) => {
            mutatePersonData({
              ...personData()!,
              phone_number: e.target.value,
            });
          }}
          placeholder="Ex. 123-456-7890"
        />
      </article>

      <div class="absolute bottom-[5vh] left-0 flex h-10 w-screen items-center justify-center">
        <Fab onClick={handleSubmit} class="bg-primary text-xl text-white">
          Save
        </Fab>
      </div>
    </main>
  );
}
