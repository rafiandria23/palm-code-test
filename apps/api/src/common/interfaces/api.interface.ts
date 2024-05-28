import { FastifyRequest, FastifyReply } from 'fastify';
import { Transaction } from 'sequelize';

export interface ApiAuth {
  user_id: string;
}

export interface ApiFile {
  key: string;
}

export interface ApiRequest extends FastifyRequest {
  transaction: Transaction;
  auth: ApiAuth;
}

export interface ApiResponse extends FastifyReply {
  file: ApiFile;
}
