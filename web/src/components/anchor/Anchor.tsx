import {
  Anchor as AnchorPrimitive,
  type AnchorProps as MantineAnchorProps,
} from '@mantine/core';
import { Link, type LinkProps } from 'react-router';

type AnchorProps<T extends React.ElementType> = PropsBase<T> & WithToIfLink<T>;
type DefaultComponent = LinkComponent;

type LinkComponent = typeof Link;

type PropsBase<T extends React.ElementType> = {
  component?: T;
} & Omit<MantineAnchorProps, 'component'> &
  (T extends LinkComponent
    ? LinkProps
    : Omit<React.ComponentPropsWithoutRef<T>, 'color'>);

type WithToIfLink<T extends React.ElementType> = T extends LinkComponent
  ? { to: string }
  : object;

export const Anchor = <T extends React.ElementType = DefaultComponent>(
  props: AnchorProps<T>,
) => {
  const { component, ...rest } = props;
  const Component = component ?? Link;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <AnchorPrimitive component={Component} {...(rest as any)} />;
};
