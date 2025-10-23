import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionListener } from './transaction.listener';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, TransactionListener],
})
export class TransactionModule {}
