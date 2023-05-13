import { createSignal } from "solid-js";

export default function Person({
  personData,
  handleSelect,
}: {
  personData: any;
  handleSelect: (val: any) => void;
}) {
  const [selected, setSelected] = createSignal(false);
  return (
    <div
      onClick={() => {
        setSelected(!selected());
        handleSelect(personData.id);
      }}
      style={{ background: `${selected() ? "blue" : "white"}` }}
    >
      {personData.name}
    </div>
  );
}
