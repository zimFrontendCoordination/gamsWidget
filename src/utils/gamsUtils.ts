


/**
 * Returns the current Digital Object's PID on GAMS
 * via reading out the pathname property. 
 * @returns pid as string.
 */
export const getCurrentPid = (): string => {

  let path = window.location.pathname;
  let fedoraObjExpr = "/archive/objects/";

  if(path.includes(fedoraObjExpr)){
    let index = path.indexOf(fedoraObjExpr);
    path = path.slice(index + fedoraObjExpr.length, path.length);
    let slashIndex = path.indexOf("/");
    // pid already available 
    if (slashIndex === -1) return path;
    return path.slice(0,slashIndex);
    
  //when no archive/objects before  
  } else {
    path = path.slice(1,path.length); //remove first '/'
    let slashIndex = path.indexOf("/");

    // in case no further path specification
    // rest params etc. would not be inside window.location.pathname.
    if(slashIndex === -1) return path;
    return path = path.slice(0, slashIndex);
  }

}

/**
 * Returns value of the 'locale' RestPathVariable. 
 * If not set returns 'de' by default.
 * @param localeDefault locale value to be returned when no value is set in url.
 * @returns value of locale Rest variable. If not set 
 * returns 'de' as default value. 
 */
export const getLocale = (localeDefault: string = "de") => {
  let locale = getRestParam("locale")
  return locale ? locale : localeDefault;
}

/**
 * Uses URL API to read out given RestPathVariable.
 * @param Name of the parameter
 * @returns Value of RestPathVariable. 
 */
export const getRestParam = (paramName: string) => {
  let url = new URL(window.location.href);
  let params = new URLSearchParams(url.searchParams);
  let param = params.get(paramName)
  return param;
}

/**
 * Uses setRestParam to set 'locale' RestPathVariable to given value.
 * @param langVal Value 'locale' should have.
 */
export const setLocale = (langVal: string) => {
  setRestParam("locale", langVal);
}

/**
 * Sets specified RestPathVariable to given value 
 * and sends client to the new url.
 * @param paramName Name of RestPathVariable to be set.
 * @param value New value for the RestPathVariable.
 */
export const setRestParam = (paramName: string, value: string): void => {
  let url = new URL(window.location.href);
  url.searchParams.set(paramName, value);
  window.location.href = url.href;
}

/**
 * Uses JSON.parse and JSON.stringify to generate 
 * a deep copy of given value.
 * @param {Object | Array<any>} value Object or Array to copy deep.
 * @returns {Object | Array<any>} deep copy of given Object or Array.
 */
export const copyDeep = (value: Object | Array<any>) => {
  return JSON.parse(JSON.stringify(value));
}


/**
 * Uses getCurrentPid() to retrieve client's current visibile project abbreviation.
 * e.g. o:derla.vor will return "derla" OR o:cantus.regensburg will return "cantus".
 * @param curPid Client's current visible pid to analyze. Reads out current project's pid
 * by default.
 * @returns client's visible project abbreviation in the url.
 */
export const getProjectAbbr = (curPid = getCurrentPid()) => {
  let abbr = "";
  let doublePointIndex = curPid.indexOf(":");
  abbr = curPid.slice(doublePointIndex + 1, curPid.length); 

  let pointIndex = abbr.indexOf(".");

  if(pointIndex===-1){
    return abbr
  } else {
    return abbr.slice(0, pointIndex);
  };
}