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
import { createEffect } from "solid-js";

export function routeData({ params }: RouteDataArgs) {
  // load some data
  const [peopleData] = createResource(async () => {
    const { data, error } = await supabase.from("person").select();

    if (error === null) return data;
    return error;
  });
  return { peopleData };
}

export default function SessionPage() {
  // Write some sort of code to fetch user data

  // Should also display if the user has already been checked in?
  // Or just show people who haven't been checked in I think

  const { peopleData } = useRouteData<typeof routeData>();
  const params = useParams<{ code: string }>();

  // Store all the selected ids here
  // Use a signal for now, modify if it's jank
  const [selectedIds, setSelectedIds] = createSignal([] as any[]);

  const navigate = useNavigate();

  const handleSelect = (val: any) => {
    console.log(selectedIds());
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
    const newCheckins = selectedIds().map((id) => {
      return { person: id, session: params.code, check_in_time: currentTime };
    });
    const { data, error } = await supabase
      .from("check_in")
      .insert(newCheckins)
      .select();

    if (data) {
      navigate(`/session/${params.code}`);
    }
    if (error) {
      alert("An error has occured");
    }
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
        <h1>Check-in</h1>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            "justify-content": "space-between",
            height: "100%",
          }}
        >
          <section
            style={{
              display: "flex",
              "flex-direction": "column",
              "align-items": "center",
              "margin-top": "20px",
              "margin-bottom": "20px",
            }}
          >
            {/* <input
              placeholder="Search"
              style={{
                width: "250px",
                height: "36px",
                "padding-left": "8px",
                "box-sizing": "border-box",
                "border-radius": "0.5rem",
                border: "1px solid gray",
                "font-size": "16px",
              }}
            /> */}
            <article
              style={{
                width: "100%",
                height: "45vh",
                "overflow-y": "scroll",
                "overflow-x": "hidden",
                display: "flex",
                "flex-direction": "column",
                margin: "2px",
              }}
            >
              <For each={peopleData() as any[] | null}>
                {(personData) => (
                  <Person
                    personData={personData}
                    checkinData={null}
                    handleSelect={handleSelect}
                  />
                )}
              </For>
            </article>
          </section>
          <section
            style={{
              display: "flex",
              "flex-direction": "column",
              "align-items": "center",
              height: "180px",
              "justify-content": "space-evenly",
            }}
          >
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
              onClick={() => navigate(`/session/${params.code}`)}
            >
              Back
            </button>
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
              Enter
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
              href={`/session/${params.code}/checkin/addChild`}
            >
              Add New Child
            </A>
          </section>
        </div>
      </main>
    </div>
  );
}
