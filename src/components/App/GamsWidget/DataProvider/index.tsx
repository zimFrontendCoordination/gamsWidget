import React from "react";
import { WidgetDataProviderProps, GamsWidgetDataSource } from "..";


const DataProvider: React.FC<WidgetDataProviderProps> = ({ widgetDef, setWidgetData }) => {

  React.useEffect(() => {
    widgetDef.lifecycle = widgetDef.lifecycle ? widgetDef.lifecycle : "develop"; 
    let lifecycle = widgetDef.lifecycle;

    // when no dataSpec -> assuming none necessary.
    //@ts-ignore
    if(widgetDef.dataSourcesSpec){
      //fetch data according to dataSpec
      if(lifecycle === "develop") console.debug("GamsWidget-DataProvider: Data provided for the widget: ", widgetDef);

      //async IIFE to await + load + merge of data when multiples
      (async () => {
        // simultaneously fetch data - and then await merge?
        // own method that can be awaited
        
        //@ts-ignore
        //let reqCount: number = widgetDef.dataSpec.length;
        //let reqCompletedCounter: number = 0;
        
        //@ts-ignore (is ok although dataSpec must be defined)
        widgetDef.dataSourcesSpec.sources.forEach(source => {
          




        });


      })();


      //TODO -> loop over all data specs.
      //atm take only first data spec into account
      let dataSource = widgetDef.dataSourcesSpec.sources[0];
      if(!checkDataSource(dataSource))return console.error("GamsWidget-DataProvider: Validation of data source object failed. Aborting operations: ", dataSource);
      
      if(dataSource.gamsDigitalObj){



      } 





    } else {
      if(lifecycle === "develop") console.debug("GamsWidget-DataProvider: No data provided for the widget - Assuming not needed for widget definition: ", widgetDef);
      setWidgetData(widgetDef);
    }
  }, [ widgetDef, setWidgetData ]);

  return null

}

export default DataProvider;




/**
 * Checks if exactly one property of given GamsWidgetDataSource object is defined.
 *@param dataSource GamsWidgetDataSource object to be validated. 
 *@returns True if exactly one property is defined. False if none or multiple are defined.
 */
const checkDataSource = (dataSource: GamsWidgetDataSource): boolean => {
  // adds all properties validated to true to the array.
  let definedProps = Object.values(dataSource).filter(val => val ? val : false);
  if(definedProps.length === 1){
    console.info("GamsWidget-DataProvider: Validation of Datasource successfull: ", dataSource);
    return true;
  } else if(definedProps.length === 0){
    console.error("GamsWidget-DataProvider: All properties of given DataSource validated false. Please make sure to assign one correct property to the given datasource object: ", dataSource);
    return false;
  } else {
    console.error("GamsWidget-DataProvider: More than one property is defined in given datasource. Make sure to define only one: ", dataSource);
    return false;
  }  
}