import { Show, createSignal } from 'solid-js';
import RemoveIcon from './icons/RemoveIcon';
import { ClassroomType } from '~/utils/models';

export default function ClassroomComponent({
  classroom,
  handleSelect,
}: {
  classroom: ClassroomType;
  handleSelect: (classroomId: number) => void;
}) {
  const [selected, setSelected] = createSignal(false);
  return (
    <article
      onClick={() => {
        setSelected(!selected());
        handleSelect(classroom.id);
      }}
      class={`${
        selected()
          ? 'rounded-[10px] bg-[#EBEBEB] '
          : 'border-b-[1px] border-solid  border-b-[#737373]'
      } flex h-fit w-full flex-row items-center justify-between  px-[13px] py-[10px]`}
    >
      <div class="flex flex-row items-center">
        <label>
          <input
            checked={selected()}
            class="border-1 mr-4 h-[25px] w-[25px] rounded-full border-solid border-[#737373] text-primary  focus:ring-0 focus:ring-offset-0"
            type="checkbox"
          />
        </label>
        <div class="text-xl font-semibold">{classroom.name}</div>
      </div>
      <RemoveIcon />
    </article>
  );
}
