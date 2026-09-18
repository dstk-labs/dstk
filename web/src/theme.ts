import type { CSSVariablesResolver, MantineColorsTuple } from "@mantine/core";
import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Checkbox,
  Combobox,
  createTheme,
  Divider,
  Input,
  InputWrapper,
  Loader,
  Menu,
  Modal,
  Notification,
  Paper,
  Progress,
  Select,
  Switch,
  Table,
  Tabs,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";

import styles from "./theme.module.css";

const sky: MantineColorsTuple = [
  "#eaf6ff",
  "#c4e6fc",
  "#87ceeb",
  "#6bbfdf",
  "#4ba8d1",
  "#3b94bf",
  "#2c7da8",
  "#256a8f",
  "#1e5776",
  "#17445d",
];

const dark: MantineColorsTuple = [
  "#e6edf3",
  "#9eaab8",
  "#6b7685",
  "#6b7685",
  "#30363d",
  "#21262d",
  "#161b22",
  "#0e1117",
  "#0e1117",
  "#0b0e13",
];

const BUTTON_SIZES: Record<string, { fz: string; height: string; px: string }> = {
  compact: { fz: "var(--font-size-3xs)", height: "1.75rem", px: "var(--space-3)" },
  lg: { fz: "var(--font-size-base)", height: "2.75rem", px: "var(--space-8)" },
  md: { fz: "var(--font-size-xs)", height: "2.375rem", px: "var(--space-5)" },
  sm: { fz: "var(--font-size-2xs)", height: "2rem", px: "0.875rem" },
};

export const theme = createTheme({
  autoContrast: true,
  colors: { dark, sky },
  components: {
    ActionIcon: ActionIcon.extend({
      classNames: { root: styles.actionIconRoot },
      defaultProps: { radius: "sm", variant: "subtle" },
    }),
    Anchor: Anchor.extend({
      classNames: { root: styles.anchor },
      defaultProps: { underline: "never" },
    }),
    Badge: Badge.extend({
      styles: {
        root: {
          fontSize: "var(--font-size-4xs)",
          fontWeight: 400,
          letterSpacing: "0.4px",
          textTransform: "none",
          height: "auto",
          padding: "3px 10px",
        },
      },
    }),
    Button: Button.extend({
      classNames: { root: styles.buttonRoot },
      defaultProps: { radius: "xl", size: "md" },
      vars: (_theme, props) => {
        const size = BUTTON_SIZES[props.size ?? "md"] ?? BUTTON_SIZES.md;
        return {
          root: {
            "--button-fz": size.fz,
            "--button-height": size.height,
            "--button-padding-x": size.px,
          },
        };
      },
    }),
    Checkbox: Checkbox.extend({
      classNames: {
        icon: styles.checkboxIcon,
        input: styles.checkboxInput,
        label: styles.checkboxLabel,
      },
      defaultProps: { size: "xs" },
    }),
    Combobox: Combobox.extend({
      classNames: {
        dropdown: styles.comboboxDropdown,
        empty: styles.comboboxEmpty,
        option: styles.comboboxOption,
      },
    }),
    Divider: Divider.extend({
      classNames: { label: styles.dividerLabel },
      styles: { root: { borderColor: "var(--color-border-default)" } },
    }),
    Dropzone: Dropzone.extend({
      classNames: { root: styles.dropzoneRoot },
    }),
    Input: Input.extend({
      classNames: { input: styles.input, section: styles.inputSection },
      defaultProps: { radius: "md", size: "sm" },
    }),
    InputWrapper: InputWrapper.extend({
      classNames: {
        description: styles.inputDescription,
        error: styles.inputError,
        label: styles.inputLabel,
        required: styles.inputRequired,
      },
    }),
    Loader: Loader.extend({
      defaultProps: { color: "sky.4", type: "oval" },
    }),
    Menu: Menu.extend({
      classNames: {
        divider: styles.menuDivider,
        dropdown: styles.menuDropdown,
        item: styles.menuItem,
        itemSection: styles.menuItemSection,
        label: styles.menuLabel,
      },
      defaultProps: { shadow: "lg" },
    }),
    Modal: Modal.extend({
      classNames: {
        body: styles.modalBody,
        close: styles.modalClose,
        content: styles.modalContent,
        header: styles.modalHeader,
        title: styles.modalTitle,
      },
      defaultProps: {
        centered: true,
        overlayProps: { backgroundOpacity: 0.6, blur: 2 },
        padding: 0,
        radius: "lg",
      },
    }),
    Notification: Notification.extend({
      classNames: {
        closeButton: styles.notificationClose,
        description: styles.notificationDescription,
        root: styles.notificationRoot,
        title: styles.notificationTitle,
      },
    }),
    Paper: Paper.extend({
      defaultProps: { radius: "lg" },
      styles: {
        root: {
          backgroundColor: "var(--color-bg-secondary)",
          borderColor: "var(--color-border-default)",
        },
      },
    }),
    Progress: Progress.extend({
      classNames: { root: styles.progressRoot },
      defaultProps: { radius: "xl", size: "xs" },
    }),
    Select: Select.extend({
      defaultProps: { checkIconPosition: "right", radius: "md", size: "sm" },
    }),
    Switch: Switch.extend({
      classNames: {
        input: styles.switchInput,
        label: styles.switchLabel,
        thumb: styles.switchThumb,
        track: styles.switchTrack,
      },
      defaultProps: { size: "sm" },
    }),
    Table: Table.extend({
      classNames: {
        table: styles.tableTable,
        tbody: styles.tableTbody,
        td: styles.tableTd,
        th: styles.tableTh,
        tr: styles.tableTr,
      },
      defaultProps: { highlightOnHover: true },
      vars: () => ({
        table: {
          "--table-border-color": "var(--color-border-muted)",
          "--table-highlight-on-hover-color": "rgba(125, 200, 240, 0.02)",
          "--table-hover-color": "rgba(125, 200, 240, 0.02)",
        },
      }),
    }),
    Tabs: Tabs.extend({
      classNames: { list: styles.tabsList, tab: styles.tabsTab },
    }),
    Textarea: Textarea.extend({
      classNames: { input: styles.textareaInput },
    }),
    Tooltip: Tooltip.extend({
      classNames: { tooltip: styles.tooltip },
      defaultProps: { radius: "sm" },
    }),
  },
  cursorType: "pointer",
  defaultRadius: "md",
  fontFamily: "var(--font-family)",
  fontFamilyMonospace: "var(--font-mono)",
  fontSizes: {
    lg: "var(--font-size-md)",
    md: "var(--font-size-sm)",
    sm: "var(--font-size-xs)",
    xl: "var(--font-size-lg)",
    xs: "var(--font-size-2xs)",
  },
  headings: {
    fontFamily: "var(--font-family)",
    fontWeight: "300",
    sizes: {
      h1: { fontSize: "var(--font-size-2xl)", fontWeight: "300", lineHeight: "1.3" },
      h2: { fontSize: "var(--font-size-xl)", fontWeight: "300", lineHeight: "1.35" },
      h3: { fontSize: "var(--font-size-lg)", fontWeight: "400", lineHeight: "1.4" },
      h4: { fontSize: "var(--font-size-base)", fontWeight: "400", lineHeight: "1.4" },
      h5: { fontSize: "var(--font-size-sm)", fontWeight: "400", lineHeight: "1.4" },
      h6: { fontSize: "var(--font-size-xs)", fontWeight: "400", lineHeight: "1.4" },
    },
  },
  primaryColor: "sky",
  primaryShade: 4,
  radius: {
    lg: "var(--radius-lg)",
    md: "var(--radius-md)",
    sm: "var(--radius-sm)",
    xl: "var(--radius-full)",
    xs: "4px",
  },
});

export const cssVariablesResolver: CSSVariablesResolver = () => ({
  dark: {
    "--mantine-color-anchor": "var(--sky-300)",
    "--mantine-color-body": "var(--color-bg-primary)",
    "--mantine-color-default": "var(--color-bg-elevated)",
    "--mantine-color-default-border": "var(--color-border-default)",
    "--mantine-color-default-color": "var(--color-text-primary)",
    "--mantine-color-default-hover": "var(--color-bg-elevated)",
    "--mantine-color-dimmed": "var(--color-text-muted)",
    "--mantine-color-error": "var(--color-error)",
    "--mantine-color-placeholder": "var(--color-text-muted)",
    "--mantine-color-text": "var(--color-text-primary)",
  },
  light: {},
  variables: {},
});
