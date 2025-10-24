import { Module } from '@nestjs/common';
import { TransactionController } from './controller';
import { TransactionService } from './service';
import { TransactionListener } from './listener';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, TransactionListener],
})
export class TransactionModule {}
