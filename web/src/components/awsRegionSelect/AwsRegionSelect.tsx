import type { SelectProps } from "@mantine/core";
import { Select } from "@mantine/core";

const AWS_REGIONS = [
  { description: "US East (N. Virginia)", value: "us-east-1" },
  { description: "US East (Ohio)", value: "us-east-2" },
  { description: "US West (N. California)", value: "us-west-1" },
  { description: "US West (Oregon)", value: "us-west-2" },
  { description: "Africa (Cape Town)", value: "af-south-1" },
  { description: "Asia Pacific (Hong Kong)", value: "ap-east-1" },
  { description: "Asia Pacific (Jakarta)", value: "ap-southeast-3" },
  { description: "Asia Pacific (Mumbai)", value: "ap-south-1" },
  { description: "Asia Pacific (Osaka)", value: "ap-northeast-3" },
  { description: "Asia Pacific (Seoul)", value: "ap-northeast-2" },
  { description: "Asia Pacific (Singapore)", value: "ap-southeast-1" },
  { description: "Asia Pacific (Sydney)", value: "ap-southeast-2" },
  { description: "Asia Pacific (Tokyo)", value: "ap-northeast-1" },
  { description: "Canada (Central)", value: "ca-central-1" },
  { description: "Europe (Frankfurt)", value: "eu-central-1" },
  { description: "Europe (Ireland)", value: "eu-west-1" },
  { description: "Europe (London)", value: "eu-west-2" },
  { description: "Europe (Milan)", value: "eu-south-1" },
  { description: "Europe (Paris)", value: "eu-west-3" },
  { description: "Europe (Stockholm)", value: "eu-north-1" },
  { description: "Middle East (Bahrain)", value: "me-south-1" },
  { description: "South America (São Paulo)", value: "sa-east-1" },
];

const REGION_OPTIONS = AWS_REGIONS.map(region => ({
  label: region.value,
  value: region.value,
}));

const DESCRIPTIONS = new Map(AWS_REGIONS.map(r => [r.value, r.description]));

type AwsRegionSelectProps = Omit<SelectProps, "data" | "label" | "renderOption">;

export function AwsRegionsSelect(props: AwsRegionSelectProps) {
  return (
    <Select
      data={REGION_OPTIONS}
      label="Region"
      placeholder="Select a region"
      renderOption={({ option }) => (
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-size-2xs)" }}>
            {option.value}
          </div>
          <div style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-3xs)" }}>
            {DESCRIPTIONS.get(option.value)}
          </div>
        </div>
      )}
      searchable
      {...props}
    />
  );
}
