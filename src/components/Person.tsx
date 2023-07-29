import { Show, createSignal } from 'solid-js';

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
      class="flex h-fit w-full flex-row items-center border-b-[1px] border-solid border-b-[#737373] px-[13px] py-[10px]"
    >
      <label>
        <input
          class="rounded-ful border-1 mr-4 h-[25px] w-[25px] rounded-full border-solid border-[#737373] text-primary focus:ring-0 focus:ring-offset-0"
          type="checkbox"
        />
      </label>
      <div class="flex flex-grow flex-col items-start justify-between gap-y-2">
        <div class="text-base text-[#737373]">10:00AM</div>
        <div class="text-xl font-medium">{personData.name}</div>
      </div>
      <div class="self-start text-base text-[#737373]">Classroom 1</div>
      {/* <Show when={checkinData !== null} fallback={<div></div>}>
        <div>{new Date(checkinData).toLocaleString('en-US')}</div>
      </Show> */}
    </article>
  );
}
