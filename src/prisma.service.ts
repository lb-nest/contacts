import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    this.$use(async (params, next) => {
      if (params.model === 'Contact') {
        switch (params.action) {
          case 'delete':
            params.action = 'update';
            params.args.data = {
              deleted: true,
            };
            break;

          case 'deleteMany':
            params.action = 'updateMany';
            params.args.data = {
              deleted: true,
            };
            break;

          default:
            break;
        }
      }

      return next(params);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
