declare module 'strapi' {
  import { DatabaseManager, Repository } from 'strapi-database';

// const config;
// const plugins;
// const services;
// const utils;

  namespace strapi {
    export interface IAttribute {
      collection: string;
      model: string;
      plugin: string;
    }

    export interface IModel {
      globalId: string;
      collectionName: string;
      attributes: {
        [key: string]: IAttribute;
      }
    }

    export interface IModelCollection {
      [key: string]: IModel;
    }

    export interface ICollection {
      [name: string]: {
        models: IModelCollection;
      }
    }

    export const api: ICollection;
    export const plugins: ICollection;
    export const components: IModelCollection;

    export const db: DatabaseManager;

    export function query(model: string, plugin: string): Repository;

    export function load(): Promise<strapi>;

    export function start(): void;
  }

  function strapi(opts?: { }): strapi;

  export = strapi;

  declare global {
    const strapi: strapi;
  }
}
