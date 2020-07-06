import React from "react";
import { getCurrentPid } from "../../../../utils/gamsUtils";
import { WidgetDefProviderProps } from ".."

// Extends WidgetDefProviderProps so that additional 
// props can be passed down (on level of <GamsWidget/> call)
// can only be optional properties.
interface GAMSWidgetDefProps extends WidgetDefProviderProps {
  globalPropName?: string;
  datastream?: string;
}

/**
 * Component checks if the global config object was assigned and
 * sets state of parent component. (for the configuration)
 * 
 */
const WidgetDefProvider: React.FC<GAMSWidgetDefProps> = ({
  setDefinition = undefined, 
  children = undefined,
  globalPropName,
  datastream,     //maybe best to set object reference to "managed content" | "reference" | "x" ? like in cirillo?
  // or contextObject with datastream?
  // or service to call
}) => {
  React.useEffect(() => {
    if (!setDefinition) return;

    // configured window object validates true
    if(window[globalPropName as any]){
      return setDefinition(window[globalPropName as any]);
    } else if(datastream) {
    // window object not defined
      // try to fetch for GUI def in datastream
      let curPid = getCurrentPid();
      let requestUrl = `${window.location.origin}/archive/objects/${curPid}/datastreams/${datastream}/content`  
      
      // fetch object's widget datastream
      fetch(requestUrl).then(data => {
        data.text().then(text => {
          try {
            setDefinition(JSON.parse(text));
          } catch(e){
            //parse xml to JSON via lib best?
          }
        }).catch(err => {
          console.error("Error stringifying the datastream at: ", requestUrl);
          console.error(err);
        });
      }).catch(err => {
        console.error("Error at getting config data from url: ", requestUrl);
        console.error(err);
      })
    } else {
      console.warn("GamsWidget- WidgetDefProvider: No global window property nor datastream defined for retrieving the widget's definition. Returning test-data instead.");
    }

  }, [setDefinition, globalPropName, datastream]);

  return children ? children : null;
};

export default WidgetDefProvider;
