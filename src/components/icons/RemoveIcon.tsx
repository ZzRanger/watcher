import { JSX, ParentComponent, splitProps } from 'solid-js';

export type IconProps = {
  class?: string;
} & JSX.HTMLAttributes<HTMLButtonElement>;

const RemoveIcon: ParentComponent<IconProps> = (props) => {
  const [local, otherProps] = splitProps(props, ['class']);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class={`h-6 w-6 ${local.class}`}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

export default RemoveIcon;
