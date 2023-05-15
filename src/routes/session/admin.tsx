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
    <div>
      <main
        style={{
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          "padding-top": "40px",
          "padding-bottom": "40px",
          height: "100vh",
          "box-sizing": "border-box",
        }}
      >
        <h1>Admin Page</h1>

        <h3> Stats</h3>
        <div>
          Total # of sessions:{" "}
          {!sessionData.loading ? sessionData()!.length : "0"}
        </div>
        <div>
          Total # of children:{" "}
          {!personData.loading ? personData()!.length : "0"}
        </div>
        <h3>Sessions</h3>
        <article
          style={{
            height: "40vh",
            "overflow-x": "hidden",
            "overflow-y": "scroll",
            "margin-bottom": "40px",
          }}
        >
          <For each={sessionData() as any[] | null}>
            {(session) => {
              return (
                <A
                  style={{
                    display: "flex",
                    "flex-direction": "column",
                    "text-decoration": "none",
                    color: "black",
                    border: "1px solid gray",
                    padding: "16px",
                    "border-radius": "0.375rem",
                    height: "40px",
                    width: "200px",
                  }}
                  href={`/session/${session.id}`}
                >
                  <div style={{ "font-size": "18px" }}>{session.name}</div>
                  <div style={{ "font-size": "14px" }}>{session.id}</div>
                </A>
              );
            }}
          </For>
        </article>
        <h3>Children</h3>
        <article
          style={{
            height: "40vh",
            "overflow-x": "hidden",
            "overflow-y": "scroll",
          }}
        >
          <For each={personData() as any[] | null}>
            {(person) => {
              return (
                <A
                  href={`/editChild/${person.id}`}
                  style={{
                    display: "flex",
                    "flex-direction": "column",
                    "text-decoration": "none",
                    color: "black",
                    border: "1px solid gray",
                    padding: "16px",
                    "border-radius": "0.375rem",
                    height: "40px",
                    width: "200px",
                  }}
                >
                  <div style={{ "font-size": "18px" }}>{person.name}</div>
                  <div style={{ "font-size": "14px" }}>{person.id}</div>
                </A>
              );
            }}
          </For>
        </article>
      </main>
    </div>
  );
}
