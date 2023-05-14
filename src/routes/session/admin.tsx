import { For, createResource } from "solid-js";
import { A, RouteDataArgs, useRouteData } from "solid-start";
import { supabase } from "~/root";

export function routeData({ params }: RouteDataArgs) {
  // load some data

  const [sessionData] = createResource(async () => {
    const { data, error } = await supabase.from("session").select();

    if (error === null) return data;
    return error;
  });

  const [personData] = createResource(async () => {
    const { data, error } = await supabase.from("person").select();

    if (error === null) return data;
    return error;
  });

  return { sessionData, personData };
}

export default function AdminDashboard() {
  // Should show all the sessions created
  // As well as all the children

  const { sessionData, personData } = useRouteData<typeof routeData>();

  return (
    <main>
      <For each={sessionData() as any[] | null}>
        {(session) => {
          return (
            <article>
              <A href={`/session/${session.id}`}>
                <div>{session.id}</div>
                <div>{session.name}</div>
              </A>
            </article>
          );
        }}
      </For>
      <For each={personData() as any[] | null}>
        {(person) => {
          return (
            <article>
              <A href={`/editChild/${person.id}`}>
                <div>{person.id}</div>
                <div>{person.name}</div>
              </A>
            </article>
          );
        }}
      </For>
    </main>
  );
}
