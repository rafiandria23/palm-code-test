import { FastifyRequest, FastifyReply } from 'fastify';
import { Transaction } from 'sequelize';

export interface ApiDb {
  transaction: Transaction;
}

export interface ApiAuth {
  user_id: string;
}

export interface ApiFile {
  key: string;
}

export interface ApiRequest extends FastifyRequest {
  db: ApiDb;
  auth: ApiAuth;
}

export interface ApiResponse extends FastifyReply {
  file: ApiFile;
}
