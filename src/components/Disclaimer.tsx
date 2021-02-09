import React from "react";
/**
 * Disclaimer component
 */

type Disclaimer = {
  /** Class modifiers */
  classes?: string;
  /** Text */
  text: string;
};

export default function Disclaimer(props: Disclaimer) {
  return (
    <React.Fragment>
      <div className="row justify-content-center">
        <img src="https://app.meettally.com/webapp/img/shield.f7173d06.svg" className="mb-2" />
      </div>
      <div className="row justify-content-center text-center">
        <div className="col-md-6">
          <p data-qa="ssl-encryption"><small>{props.text}</small></p>
        </div>
      </div>
    </React.Fragment>
  );
}