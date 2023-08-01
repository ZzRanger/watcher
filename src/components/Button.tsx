import { JSX, ParentComponent, splitProps } from 'solid-js';

export type ButtonProps = {
  class?: string;
} & JSX.HTMLAttributes<HTMLButtonElement>;

const Button: ParentComponent<ButtonProps> = (props) => {
  const [local, otherProps] = splitProps(props, ['class']);

  return (
    <button
      class={`h-[59px] w-[295px] rounded-[200px] ${local.class}`}
      {...otherProps}
    >
      {props.children}
    </button>
  );
};

export default Button;
