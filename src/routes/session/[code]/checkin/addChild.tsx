import { createSignal } from 'solid-js';
import { useNavigate, useParams } from 'solid-start';
import Fab from '~/components/Fab';
import H1 from '~/components/H1';
import Navbar from '~/components/Navbar';
import { supabase } from '~/root';

export default function AddChild() {
  const [name, setName] = createSignal('');
  const [parent, setParent] = createSignal('');
  const [phoneNum, setPhoneNum] = createSignal('');

  const navigate = useNavigate();
  const params = useParams<{ code: string }>();

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from('person')
      .insert({ name: name(), parent: parent(), phone_number: phoneNum() })
      .select();

    if (data) {
      alert('HI');
      navigate(`/session/${params.code}/checkin`);
    }
    if (error) {
      alert('An error has occured');
    }
  };

  return (
    <div>
      <main class="flex-col-center layout gap-y-[20px]">
        <Navbar />
        <H1>Add Child</H1>
        <section class="flex-col-center w-[300px] gap-y-4">
          <h3 class="self-start text-xl font-bold">Name</h3>
          <input
            class=" h-[36px] w-full rounded-[10px] bg-[#EBEBEB] px-5 text-xl text-[#6B7280] placeholder-[#6B7280]"
            value={name()}
            onInput={(e) => setName(e.target.value)}
            placeholder="Ex. Bob"
          />

          <h3 class="self-start text-xl font-bold">Parent</h3>
          <input
            class=" h-[36px] w-full rounded-[10px] bg-[#EBEBEB] px-5 text-xl text-[#6B7280] placeholder-[#6B7280]"
            value={parent()}
            onInput={(e) => setParent(e.target.value)}
            placeholder="Ex. Susan"
          />

          <h3 class="self-start text-xl font-bold">Phone number</h3>
          <input
            class=" h-[36px] w-full rounded-[10px] bg-[#EBEBEB] px-5 text-xl text-[#6B7280] placeholder-[#6B7280]"
            value={phoneNum()}
            onInput={(e) => setPhoneNum(e.target.value)}
            placeholder="Ex. 123-456-7890"
          />
        </section>

        <div class="absolute bottom-[5vh] left-0 flex h-10 w-screen items-center justify-center">
          <Fab onClick={handleSubmit} class="bg-primary text-xl text-white">
            Done
          </Fab>
        </div>
      </main>
    </div>
  );
}
