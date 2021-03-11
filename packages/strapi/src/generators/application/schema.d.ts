export interface StrapiGeneratorSchema {
  name: string;
  tags?: string;
  directory?: string;
  unitTestRunner: 'jest' | 'none';
}
