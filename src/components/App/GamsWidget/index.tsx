import React from "react";

export interface GAMSWidgetProps {
  widgetDef: GamsWidgetType; 
}

/**
 * Definition of props for the WidgetDefProvider.
 * The component must set the GamsWidget's widgetDefinition state
 * somehow / somewhere. (btw by default GamsWidget uses a component specific to GAMS
 * that can be imported from here)
 */
export interface WidgetDefProviderProps {
  setDefinition?: React.Dispatch<React.SetStateAction<GamsWidgetType | undefined>>;
  [property: string]: any
  children?: any
}

/**
 * Definition of props for the WidgetDataProvider.
 * The component must set the GamsWidget's widgetData state
 * somehow / somewhere. (btw by default GamsWidget uses a component specific to GAMS
 * that can be imported from here)
 */
export interface WidgetDataProviderProps { 
  widgetDef: GamsWidgetType
  setWidgetData: React.Dispatch<React.SetStateAction<any>>;
  children?: any
}

interface Props { 
  WidgetComponent: {Component: React.FC<GAMSWidgetProps>, props?: any}; 
  WidgetDefProvider: {Component: React.FC<WidgetDefProviderProps>, props?:any };
  WidgetDataProvider: {Component: React.FC<WidgetDataProviderProps>, props?:any } ;
}

/**
 * Component provides base setup for a GAMS Widget
 * like configuration via ajax or local js object.
 * Passes configuration and data down to given child
 * GAMSWidgetComponent.
 * @param WidgetComponent WidgetComponent to be passed down.
 * @param WidgetDefProvider Component that handles the "request" / "get" for the Widget's configuration
 * @param WidgetDataProvider Component that handles the "request" / "get" for the Widget's data.
 */
const GamsWidget: React.FC<Props> = ({ WidgetComponent, WidgetDefProvider, WidgetDataProvider }) => {
  const [widgetDef, setWidgetDef] = React.useState<GamsWidgetType | undefined>(
    undefined
  );

  const [widgetDataSet, setWidgetDataSet] = React.useState<boolean>(false);

  React.useEffect(()=>{
    if(!widgetDef)return;

    // message according to set lifecycle etc.
    if(widgetDef.lifecycle){
      if((widgetDef.lifecycle === "develop") || (widgetDef.lifecycle === "production"))console.debug("GamsWidget: WidgetDefinition's lifecycle was configured as:'", widgetDef.lifecycle, "' Set the lifecycle to 'deploy' if you want to remove the console messages.");
    } else {
      console.debug("GamsWidget: WidgetDefinition's lifecycle not set. Defaulting to:'develop'. Set the lifecycle to 'deploy' if you want to remove the console messages.");
    }
  }, [widgetDef])

  /**
   * Allows setting state of the widgetDef AND
   * to mark if data-processing was done. Passed
   * down to the Data-Provider as memorized useCallback. (down below)
   */
  const setWidgetData = (widgetDef: GamsWidgetType) => {
    setWidgetDataSet(true);
    setWidgetDef(widgetDef);
  }

  /**
   * 
   */
  const memoSetWidgetdata = React.useCallback(widgetDef => {
    setWidgetData(widgetDef)
  }, []);

  return (
    <>
      <WidgetDefProvider.Component
        {...WidgetDefProvider.props}
        setDefinition={setWidgetDef}
      />
      {widgetDef ? <WidgetDataProvider.Component widgetDef={widgetDef} setWidgetData={memoSetWidgetdata} {...WidgetDataProvider.props}/> : null}
      {widgetDef && widgetDataSet ? <WidgetComponent.Component widgetDef={widgetDef} {...WidgetComponent.props} /> : null}
    </>
  );
};

export default GamsWidget;


// GamsWidget Type

// object of kind given to gamsJs?
// e.g. like: gamsJs.inject.toggableSidebar({lifecycle: ...})  ---> widget config provided by gamsJs directly?  (as JSON?)
// OR: gamsJs.inject.toggableSidebar()                         ---> widget config provided by datastream? (as e.g. XML)
export interface GamsWidgetType {
  lifecycle?: "develop" | "production" | "deploy";       // defaults to develop --> message to set development mode! 
  name?: string;                                         // method call in gamsJs specifies widget name. ()
  description?: string;                                  // description for the widget.                        
  intent?: string;                                       // description of the widget should've been used. 
  gui?: any;                                             // configuration comes always(?) from the current pid. Must be handled in gamsJs not here specifically.
  
  // arbitray data structure for the widget to use
  // can define widget's data directly here
  // the data provider will write fetched data onto here.  
  data?:any;  

  // not every widget needs data to work (labels)
  // buttons etc. are nested inside "gui"
  // allow multiple sources and therefore merging on client side
  dataSourcesSpec?: {
    // for flexibility reasons type is specified inside sources BUT:
    // all sources must be of same type atm.
    // otherwise the data merging process would be difficult.
    sources: {
        type: "api" | "local" | "gamsGMLObject" | "gamsTEIObject" | "gamsQueryObject";
        pid?: string;
        url?: string;
      }[]
  };
  
}
