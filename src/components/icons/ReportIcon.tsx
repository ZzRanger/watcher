import { JSX, ParentComponent, splitProps } from 'solid-js';

export type IconProps = {
  class?: string;
} & JSX.HTMLAttributes<HTMLButtonElement>;

const ReportIcon: ParentComponent<IconProps> = (props) => {
  const [local, otherProps] = splitProps(props, ['class']);
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 11.78L20.24 4.45L21.97 5.45L16.74 14.5L10.23 10.75L5.46 19H22V21H2V3H4V17.54L9.5 8L16 11.78Z"
        fill="black"
      />
    </svg>
  );
};

export default ReportIcon;
