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
      person(*)
      `
        )
        .eq("session", params.code)
        .is("check_out_time", null);

      if (error === null) return data;
      return error;
    }
  );
  return { peopleData, refetchPeopleData };
}

export default function SessionPage() {
  // Write some sort of code to fetch user data
  const { peopleData, refetchPeopleData } = useRouteData<typeof routeData>();
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
      <main>
        <h1>Session Name</h1>
        <input placeholder="Search" />
        <For each={peopleData() as any[] | null}>
          {(personData) => {
            return (
              <Person
                personData={personData.person}
                handleSelect={handleSelect}
              />
            );
          }}
        </For>
        <For each={selectedIds() as any[] | null}>
          {(id) => <div>{id}</div>}
        </For>
        <A href="checkin">Check-in</A>
        <button onClick={handleSubmit}>Check-out</button>
        <A href="settings">Edit Session</A>
      </main>
    </div>
  );
}
