import * as jwt from 'jsonwebtoken';

export class Authenticator {
  public generateToken(
    input: AuthenticationData,
    expiresIn: string = process.env.JWT_EXPIRES_IN as string,
  ): string {
    const token = jwt.sign(
      {
        id: input.id,
      },
      process.env.JWT_KEY as string,
      {
        expiresIn,
      },
    );
    return token;
  }

  public verify(token: string): AuthenticationData {
    const data = jwt.verify(token, process.env.JWT_KEY as string) as any;
    return {
      id: data.id,
    };
  }
}

interface AuthenticationData {
  id: string;
}
