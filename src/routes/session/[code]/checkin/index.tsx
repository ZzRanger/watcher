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
      <main>
        <h1>Check-in</h1>
        <input placeholder="Search" />
        <For each={peopleData() as any[] | null}>
          {(personData) => (
            <Person personData={personData} handleSelect={handleSelect} />
          )}
        </For>
        <For each={selectedIds() as any[] | null}>
          {(id) => <div>{id}</div>}
        </For>
        <A href={`/session/${params.code}/checkin/addChild`}>Add New Child</A>
        <button onClick={handleSubmit}>Enter</button>
      </main>
    </div>
  );
}
