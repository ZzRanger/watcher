import { supabase } from "~/root";
import { For, createResource, createSignal } from "solid-js";
import {
  A,
  RouteDataArgs,
  useNavigate,
  useParams,
  useRouteData,
} from "solid-start";
import Person from "~/components/Person";

export function routeData({ params }: RouteDataArgs) {
  // load some data

  const [peopleData, { refetch: refetchPeopleData }] = createResource(
    async () => {
      const { data, error } = await supabase
        .from("check_in")
        .select(
          `
          *,
      person(*)
      `
        )
        .eq("session", params.code)
        .is("check_out_time", null);

      if (error === null) return data;
      return error;
    }
  );

  const [sessionData] = createResource(async () => {
    const { data, error } = await supabase
      .from("session")
      .select()
      .eq("id", params.code);

    if (error === null) return data;
    return error;
  });

  return { peopleData, refetchPeopleData, sessionData };
}

export default function SessionPage() {
  // Write some sort of code to fetch user data
  const { peopleData, refetchPeopleData, sessionData } =
    useRouteData<typeof routeData>();
  // Store all the selected ids here
  // Use a signal for now, modify if it's jank
  const [selectedIds, setSelectedIds] = createSignal([] as any[]);
  const params = useParams<{ code: string }>();

  const handleSelect = (val: any) => {
    if (selectedIds().includes(val)) {
      setSelectedIds(selectedIds().filter((t) => t !== val));
    } else {
      setSelectedIds([...selectedIds(), val]);
    }
  };

  const handleSubmit = async () => {
    // Data to insert
    const currentTime = new Date().toISOString();
    console.log(currentTime);

    for (const id of selectedIds()) {
      const { data, error } = await supabase
        .from("check_in")
        .update({ check_out_time: currentTime })
        .eq("person", 1);

      if (error) {
        alert("ERROR");
      }
    }
    refetchPeopleData();
    setSelectedIds([]); // Clear select
  };

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
        <h1>
          {!sessionData.loading
            ? sessionData()!.name ?? "Session name"
            : "Session name"}
        </h1>
        <section
          style={{
            display: "flex",
            "flex-direction": "column",
            "justify-content": "space-between",
            height: "100%",
          }}
        >
          <article
            style={{
              display: "flex",
              "flex-direction": "column",
              "align-items": "center",
              "margin-top": "20px",
              "margin-bottom": "20px",
              border: "1px solid black",
            }}
          >
            <input
              style={{
                width: "250px",
                height: "36px",
                "padding-left": "8px",
                "box-sizing": "border-box",
                "border-radius": "0.5rem",
                border: "1px solid gray",
                "font-size": "16px",
              }}
              placeholder="Search"
            />
            <article
              style={{ width: "100%", height: "40vh", "overflow-y": "scroll" }}
            >
              <For each={peopleData() as any[] | null}>
                {(personData) => {
                  return (
                    <Person
                      personData={personData.person}
                      checkinData={personData.check_in_time}
                      handleSelect={handleSelect}
                    />
                  );
                }}
              </For>
              <For each={peopleData() as any[] | null}>
                {(personData) => {
                  return (
                    <Person
                      personData={personData.person}
                      checkinData={personData.check_in_time}
                      handleSelect={handleSelect}
                    />
                  );
                }}
              </For>
              <For each={peopleData() as any[] | null}>
                {(personData) => {
                  return (
                    <Person
                      personData={personData.person}
                      checkinData={personData.check_in_time}
                      handleSelect={handleSelect}
                    />
                  );
                }}
              </For>
              <For each={peopleData() as any[] | null}>
                {(personData) => {
                  return (
                    <Person
                      personData={personData.person}
                      checkinData={personData.check_in_time}
                      handleSelect={handleSelect}
                    />
                  );
                }}
              </For>
              <For each={peopleData() as any[] | null}>
                {(personData) => {
                  return (
                    <Person
                      personData={personData.person}
                      checkinData={personData.check_in_time}
                      handleSelect={handleSelect}
                    />
                  );
                }}
              </For>
            </article>
          </article>
          <article
            style={{
              height: "180px",
              display: "flex",
              "flex-direction": "column",
              "justify-content": "space-evenly",
            }}
          >
            <A
              href="checkin"
              style={{
                width: "250px",
                height: "36px",
                "text-align": "center",
                "text-decoration": "none",
                display: "flex",
                "flex-direction": "column",
                "justify-content": "center",
                background: "black",
                color: "white",
                "border-radius": "0.375rem",
                "font-size": "16px",
                cursor: "pointer",
              }}
            >
              Check-in
            </A>
            <button
              style={{
                width: "250px",
                height: "36px",
                "text-align": "center",
                background: "black",
                color: "white",
                "border-radius": "0.375rem",
                "font-size": "16px",
                cursor: "pointer",
              }}
              onClick={handleSubmit}
            >
              Check-out
            </button>
            <A
              style={{
                width: "250px",
                height: "36px",
                "text-align": "center",
                "text-decoration": "none",
                display: "flex",
                "flex-direction": "column",
                "justify-content": "center",
                background: "black",
                color: "white",
                "border-radius": "0.375rem",
                "font-size": "16px",
                cursor: "pointer",
              }}
              href="settings"
            >
              Edit Session
            </A>
          </article>
        </section>
      </main>
    </div>
  );
}
