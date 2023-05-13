import { supabase } from "~/root";
import { For, createResource } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";

export function routeData({ params }: RouteDataArgs) {
  // load some data
  const [sessionData] = createResource(async () => {
    const { data, error } = await supabase.from("session").select();
    // console.log(data);

    if (error === null) return data;
    return error;
  });
  return { sessionData };
}

export default function SessionPage() {
  // Write some sort of code to fetch user data
  const { sessionData } = useRouteData<typeof routeData>();

  return (
    <div>
      <main>
        <h1>Check-in</h1>
        <input placeholder="Search" />
        <For each={sessionData()}>{(session) => <li>{session.id}</li>}</For>
        <button>Add New Child</button>
        <div>Enter</div>
      </main>
    </div>
  );
}
