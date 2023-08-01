import { Show, createSignal } from 'solid-js';
import { PersonType } from '~/utils/models';
import { formatPhoneNumber } from '~/utils/utils';

export default function Person({ personData }: { personData: PersonType }) {
  return (
    <article class="flex h-fit w-full flex-row items-center border-b-[1px] border-solid border-b-[#737373] px-[13px] py-[10px]">
      <div class="flex flex-grow flex-col items-start justify-between gap-y-2">
        <div class="text-base text-[#737373]">{personData.parent}</div>
        <div class="text-xl font-medium">{personData.name}</div>
      </div>
      <div class="self-start text-base text-[#737373]">
        {formatPhoneNumber(personData.phone_number)}
      </div>
    </article>
  );
}
