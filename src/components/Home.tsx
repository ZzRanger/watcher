import { supabase } from "~/root";
import styles from "./Home.module.css";
import { createUniquSessionId } from "~/utils/utils";
import { useNavigate } from "solid-start";

export default function Home() {
  // Write some sort of code to create new session

  const navigate = useNavigate();

  const createSession = async () => {
    const { data, error } = await supabase
      .from("session")
      .insert({ id: createUniquSessionId() })
      .select();

    if (data) {
      navigate(`/session/${data[0].id}`);
    }
  };

  return (
    <div>
      <main class={styles.main}>
        <h1>Watcher</h1>
        <article class={styles.article}>
          <h1>Enter Code</h1>
          <input placeholder="Code" class={styles.input} />
          <button>Join Room</button>
          <h1>Or</h1>
          <button onClick={createSession} class={styles.button}>
            Create Session
          </button>
        </article>
      </main>
    </div>
  );
}
