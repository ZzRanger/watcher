import { JSX, ParentComponent, splitProps } from 'solid-js';

export type ButtonProps = {
  class?: string;
} & JSX.HTMLAttributes<HTMLButtonElement>;

const Fab: ParentComponent<ButtonProps> = (props) => {
  const [local, otherProps] = splitProps(props, ['class']);

  return (
    <button
      class={`rounded-[50px] px-[80px] py-3 ${local.class}`}
      {...otherProps}
    >
      {props.children}
    </button>
  );
};

export default Fab;
