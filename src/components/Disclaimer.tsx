/**
 * Disclaimer component
 */

type Disclaimer = {
  /** Class modifiers */
  classes?: string;
  /** Text */
  text: string;
};

export default function Disclaimer(props: Disclaimer): React.ReactElement {
  const { classes, text } = props;
  return (
    <>
      <div className="row justify-content-center">
        <img
          src="https://app.meettally.com/webapp/img/shield.f7173d06.svg"
          className="mb-2"
          alt="Warning"
        />
      </div>
      <div className="row justify-content-center text-center">
        <div className="col-md-6">
          <p data-qa="ssl-encryption">
            <small>{text}</small>
          </p>
        </div>
      </div>
    </>
  );
}

Disclaimer.defaultProps = {
  classes: "",
};
