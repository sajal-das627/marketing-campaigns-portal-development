import { InputProps } from '@mui/material';
type Props = {
    label: string;
    rows?: number;
    placeholder?: string;
    helperText?: string |  React.ReactNode;
    // helperText?: string | JSX.Element;
    InputProps?: InputProps;
    defaultValue: string;
    onChange: (v: string) => void;
};
export default function TextInput({ helperText, label, placeholder, rows, InputProps, defaultValue, onChange }: Props): any;
export {};
//# sourceMappingURL=TextInput.d.ts.map