import { FastifyRequest } from 'fastify';

export interface AuthRequest extends FastifyRequest {
  auth: {
    user_id: string;
  };
}
