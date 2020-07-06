import React from "react";
import { getCurrentPid } from "../../../../utils/gamsUtils";
import { GamsWidgetType } from "../index"
import { WidgetDefProviderProps } from ".."

// Extends WidgetDefProviderProps so that additional 
// props can be passed down (on level of <GamsWidget/> call)
// can only be optional properties.
interface GAMSWidgetDefProps extends WidgetDefProviderProps {
  globalPropName?: string;
  datastream?: string;
  objectPidRef?: string;   // if set to undefined -> assuming current object? via datastream?
                           // widget's that are configured by one specific object?
                           // like a context object.  
}

/**
 * Component checks if and where the global config object was assigned and
 * sets state of parent component. (for the configuration / basal widget definition).
 * globalProp overwrites datastream -> objectPidRef overwrites default behavior of reqeuesting client's
 * current object's pid.
 * @param globalPropName Name of the property of the global window object where the widget definition could be held.
 * @param datastream Name of datastream where the widget definition could be.
 * @param objectPidRef Pid of object from where the widget definition should be requested.
 */
const WidgetDefProvider: React.FC<GAMSWidgetDefProps> = ({
  setDefinition = undefined, 
  children = undefined,
  globalPropName,
  datastream,     
  //maybe best to set object reference to "managed content" | "reference" | "x" ? like in cirillo?
  // or contextObject with datastream?
  // or service to call
  objectPidRef
}) => {
  React.useEffect(() => {
    if (!setDefinition) return;

    // configured window object validates true
    if(window[globalPropName as any]){
      return setDefinition(window[globalPropName as any]);
    } 
    
    // window object not defined
    // try to fetch for GUI def in datastream
    // first assign PID.
    let reqPid = objectPidRef ? objectPidRef : getCurrentPid();

    if(datastream){ 
      let requestUrl = `${window.location.origin}/archive/objects/${reqPid}/datastreams/${datastream}/content`  
      // fetch object's widget datastream
      fetch(requestUrl).then(data => {
        data.text().then(text => {
          try {
            setDefinition(JSON.parse(text));
          } catch(e){
            //parse xml to JSON via lib best?
          }
        }).catch(err => {
          console.error("GamsWidget- WidgetDefProvider: Error stringifying the datastream at: ", requestUrl);
          console.error(err);
        });
      }).catch(err => {
        console.error("GamsWidget- WidgetDefProvider: Error at getting config data from url: ", requestUrl);
        console.error(err);
      })
    } else {
      console.error("GamsWidget- WidgetDefProvider: No global window property nor datastream defined for retrieving the widget's definition. Returning dummy-definition instead. (But the app might crash).");
      let dummyDef: GamsWidgetType  = {
        name:"Dummy-Test Widget",
        lifecycle:"develop"        
      }
      console.error("GamsWidget- WidgetDefProvider: Set dummy definition: ", dummyDef);
      setDefinition(dummyDef);    
    }

  }, [setDefinition, globalPropName, datastream, objectPidRef]);

  return children ? children : null;
};

export default WidgetDefProvider;
