/**
 * Card container component
 */

type Card = {
  /** Class modifiers */
  classes?: string;
  /** Title */
  title: string;
  /** Body */
  body: string;
  /** Body Id */
  id: string;
};

export default function Card(props: Card): React.ReactElement {
  const { classes, title, body, id } = props;
  return (
    <div className="card well expand mb-5">
      <div className="card-header mt-5 pt-0 pb-0 text-center">
        <h5 className="m-0">{title}</h5>
      </div>
      <div className="card-body d-flex flex-column align-items-center icon-table">
        <div className="row">
          <div className="col title-text h3" data-testid={id}>
            {body}
          </div>
        </div>
      </div>
    </div>
  );
}

Card.defaultProps = {
  classes: "",
};
