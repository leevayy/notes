import * as generatedZodDtoInterfaces from './generated/generated_interfaces.ts';
import * as zodDtoInterfacesWithValidation from './interfaces.ts';

export const zodDtoInterfaces = {
    ...generatedZodDtoInterfaces,
    ...zodDtoInterfacesWithValidation,
};
