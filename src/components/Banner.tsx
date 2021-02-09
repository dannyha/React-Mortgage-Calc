/**
 * Banner component
 */

type Banner = {
  /** Class modifiers */
  classes?: string;
  /** Text */
  text: string;
  /** Icon */
  icon: boolean
  /** Id */
  id?: string
};

export default function Banner(props: Banner) {
  return (
    <div data-testid={props.id} role="alert" className={`text-center ${props.classes ? props.classes : ""}`}>
      {props.icon && <img src="https://app.meettally.com/webapp/img/alert-icon.ac7d6114.svg" className="alert-icon" />}
      <div className="alert-text">{props.text}</div>
    </div>
  );
}