import { Image, type ImageProps } from '@mantine/core';

type LogoProps = Omit<ImageProps, 'src'>;

export const Logo = ({ ...props }: LogoProps) => {
  return <Image src='/images/dstkLogoInverted.png' {...props} />;
};
