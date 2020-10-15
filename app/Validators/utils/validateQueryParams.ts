import { rules, schema, validator } from '@ioc:Adonis/Core/Validator';
import NotFoundException from 'App/Exceptions/NotFoundException';
import { ParamItem, ParamsData } from 'Contracts/shared/ParamItem';

export default async (
  paramsArray: ParamItem[],
  paramsData: ParamsData
): Promise<void> => {
  const schemaObj = {};

  paramsArray.forEach((param) => {
    schemaObj[param.name] = schema.number([
      rules.exists({
        table: param.table,
        column: param.column,
      }),
    ]);
  });

  const paramsValidationSchema = schema.create(schemaObj);

  try {
    await validator.validate({
      schema: paramsValidationSchema,
      data: paramsData,
    });
  } catch (e) {
    throw new NotFoundException(
      `Not found: ${e}`,
      404,
      'E_NOT_FOUND_EXCEPTION'
    );
  }
};
