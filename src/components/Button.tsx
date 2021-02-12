/**
 * Button component
 */

type Button = {
  /** Class modifiers */
  classes?: string;
  /** Handler */
  handler: () => void;
  /** Text */
  text: string;
  /** Disabled */
  disabled?: boolean;
  /** Id */
  id?: string;
};

export default function Button(props: Button): React.ReactElement {
  const { classes, handler, text, disabled, id } = props;
  return (
    <button
      data-testid={id}
      type="submit"
      className={`btn btn-primary btn-block ${classes}`}
      disabled={disabled}
      onClick={handler}
    >
      {text}
    </button>
  );
}

Button.defaultProps = {
  classes: "",
  disabled: false,
  id: "",
};
