import { createSignal } from "solid-js";
import { useNavigate, useParams } from "solid-start";
import { supabase } from "~/root";

export default function AddChild() {
  const [name, setName] = createSignal("");
  const [parent, setParent] = createSignal("");
  const [phoneNum, setPhoneNum] = createSignal("");

  const navigate = useNavigate();
  const params = useParams<{ code: string }>();

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from("person")
      .insert({ name: name(), parent: parent(), phone_number: phoneNum() })
      .select();

    if (data) {
      alert("HI");
      navigate(`/session/${params.code}/checkin`);
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
        <h1>Add Child</h1>
        <h3>Name</h3>
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
          value={name()}
          onInput={(e) => setName(e.target.value)}
          placeholder="Ex. Bob"
        />

        <h3>Parent</h3>
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
          value={parent()}
          onInput={(e) => setParent(e.target.value)}
          placeholder="Ex. Susan"
        />

        <h3>Phone number</h3>
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
          value={phoneNum()}
          onInput={(e) => setPhoneNum(e.target.value)}
          placeholder="Ex. 123-456-7890"
        />

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
          onClick={() => navigate(`/session/${params.code}/checkin`)}
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
          Submit
        </button>
      </main>
    </div>
  );
}
