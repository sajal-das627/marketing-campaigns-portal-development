type TPaddingValue = {
    top: number;
    bottom: number;
    right: number;
    left: number;
};
type Props = {
    label: string;
    defaultValue: TPaddingValue | null;
    onChange: (value: TPaddingValue) => void;
};
export default function PaddingInput({ label, defaultValue, onChange }: Props): any;
export {};
//# sourceMappingURL=PaddingInput.d.ts.map