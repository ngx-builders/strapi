export interface StrapiSchematicSchema {
  name: string;
  tags?: string;
  directory?: string;
  unitTestRunner: 'jest' | 'none';
}
