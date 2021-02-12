/**
 * Banner component
 */

type Banner = {
  /** Class modifiers */
  classes?: string;
  /** Text */
  text: string;
  /** Icon */
  icon: boolean;
  /** Id */
  id?: string;
};

export default function Banner(props: Banner): React.ReactElement {
  const { classes, text, icon, id } = props;
  return (
    <div data-testid={id} role="alert" className={`text-center ${classes}`}>
      {icon && (
        <img
          src="https://app.meettally.com/webapp/img/alert-icon.ac7d6114.svg"
          className="alert-icon"
          alt="Warning"
        />
      )}
      <div className="alert-text">{text}</div>
    </div>
  );
}

Banner.defaultProps = {
  classes: "",
  id: "",
};
