import { Show, createSignal } from 'solid-js';
import RemoveIcon from './icons/RemoveIcon';

export default function Classroom({
  name,
  handleSelect,
}: {
  name: string;
  handleSelect: (val: any) => void;
}) {
  const [selected, setSelected] = createSignal(false);
  return (
    <article
      onClick={() => {
        setSelected(!selected());
      }}
      class="flex h-fit w-full flex-row items-center justify-between border-b-[1px] border-solid border-b-[#737373] px-[13px] py-[10px]"
    >
      <div class="flex flex-row items-center">
        <label>
          <input
            class="rounded-ful border-1 mr-4 h-[25px] w-[25px] rounded-full border-solid border-[#737373] text-primary focus:ring-0 focus:ring-offset-0"
            type="checkbox"
          />
        </label>
        <div class="text-xl font-semibold">{name}</div>
      </div>
      <RemoveIcon />
    </article>
  );
}
