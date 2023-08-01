import { JSX, ParentComponent, splitProps } from 'solid-js';

export type H1Props = {
  class?: string;
} & JSX.HTMLAttributes<HTMLHeadingElement>;

const H1: ParentComponent<H1Props> = (props: H1Props) => {
  const [local, otherProps] = splitProps(props, ['class']);
  return (
    <h1 class={`text-[30px] font-bold text-primary ${local.class}`}>
      {props.children}
    </h1>
  );
};

export default H1;
