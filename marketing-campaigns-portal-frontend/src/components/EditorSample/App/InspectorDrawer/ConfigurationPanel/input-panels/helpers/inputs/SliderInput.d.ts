type SliderInputProps = {
    label: string;
    iconLabel:  React.ReactNode;
    // iconLabel: JSX.Element;
    step?: number;
    marks?: boolean;
    units: string;
    min?: number;
    max?: number;
    defaultValue: number;
    onChange: (v: number) => void;
};
export default function SliderInput({ label, defaultValue, onChange, ...props }: SliderInputProps): any;
export {};
//# sourceMappingURL=SliderInput.d.ts.map