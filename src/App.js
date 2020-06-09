import React from "react";
import { Provider } from "./context";
import SearchComponent from "./components/Search/SearchComponent";
import "./App.scss";

class App extends React.Component {
  render() {
    return (
      <Provider>
        <SearchComponent></SearchComponent>
      </Provider>
    );
  }
}

export default App;
