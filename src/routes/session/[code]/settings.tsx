import { createResource } from "solid-js";
import {
  A,
  RouteDataArgs,
  useNavigate,
  useParams,
  useRouteData,
} from "solid-start";
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

  const params = useParams<{ code: string }>();

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from("session")
      .update({
        ...sessionData(),
      })
      .eq("id", sessionData()!.id)
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
        <section
          style={{
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
          }}
        >
          <article
            style={{
              display: "flex",
              "flex-direction": "column",
              "align-items": "center",
            }}
          >
            <h1>Settings</h1>
            <h3>Session Name</h3>
          </article>

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
            value={!sessionData.loading ? sessionData()!.name : ""}
            onChange={(e) =>
              mutateSessionData({ ...sessionData(), name: e.target.value })
            }
            placeholder="Ex. Monday Morning"
          />
          <A
            href={`/session/${params.code}`}
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
            Back
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
            Update Session
          </button>
        </section>
      </main>
    </div>
  );
}
