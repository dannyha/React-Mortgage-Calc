/**
 * Body component
 */

type Body = {
  /** Children component */
  children: React.ReactNode;
};

export default function List({ children }: Body): React.ReactElement {
  return (
    <div className="app-content">
      <div className="container">
        <div className="v-centered-row row align-items-center">
          <div className="col">
            <div className="col justify-content-center">{children}</div>
            <div className="row justify-content-center mt-5">
              {/* <img
                src="https://app.meettally.com/webapp/img/app-badge.177c7be6.svg"
                alt="New Apps We Love"
                className="icon-appswelove pb-5"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
