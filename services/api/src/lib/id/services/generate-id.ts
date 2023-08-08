import crypto from 'crypto';
import {GenerateIdFunction} from '../types/generate-id';
import logger from '../../logger/logger';

export const makeGenerateId = (): GenerateIdFunction => {
  return async function generateId(idLength): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      crypto.randomBytes(idLength / 2, (err, buffer) => {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        return resolve(buffer.toString('hex'));
      });
    });
  };
};
