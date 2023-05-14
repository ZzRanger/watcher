import { createResource } from "solid-js";
import { RouteDataArgs, useNavigate, useRouteData } from "solid-start";
import { supabase } from "~/root";

export function routeData({ params }: RouteDataArgs) {
  // load some data

  const [sessionData, { mutate: mutateSessionData }] = createResource(
    async () => {
      const { data, error } = await supabase
        .from("session")
        .select()
        .eq("id", params.code)
        .single();

      if (error === null) return data;
      return error;
    }
  );

  return { sessionData, mutateSessionData };
}

export default function Settings() {
  const { sessionData, mutateSessionData } = useRouteData<typeof routeData>();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log(sessionData());
    const { data, error } = await supabase
      .from("session")
      .update({
        ...sessionData(),
      })
      .eq("id", sessionData()!.id)
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
    <div>
      <h1>Settings</h1>
      <h3>Session Name</h3>
      <input
        value={!sessionData.loading ? sessionData()!.name : ""}
        onChange={(e) =>
          mutateSessionData({ ...sessionData(), name: e.target.value })
        }
        placeholder="Ex. Monday Morning"
      />
      <button onClick={handleSubmit}>Update Session</button>
    </div>
  );
}
