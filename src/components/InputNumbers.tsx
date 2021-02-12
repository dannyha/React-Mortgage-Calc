import { ChangeEvent } from "react";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

/**
 * Input Numbers component
 */

type InputNumbers = {
  /** Class modifiers */
  classes?: string;
  /** Handler */
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Value */
  value: string | undefined;
  /** Placeholder */
  placeholder: string;
  /** Id */
  id: string;
  /** Error */
  error?: boolean;
  /** Required */
  required?: boolean;
  /** Prefix */
  prefix?: string;
  /** Suffix */
  suffix?: string;
  /** Limit */
  limit?: number;
};

export default function InputNumbers(props: InputNumbers): React.ReactElement {
  const {
    classes,
    handler,
    value,
    placeholder,
    id,
    error,
    required,
    prefix,
    suffix,
    limit,
  } = props;

  const maskOptions = {
    prefix,
    suffix,
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ",",
    allowDecimal: true,
    decimalSymbol: ".",
    decimalLimit: 2,
    integerLimit: limit,
    allowNegative: false,
    allowLeadingZeroes: false,
  };

  const inputMask = createNumberMask({
    ...maskOptions,
  });

  return (
    <MaskedInput
      mask={inputMask}
      className={`input-currency form-control mb-4 fs-exclude ${error}`}
      placeholder={placeholder}
      guide={false}
      data-testid={id}
      id={id}
      onBlur={handler}
      value={value}
      aria-label={placeholder}
      aria-required={required}
      required={required}
    />
  );
}

InputNumbers.defaultProps = {
  classes: "",
  error: false,
  required: false,
  prefix: "",
  suffix: "",
  limit: 9,
};
