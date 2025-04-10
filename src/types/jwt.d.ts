export type JwtAuthStrategyDTO = {
  username: string;
  sub: string;
  clientId?: number;
  userId: string;
  alias?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  fullname: string;
  profile: string;
};
