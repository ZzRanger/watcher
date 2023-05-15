import { Show, createSignal } from "solid-js";

export default function Person({
  personData,
  checkinData,
  handleSelect,
}: {
  personData: any;
  checkinData: any;
  handleSelect: (val: any) => void;
}) {
  const [selected, setSelected] = createSignal(false);
  return (
    <article
      onClick={() => {
        setSelected(!selected());
        handleSelect(personData.id);
      }}
      style={{
        background: `${selected() ? "lightblue" : ""}`,
        display: "flex",
        "flex-direction": "column",
        width: "100%",
        "padding-left": "8px",
        cursor: "pointer",
        "box-sizing": "border-box",
        "border-bottom": "1px solid gray",
      }}
    >
      <div style={{ "font-size": "20px" }}>{personData.name}</div>
      <Show when={checkinData !== null} fallback={<div></div>}>
        <div>{new Date(checkinData).toLocaleString("en-US")}</div>
      </Show>
    </article>
  );
}
