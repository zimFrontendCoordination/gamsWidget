import { Feature, FeatureCollection } from "geojson";

export interface gdasFeature extends Feature {
  properties: gdasFeatureProperties
}

export interface gdasFeatureCollection extends FeatureCollection {
  features: gdasFeature[];
}

export interface gdasFeatureProperties {
  title: string;
  ref?: string;
  date?: string;
  osm?: string;
  description?: string;
  address?: string;
  publicAvailable?: string;
  popupImgSrc?: string;
  [property: string]: any
}

export interface gdasQuerriedFeatureProperties extends gdasFeatureProperties {
  	geoWkt: string
}