import { FastifyRequest, FastifyReply } from 'fastify';

export interface ApiRequest extends FastifyRequest {
  auth: {
    user_id: string;
  };
}

export interface ApiResponse extends FastifyReply {
  file: {
    key: string;
  };
}
