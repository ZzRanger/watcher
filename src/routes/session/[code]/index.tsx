import { supabase } from "~/root";
import { For, createResource, createSignal } from "solid-js";
import { A, RouteDataArgs, useParams, useRouteData } from "solid-start";
import Person from "~/components/Person";

export function routeData({ params }: RouteDataArgs) {
  // load some data

  const [peopleData, { mutate: mutatePeopleData, refetch: refetchPeopleData }] =
    createResource(async () => {
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
    });

  const [sessionData] = createResource(async () => {
    const { data, error } = await supabase
      .from("session")
      .select()
      .eq("id", params.code)
      .single();

    if (error === null) return data;
    return error;
  });

  return { peopleData, mutatePeopleData, refetchPeopleData, sessionData };
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

    for (const id of selectedIds()) {
      const { data, error } = await supabase
        .from("check_in")
        .update({ check_out_time: currentTime })
        .eq("person", id);
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
        <div
          style={{
            width: "24px",
            height: "24px",
            position: "absolute",
            top: "20px",
            left: "20px",
          }}
        >
          <A href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </A>
        </div>

        <div
          style={{
            width: "24px",
            height: "24px",
            position: "absolute",
            top: "20px",
            right: "20px",
          }}
        >
          <A href="settings">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              color="black"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </A>
        </div>
        <h1>
          {!sessionData.loading
            ? sessionData()!.name ?? "Session name"
            : "Session name"}
        </h1>
        <div
          style={{
            "padding-top": "4px",
            "text-align": "center",
            "font-size": "16px",
          }}
        >
          Join Code: {params.code}
        </div>

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
              "margin-top": "12px",
              "margin-bottom": "12px",
            }}
          >
            <div style={{ "font-size": "24px" }}>Checked-in children</div>
            {/* <input
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
              onChange={(e) => {}}
            /> */}
            <article
              style={{
                width: "100%",
                height: "45vh",
                "overflow-y": "scroll",
                "overflow-x": "hidden",
                border: "1px solid gray",
                "border-radius": "0.375rem",
                margin: "2px",
              }}
            >
              <For each={peopleData() as any[] | null}>
                {(personData, index) => {
                  return (
                    <div
                      style={{
                        background: `${index() % 2 == 0 ? "lightgray" : ""}`,
                      }}
                    >
                      <Person
                        personData={personData.person}
                        checkinData={personData.check_in_time}
                        handleSelect={handleSelect}
                      />
                    </div>
                  );
                }}
              </For>
            </article>
          </article>
          <div>
            {!peopleData.loading ? peopleData()!.length : "0"} children
            currently checked in
          </div>
          <article
            style={{
              height: "100px",
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
          </article>
        </section>
      </main>
    </div>
  );
}
