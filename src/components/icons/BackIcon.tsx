import { JSX, ParentComponent, splitProps } from 'solid-js';

export type IconProps = {
  class?: string;
} & JSX.HTMLAttributes<HTMLButtonElement>;

const BackIcon: ParentComponent<IconProps> = (props) => {
  const [local, otherProps] = splitProps(props, ['class']);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-6 w-6"
      color="black"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
      />
    </svg>
  );
};

export default BackIcon;
