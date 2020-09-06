import React from "react";
import GamsWidget from "./GamsWidget"
import WidgetDefProvider from "./GamsWidget/WidgetDefProvider"
import DataProvider from "./GamsWidget/DataProvider"
import ExampleWidget from "./GamsWidget/ExampleWidget";

const App: React.FC = () => {

  return <GamsWidget
    /**
     * Optionally pass down own custom DataProvider + WdigetDefPRovider impls.  
     */
    //WidgetDefProvider={{Component:WidgetDefProvider}}
    //WidgetDataProvider={{Component: DataProvider}}
    datastream="MY_WIDGET_DATASTREAM"
    globalPropName="__MY_EXAMPLE_WIDGET"
  >
    <ExampleWidget/>
  </GamsWidget>

}


export default App;