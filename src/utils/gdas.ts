import { gdasFeatureCollection, gdasFeature } from "../@types/gdas";

/**
 * Checks for unique property values in given features (via the featureCollecion) and returns an Object
 * with the property values as keys set to true as value.
 * @param featureCollection gdasFeatureCollection that should be analyzed
 * @param "name" of the property to be extracted e.g. if feature.properties.group -> "group" as second argument of the function
 * @returns Object with all unique values as property.
 */
export const retrieveUniquesBoolMap = (
  featureCollection: gdasFeatureCollection,
  propToCheck: string
): { [property: string]: boolean } => {
  let boolMap: { [property: string]: boolean } = {};
  featureCollection.features.forEach((feature: gdasFeature) => {
    boolMap[feature.properties[propToCheck]] = true;
  });
  return boolMap;
};


/**
 * Breaks up given featureCollection into an array of featureCollections, where 
 * the result is sorted according to unique values for given feature property.
 * E.g. all features in returned featureCollection have feature.properties.category = "building",
 * features of kind feature.properties.category = "stone" will be in the other collection,
 * if "category" was passed as propName.
 * @param featureCollecion featureCollection to break up.
 * @param propName propName of feature. On which unique values the break up process is based.
 * @returns Broke up featureCollection as array of sorted feautureCollections.
 */
export const disperseFeatureCollection = (featureCollecion: gdasFeatureCollection, propName: string): gdasFeatureCollection[] => {

  //first retrieving unique values (for given propName) and store inside an array.
  let uniques = retrieveUniquesBoolMap(featureCollecion, propName);

  //second create an own feature collection for each unique prop value
  let collection: gdasFeatureCollection[] = [];
  Object.keys(uniques).map(key => {
    let featureCollectionIntern: gdasFeatureCollection = { 
      type: "FeatureCollection",
      features:[]
    }
    collection.push(featureCollectionIntern);
  });

  //third assigning features to the individual feature collections via index.
  featureCollecion.features.forEach(feature => {
    Object.keys(uniques).map((key,index) => {
      if(feature.properties[propName] === key)collection[index].features.push(feature);
    });
  });

  return collection;
}