import {
  Logger,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';

/**
 * Prepara un error de base de datos para ser lanzado.
 * @param error - El error capturado en el bloque catch.
 * @param logger - La instancia del Logger del servicio que lo invoca.
 * @returns Una instancia de HttpException.
 */
export const handleDatabaseError = (
  error: any,
  logger: Logger,
): HttpException => {
  if (
    error instanceof NotFoundException ||
    error instanceof ConflictException ||
    error instanceof HttpException
  ) {
    return error;
  }

  if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
    logger.warn(
      `Intento de crear un registro duplicado. Error: ${
        error.detail || error.message
      }`,
    );
    return new ConflictException(
      `Ya existe un registro con esos datos (llave duplicada).`,
    );
  }

  logger.error('Error no controlado:', error.stack, error.context);
  return new InternalServerErrorException(
    'Ocurrió un error inesperado, por favor contacte al administrador.',
  );
};