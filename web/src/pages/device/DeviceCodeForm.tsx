import { Button, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";

const deviceCodeSchema = z.object({
  userCode: z.string().trim().min(1, "Required"),
});

type DeviceCodeFormProps = {
  onSubmit: (userCode: string) => void;
};

export function DeviceCodeForm({ onSubmit }: DeviceCodeFormProps) {
  const form = useForm({
    initialValues: {
      userCode: "",
    },
    mode: "uncontrolled",
    validate: zod4Resolver(deviceCodeSchema),
  });

  return (
    <form onSubmit={form.onSubmit(values => onSubmit(values.userCode.trim()))}>
      <Stack gap="lg">
        <Text c="var(--color-text-secondary)" fw={300} size="sm">
          Enter the code shown in your terminal.
        </Text>
        <TextInput
          autoComplete="off"
          autoFocus
          key={form.key("userCode")}
          label="Device code"
          placeholder="ABCD-1234"
          {...form.getInputProps("userCode")}
        />
        <Button fullWidth type="submit">
          Continue
        </Button>
      </Stack>
    </form>
  );
}
