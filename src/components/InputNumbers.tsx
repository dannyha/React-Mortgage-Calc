import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

/**
 * Input Numbers component
 */

type InputNumbers = {
  /** Class modifiers */
  classes?: string;
  /** Handler */
  handler: (event: any) => void;
  /** Value */
  value: any;
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

export default function InputNumbers(props: InputNumbers) {
  const maskOptions = {
    prefix: props.prefix ? props.prefix : '',
    suffix: props.suffix ? props.suffix : '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
    integerLimit: props.limit ? props.limit : 9,
    allowNegative: false,
    allowLeadingZeroes: false,
  }

  const inputMask = createNumberMask({
    ...maskOptions
  });

  return (
    <MaskedInput
      mask={inputMask}
      className={`input-currency form-control mb-4 fs-exclude ${props.error ? 'error' : ''}`} 
      placeholder={props.placeholder}
      guide={false}
      data-testid={props.id}
      id={props.id}
      onBlur={props.handler}
      value={props.value}
      aria-label={props.placeholder}
      aria-required={props.required}
      required={props.required}
    />
  );
}