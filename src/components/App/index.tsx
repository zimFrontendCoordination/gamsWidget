import React from "react";
import GamsWidget from "./GamsWidget"
import WidgetDefProvider from "./GamsWidget/WidgetDefProvider"
import DataProvider from "./GamsWidget/DataProvider"
import ExampleWidget from "./GamsWidget/ExampleWidget";

const App: React.FC = () => {

  return <GamsWidget
    WidgetComponent={{Component: ExampleWidget, props:{exampleProp:" This prop is injected to the <ExampleWidget> "}}}
    WidgetDefProvider={{Component:WidgetDefProvider}}
    WidgetDataProvider={{Component: DataProvider}}
  ></GamsWidget>

}


export default App;