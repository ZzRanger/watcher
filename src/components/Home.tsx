import { supabase } from '~/root';
import styles from './Home.module.css';
import { createUniquSessionId } from '~/utils/utils';
import { A, useNavigate } from 'solid-start';
import { createSignal } from 'solid-js';
import QRCodeSVG from 'solid-qr-code';
import Button from './Button';

export default function Home() {
  const navigate = useNavigate();
  const [code, setCode] = createSignal('');

  const createSession = async () => {
    const { data, error } = await supabase
      .from('session')
      .insert({ id: createUniquSessionId() })
      .select();

    if (data) {
      navigate(`/session/${data[0].id}`);
    }
  };

  const handleJoinRoom = async () => {
    // Check if the room exists first xD
    const { data, error } = await supabase
      .from('session')
      .select()
      .eq('id', code())
      .single();

    if (data) {
      console.log(data);
      navigate(`/session/${code()}`);
    } else {
      alert('Session code not found. Please try again');
    }
  };

  return (
    <main class="flex-col-center h-screen w-screen justify-between py-[10vh]">
      <article class="flex-col-center">
        <img class="h-[75px] w-[100px]" src="owl_two.png" alt="Solid logo" />
        <h1 class=" text-[50px] font-bold text-primary">Watcher</h1>
        <p class="mt-[10px] text-[16px] font-bold text-primary">
          Always watching <span class="underline">for you</span>
        </p>
      </article>
      <article class="flex-col-center relative gap-y-[10px]">
        <img
          class=" absolute right-0 top-[-100px] w-[130px]"
          src="joinText.png"
          alt="Solid logo"
        />
        <input
          value={code()}
          onInput={(e) => setCode(e.target.value)}
          placeholder="Code"
          class="h-[59px] w-[295px] rounded-[200px] bg-secondary text-center"
        />
        <Button class="bg-primary text-white" onClick={handleJoinRoom}>
          Join Room
        </Button>
      </article>
      <article class="flex-col-center gap-y-[10px]">
        <div class="flex w-[360px] flex-row items-center  justify-between">
          <hr class="m-auto h-0 w-40 border-dashed border-black" />
          <div>Or</div>
          <hr class="m-auto flex h-0 w-40 border-dashed border-black" />
        </div>
        <div class="flex flex-row gap-x-[18px]">
          <button
            onClick={createSession}
            class="h-[27px] w-[154px] rounded-[20px] border-2 border-black"
          >
            Create Session
          </button>

          <A
            class="flex h-[27px] w-[154px] items-center justify-center rounded-[20px] border-2  border-solid border-black"
            href="/session/admin"
          >
            Admin Panel
          </A>
        </div>
      </article>
    </main>
  );
}
