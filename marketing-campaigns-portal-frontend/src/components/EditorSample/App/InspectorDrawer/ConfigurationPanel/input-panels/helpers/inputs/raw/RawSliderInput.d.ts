type SliderInputProps = {
    iconLabel: React.ReactNode;
    // iconLabel: JSX.Element;
    step?: number;
    marks?: boolean;
    units: string;
    min?: number;
    max?: number;
    value: number;
    setValue: (v: number) => void;
};
export default function RawSliderInput({ iconLabel, value, setValue, units, ...props }: SliderInputProps): any;
export {};
//# sourceMappingURL=RawSliderInput.d.ts.map