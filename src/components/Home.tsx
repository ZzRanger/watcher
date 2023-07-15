import { supabase } from '~/root';
import styles from './Home.module.css';
import { createUniquSessionId } from '~/utils/utils';
import { A, useNavigate } from 'solid-start';
import { createSignal } from 'solid-js';
import QRCodeSVG from 'solid-qr-code';

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
    <div>
      <main class={styles.main}>
        <article class={styles.article}>
          <img src="owl_two.png" width="100px" height="75px" alt="Solid logo" />
          <h1>Watcher</h1>
          <p>We watch so you don't have to</p>
        </article>
        <article style={{ gap: '10px' }} class={styles.article}>
          <input
            value={code()}
            onInput={(e) => setCode(e.target.value)}
            placeholder="Session code"
            class={styles.input}
          />
          <button
            style={{ background: 'black', color: 'white' }}
            class={styles.button}
            onClick={handleJoinRoom}
          >
            Join Room
          </button>
        </article>

        <article class={styles.article} style={{ gap: '10px' }}>
          <button
            style={{ background: 'black', color: 'white' }}
            onClick={createSession}
            class={styles.button}
          >
            Create Session
          </button>

          <A
            class={styles.button}
            style={{
              'text-decoration': 'none',
              display: 'flex',
              'flex-direction': 'column',
              'justify-content': 'center',
              background: 'black',
              color: 'white',
            }}
            href="/session/admin"
          >
            Admin Panel
          </A>
        </article>
      </main>
    </div>
  );
}
