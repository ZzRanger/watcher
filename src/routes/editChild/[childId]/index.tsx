import { createResource } from "solid-js";
import {
  RouteDataArgs,
  useNavigate,
  useParams,
  useRouteData,
} from "solid-start";
import { supabase } from "~/root";

export function routeData({ params }: RouteDataArgs) {
  // load some data

  const [personData, { mutate: mutatePersonData }] = createResource(
    async () => {
      const { data, error } = await supabase
        .from("person")
        .select()
        .eq("id", params.childId)
        .single();

      if (error === null) return data;
      return error;
    }
  );

  return { personData, mutatePersonData };
}

export default function EditChild() {
  const { personData, mutatePersonData } = useRouteData<typeof routeData>();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log(personData());
    const { data, error } = await supabase
      .from("person")
      .update({
        ...personData(),
      })
      .eq("id", personData()!.id)
      .select();

    if (data) {
      alert("HI");
      console.log(data);
      navigate(`/session/admin`);
    }
    if (error) {
      alert("An error has occured");
    }
  };

  return (
    <main>
      <h1>Add Child</h1>
      <h3>Name</h3>
      <input
        value={!personData.loading ? personData()!.name : ""}
        onChange={(e) => {
          mutatePersonData({ ...personData(), name: e.target.value });
        }}
        placeholder="Ex. Bob"
      />

      <h3>Parent</h3>
      <input
        value={!personData.loading ? personData()!.parent : ""}
        onChange={(e) => {
          mutatePersonData({ ...personData(), parent: e.target.value });
        }}
        placeholder="Ex. Susan"
      />

      <h3>Phone number</h3>
      <input
        value={!personData.loading ? personData()!.phone_number : ""}
        onChange={(e) => {
          mutatePersonData({ ...personData(), phone_number: e.target.value });
        }}
        placeholder="Ex. 123-456-7890"
      />

      <button onClick={() => navigate(`/session/admin`)}>Back</button>
      <button onClick={handleSubmit}>Submit</button>
    </main>
  );
}
