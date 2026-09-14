import { Button, Divider, Stack } from "@mantine/core";

import { GithubIcon } from "@/components/icons/github/GitHubIcon";
import { GoogleIcon } from "@/components/icons/google/GoogleIcon";

type OAuthButtonsProps = {
  disabled: boolean;
  onGithub: () => void;
  onGoogle: () => void;
  verb: string;
};

export function OAuthButtons({ disabled, onGithub, onGoogle, verb }: OAuthButtonsProps) {
  return (
    <>
      <Stack gap="sm" mb="lg">
        <Button
          disabled={disabled}
          fullWidth
          leftSection={<GoogleIcon height={18} width={18} />}
          onClick={onGoogle}
          radius="md"
          variant="outline"
        >
          {verb}
          {" "}
          with Google
        </Button>
        <Button
          disabled={disabled}
          fullWidth
          leftSection={<GithubIcon height={18} width={18} />}
          onClick={onGithub}
          radius="md"
          variant="outline"
        >
          {verb}
          {" "}
          with GitHub
        </Button>
      </Stack>
      <Divider label="or" labelPosition="center" mb="lg" />
    </>
  );
}
