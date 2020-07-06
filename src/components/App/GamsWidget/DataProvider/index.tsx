import React from "react";
import { WidgetDataProviderProps } from "..";


const DataProvider: React.FC<WidgetDataProviderProps> = ({ widgetDef, setWidgetData }) => {

  React.useEffect(() => {
    widgetDef.lifecycle = widgetDef.lifecycle ? widgetDef.lifecycle : "develop"; 
    let lifecycle = widgetDef.lifecycle;

    // when no dataSpec -> assuming none necessary.
    //@ts-ignore
    if(widgetDef.dataSpec){
      //fetch data according to dataSpec
      if(lifecycle === "develop") console.debug("GamsWidget-DataProvider: Data provided for the widget: ", widgetDef);

      //async IIFE to await + load + merge of data when multiples
      (async () => {
        // simultaneously fetch data - and then await merge?
        // own method that can be awaited
        
        //@ts-ignore
        let reqCount: number = widgetDef.dataSpec.length;
        let reqCompletedCounter: number = 0;
        
        //@ts-ignore (is ok although dataSpec must be defined)
        widgetDef.dataSpec.sources.forEach(source => {
          




        });


      })();


      



    } else {
      if(lifecycle === "develop") console.debug("GamsWidget-DataProvider: No data provided for the widget - Assuming not needed for widget definition: ", widgetDef);
      setWidgetData(widgetDef);
    }
  }, [ widgetDef, setWidgetData ]);

  return null

}

export default DataProvider;