import {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';

const scriptAsync = promisify(scrypt);

export class Authentication {
  async pwdToHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buff = (await scriptAsync(password, salt, 64)) as Buffer;

    return `${buff.toString('hex')}.${salt}`;
  };

  async pwdCompare(storedPwd: string, suppliedPwd: string) {
    const [hashedPwd, salt] = storedPwd.split('.');

    const buff = (await scriptAsync(suppliedPwd, salt, 64)) as Buffer;
    return buff.toString('hex') === hashedPwd
  }
};

export const authenticationService = new Authentication();
