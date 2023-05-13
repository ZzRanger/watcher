import { createSignal } from "solid-js";
import { useNavigate, useParams } from "solid-start";
import { supabase } from "~/root";
import { createUniquSessionId } from "~/utils/utils";

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
    <main>
      <h1>Add Child</h1>
      <h3>Name</h3>
      <input
        value={name()}
        onInput={(e) => setName(e.target.value)}
        placeholder="Ex. Bob"
      />

      <h3>Parent</h3>
      <input
        value={parent()}
        onInput={(e) => setParent(e.target.value)}
        placeholder="Ex. Susan"
      />

      <h3>Phone number</h3>
      <input
        value={phoneNum()}
        onInput={(e) => setPhoneNum(e.target.value)}
        placeholder="Ex. 123-456-7890"
      />

      <button onClick={() => navigate(`/session/${params.code}/checkin`)}>
        Back
      </button>
      <button onClick={handleSubmit}>Submit</button>
    </main>
  );
}
