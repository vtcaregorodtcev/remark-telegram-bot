import { DynamoDB } from 'aws-sdk';
import { Context } from 'telegraf';
import { ContextWithSession, NextFunction, SessionType } from 'typings';

export class Session {
  constructor(private readonly db: DynamoDB, private readonly table: string) { }

  #sessionId = 'bot-session-id';

  middleware(): (ctx: Context, next: NextFunction) => void {
    const id = this.#sessionId;
    const db = this.db;
    const table = this.table;

    const _session: {
      value: SessionType
    } = {
      value: { id }
    };

    return (ctx: Context, next: NextFunction): void => {
      (ctx as ContextWithSession).session = {
        async load() {
          const item = await db.getItem({
            TableName: table,
            Key: { id: { S: id } },
          }).promise();

          _session.value = !item.Item ? { id } : DynamoDB.Converter.unmarshall(item.Item);

          return _session.value;
        },

        async get(name) {
          if (_session.value[name]) {
            return _session.value[name];
          }

          _session.value = await this.load();

          return _session.value[name];
        },

        async set(name, value) {
          _session.value[name] = value;

          await db.putItem({
            TableName: table,
            Item: DynamoDB.Converter.marshall(_session.value),
          }).promise();

          return void 0;
        }
      };

      next();
    };
  }
}