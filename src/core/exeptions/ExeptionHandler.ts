import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import * as R from 'ramda'

export class ExeptionHadler extends Error {
  fields?: Array<string>
  message: string;
  source?: string;

  constructor(e) {
    super()
    if (e instanceof PrismaClientKnownRequestError) {
      this.source = 'db'

      switch (e.code) {
        case 'P2002':
          this.name = 'duplicate'
          if (R.hasPath(['meta', 'target'], e)) {
            this.fields = R.path(['meta', 'target'], e)
          }
          break;

        default: {
          this.message = 'service_error'
        }
      }
    }
  }
}