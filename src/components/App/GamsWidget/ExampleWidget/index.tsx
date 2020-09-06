import React from "react";
import { GamsWidgetType, GAMSWidgetProps } from "../index"

//1. The component's props need to extend the GamsWidgetProps
//2. and provide the "widgetDef" property of GamsWidgetType
// (that can also be extended)
interface Props extends GAMSWidgetProps {
  widgetDef?: GamsWidgetType,
  exampleProp?: string
}

/**
 * Take a look at public/index.html for global defined widget variable.
 */
const Example:React.FC<Props> = ({widgetDef}) => {

  return widgetDef ? (
    <>
      <p>Given name for widget: {widgetDef.name}</p>
      <p>Given description for widget: {widgetDef.description}</p>
    </>
  ) : null

}

export default Example;