import "./App.css";
import MortgageCalculator from "./containers/MortgageCalculator";

const App: React.FC = (): React.ReactElement => {
  return (
    <div className="app">
      <MortgageCalculator />
    </div>
  );
};

export default App;
