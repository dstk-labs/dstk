import {
  Combobox,
  Input,
  InputBase,
  InputBaseProps,
  Text,
  useCombobox,
} from '@mantine/core';
import { useState } from 'react';

const AWS_REGIONS = [
  { description: 'US East (N. Virginia)', value: 'us-east-1' },
  { description: 'US East (Ohio)', value: 'us-east-2' },
  { description: 'US West (N. California)', value: 'us-west-1' },
  { description: 'US West (Oregon)', value: 'us-west-2' },
  { description: 'Africa (Cape Town)', value: 'af-south-1' },
  { description: 'Asia Pacific (Hong Kong)', value: 'ap-east-1' },
  { description: 'Asia Pacific (Jakarta)', value: 'ap-southeast-3' },
  { description: 'Asia Pacific (Mumbai)', value: 'ap-south-1' },
  { description: 'Asia Pacific (Osaka)', value: 'ap-northeast-3' },
  { description: 'Asia Pacific (Seoul)', value: 'ap-northeast-2' },
  { description: 'Asia Pacific (Singapore)', value: 'ap-southeast-1' },
  { description: 'Asia Pacific (Sydney)', value: 'ap-southeast-2' },
  { description: 'Asia Pacific (Tokyo)', value: 'ap-northeast-1' },
  { description: 'Canada (Central)', value: 'ca-central-1' },
  { description: 'Europe (Frankfurt)', value: 'eu-central-1' },
  { description: 'Europe (Ireland)', value: 'eu-west-1' },
  { description: 'Europe (London)', value: 'eu-west-2' },
  { description: 'Europe (Milan)', value: 'eu-south-1' },
  { description: 'Europe (Paris)', value: 'eu-west-3' },
  { description: 'Europe (Stockholm)', value: 'eu-north-1' },
  { description: 'Middle East (Bahrain)', value: 'me-south-1' },
  { description: 'South America (São Paulo)', value: 'sa-east-1' },
];

const SelectOption = ({ description, value }: (typeof AWS_REGIONS)[number]) => (
  <div>
    <Text fw={500} fz='sm'>
      {value}
    </Text>
    <Text fz='xs' opacity={0.6}>
      {description}
    </Text>
  </div>
);

type AwsRegionSelectProps = {
  disabled?: boolean;
} & Omit<
  InputBaseProps,
  | 'component'
  | 'label'
  | 'multiline'
  | 'onClick'
  | 'pointer'
  | 'rightSection'
  | 'rightSectionPointerEvents'
  | 'type'
>;

export const AwsRegionsSelect = ({
  disabled,
  ...props
}: AwsRegionSelectProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState<null | string>(null);
  const selectedOption = AWS_REGIONS.find((region) => region.value === value);

  const options = AWS_REGIONS.map((region) => (
    <Combobox.Option key={region.value} value={region.value}>
      <SelectOption {...region} />
    </Combobox.Option>
  ));

  return (
    <Combobox
      disabled={disabled}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
      store={combobox}
    >
      <Combobox.Target>
        <InputBase
          component='button'
          label='Region'
          multiline
          onClick={() => combobox.toggleDropdown()}
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents='none'
          type='button'
          {...props}
        >
          {selectedOption ? selectedOption.value : <Input.Placeholder />}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
