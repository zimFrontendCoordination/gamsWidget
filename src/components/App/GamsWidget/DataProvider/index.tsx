import React from "react";
import { WidgetDataProviderProps, GamsWidgetDataSource } from "..";
import { getCurrentPid } from "../../../../utils/gamsUtils";


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


      //TODO -> loop over all data specs. (not only the first)
      //TODO -> currently only supports json!
      //atm take only first data spec into account
      let dataSource = widgetDef.dataSourcesSpec.sources[0];
      if(!checkDataSource(dataSource))return console.error("GamsWidget-DataProvider: Validation of data source object failed. Aborting operations: ", dataSource);
      
      
      //when dataSource is a digital object.
      //following code clause build the correct "request url"
      if(dataSource.gamsDigitalObj){

        // build "first part" of url first according to pid definition.
        let pid = dataSource.gamsDigitalObj.pid ? dataSource.gamsDigitalObj.pid : getCurrentPid();
        let reqUrlStart = `${window.location.origin}/archive/objects/${pid}`;
        let reqUrlFull = '';

        // both defined doesn't make any sense.
        if(dataSource.gamsDigitalObj.datastream && dataSource.gamsDigitalObj.service)return console.error("GamsWidget-DataProvider: Got a dataSource object where both a datastream and a service is defined. Please make sure to define either one: ", dataSource);

        //first case of datastreams (same in every case)
        if(dataSource.gamsDigitalObj.datastream){
          reqUrlFull = reqUrlStart + `/datastreams/${dataSource.gamsDigitalObj.datastream}/content`;

          // case of service should be called.
        } else {
          
          // call standard service or specified one specific for content model
          switch(dataSource.gamsDigitalObj.contentModel){
            case "GML":
              reqUrlFull = reqUrlStart + `/methods/sdef:GML/${dataSource.gamsDigitalObj.service ? dataSource.gamsDigitalObj.service : "getJSON"}`;
              break;
            case "TEI":
              reqUrlFull = reqUrlStart + `/methods/sdef:TEI/${dataSource.gamsDigitalObj.service ? dataSource.gamsDigitalObj.service : "get"}`;
              break;
            case "Context":
              reqUrlFull = reqUrlStart + `/methods/sdef:Context/${dataSource.gamsDigitalObj.service ? dataSource.gamsDigitalObj.service : "get"}`;
              break;
            case "Query":
              reqUrlFull = reqUrlStart + `/methods/sdef:Query/${dataSource.gamsDigitalObj.service ? dataSource.gamsDigitalObj.service : "getJSON"}`;
              break;
            default:
              return console.error("GamsWidget-DataProvider: Unsupported-ContentModel-Error at building the request url for specified content model: ", dataSource.gamsDigitalObj.contentModel, dataSource);
          }

        }

        // when request url correctly built for gamsObject -> start fetch.
        fetch(reqUrlFull).then(resp => {
          resp.json().then(json => {
            setWidgetData(json);
          }).catch(err => {
            console.error("GamsWidget-DataProvider: Error parsing data as JSON from datasource: ", dataSource);
            console.error(err);
          });
          
        });

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