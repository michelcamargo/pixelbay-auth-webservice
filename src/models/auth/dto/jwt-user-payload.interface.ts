export interface JwtUserPayload {
  id: number;
  username: string;
  permissions: string[];
}
