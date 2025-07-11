import yaml from 'js-yaml';

interface Schema {
  description?: string;
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  format?: 'date' | 'date-time' | 'byte' | 'binary';
  enum?: (string | number)[];
  required?: string[];
  properties?: Record<string, Schema>;
  items?: Schema;
  $ref?: string;
}

interface Operation {
  requestBody?: {
    content: {
      [mediaType: string]: {
        schema: Schema;
      };
    };
  };
  responses?: {
    [statusCode: string]: {
      content?: {
        [mediaType: string]: {
          schema: Schema;
        };
      };
    };
  };
}

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  delete?: Operation;
  patch?: Operation;
}

interface Spec {
  openapi: string;
  components?: {
    schemas?: Record<string, Schema>;
  };
  definitions?: Record<string, Schema>;
  paths?: Record<string, PathItem>;
}

function generateNameFromPath(path: string): string {
  const lastSegment = path.split('/').pop() || '';
  const nameWithoutExtension = lastSegment.split('.')[0] || '';
  const pascalCaseName = nameWithoutExtension
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  return `${pascalCaseName}Params`;
}

function parseSpec(content: string): Spec {
  try {
    return JSON.parse(content);
  } catch {
    try {
      return yaml.load(content) as Spec;
    } catch {
      throw new Error('Invalid input: Content is not valid JSON or YAML.');
    }
  }
}

function mapType(schema: Schema): string {
  if (schema.$ref) {
    return schema.$ref.split('/').pop() || 'any';
  }
  if (schema.enum) {
    return schema.enum.map(val => typeof val === 'string' ? `'${val}'` : val).join(' | ');
  }
  switch (schema.type) {
    case 'string': return 'string';
    case 'number': case 'integer': return 'number';
    case 'boolean': return 'boolean';
    case 'array': return schema.items ? `${mapType(schema.items)}[]` : 'any[]';
    case 'object': return 'Record<string, any>';
    default: return 'any';
  }
}

function generateProperty(propName: string, propSchema: Schema, requiredFields: string[]): string {
  const isRequired = requiredFields.includes(propName);
  const propertyName = `${propName}${isRequired ? '' : '?'}`;
  const propertyType = mapType(propSchema);
  let propertyString = '';
  if (propSchema.description) {
    propertyString += `  /**\n   * ${propSchema.description}\n   */\n`;
  }
  propertyString += `  ${propertyName}: ${propertyType};\n`;
  return propertyString;
}

function generateSingleInterface(name: string, schema: Schema): string {
  let interfaceString = '';
  if (schema.description) {
    interfaceString += `/**\n * ${schema.description}\n */\n`;
  }
  interfaceString += `export interface ${name} {\n`;
  const requiredFields = schema.required || [];
  if (schema.properties) {
    for (const propName in schema.properties) {
      const propSchema = schema.properties[propName];
      interfaceString += generateProperty(propName, propSchema, requiredFields);
    }
  }
  interfaceString += '}\n';
  return interfaceString;
}

function liftInlineSchemas(spec: Spec): Record<string, Schema> {
  const schemas: Record<string, Schema> = { ...(spec.components?.schemas || spec.definitions || {}) };
  const schemaPrefix = spec.openapi.startsWith('3.') ? '#/components/schemas/' : '#/definitions/';

  if (!spec.paths) return schemas;

  for (const path in spec.paths) {
    const pathItem = spec.paths[path];
    if (!pathItem) continue;

    (Object.keys(pathItem) as HttpMethod[]).forEach(method => {
      const operation = pathItem[method];
      if (!operation) return;

      const requestBodyContent = operation.requestBody?.content;
      if (requestBodyContent) {
        for (const mediaType in requestBodyContent) {
          const mediaTypeObject = requestBodyContent[mediaType];
          const schema = mediaTypeObject?.schema;
          if (schema && !schema.$ref) {
            const schemaName = generateNameFromPath(path);
            schemas[schemaName] = schema;
            mediaTypeObject.schema = { $ref: schemaPrefix + schemaName };
          }
        }
      }
    
    });
  }
  return schemas;
}

export function generateInterfaces(specContent: string): string {
  if (!specContent.trim()) {
    return '// Please paste your OpenAPI/Swagger spec in the input area and click "Generate".';
  }

  try {
    const spec = parseSpec(specContent);
    
    const allSchemas = liftInlineSchemas(spec);

    if (Object.keys(allSchemas).length === 0) {
      throw new Error('No schemas found in components/schemas, definitions, or inline in paths.');
    }

    const allInterfaces = Object.entries(allSchemas)
      .map(([name, schema]) => generateSingleInterface(name, schema))
      .join('\n');

    return allInterfaces;
  } catch (error) {
    if (error instanceof Error) {
      return `// Error: ${error.message}`;
    }
    return '// An unknown error occurred during conversion.';
  }
}
