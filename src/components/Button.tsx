/**
 * Button component
 */

type Button = {
  /** Class modifiers */
  classes?: string;
  /** Handler */
  handler?: () => void;
  /** Text */
  text: string;
  /** Disabled */
  disabled?: boolean;
  /** Id */
  id?: string;
};

export default function Button(props: Button) {
  return (
    <button 
      data-testid={props.id}
      type="submit"
      className={`btn btn-primary btn-block ${props.classes ? props.classes : ""}`} 
      disabled={props.disabled}
      onClick={props.handler}
    >
      {props.text}
    </button>
  );
}
