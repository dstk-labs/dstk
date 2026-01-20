import type { ImageProps } from "@mantine/core";
import { Image } from "@mantine/core";

type LogoProps = Omit<ImageProps, "src">;

export function Logo({ ...props }: LogoProps) {
  return <Image src="/images/dstkLogoInverted.png" {...props} />;
}
