import { Image, type ImageProps, useMantineColorScheme } from '@mantine/core';

type LogoProps = Omit<ImageProps, 'src'>;

export const Logo = ({ ...props }: LogoProps) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Image src={colorScheme === 'light' ? '/images/dstkLogo.png' : '/images/dstkLogoInverted.png'} {...props } />
  );
};
