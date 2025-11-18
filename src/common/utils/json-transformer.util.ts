import { ValueTransformer } from 'typeorm';

export class JsonTransformer implements ValueTransformer {
  to(value: any): string | null {
    if (value === null || typeof value === 'undefined') {
      return null;
    }
    try {
      return JSON.stringify(value);
    } catch (error) {
      console.error('Error al stringify JSON para la DB', error);
      return null;
    }
  }

  from(value: string | null): any {
    if (value === null || typeof value === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('Error al parsear JSON de la DB', error);
      return null;
    }
  }
}