export function getExpirationTime(expiresIn: string) {
  const now = new Date();
  let milliseconds: number;

  const unit = expiresIn.slice(-1);
  const value = parseInt(expiresIn.slice(0, -1), 10);

  switch (unit) {
    case 's':
      milliseconds = value * 1000;
      break;
    case 'm':
      milliseconds = value * 60 * 1000;
      break;
    case 'h':
      milliseconds = value * 60 * 60 * 1000;
      break;
    case 'd':
      milliseconds = value * 24 * 60 * 60 * 1000;
      break;
    default:
      throw new Error('Unidade de tempo inválida');
  }

  return new Date(now.getTime() + milliseconds);
}
