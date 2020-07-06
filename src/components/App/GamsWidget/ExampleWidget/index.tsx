import React from "react";
import { GamsWidgetType, GAMSWidgetProps } from "../index"

//1. The component's props need to extend the GamsWidgetProps
//2. and provide the "widgetDef" property of GamsWidgetType
// (that can also be extended)
interface Props extends GAMSWidgetProps {
  widgetDef: GamsWidgetType,
  exampleProp?: string
}

const Example:React.FC<Props> = ({widgetDef, exampleProp}) => {

  return <p>{ exampleProp ? exampleProp : "no widget name provided" }</p>

}

export default Example;