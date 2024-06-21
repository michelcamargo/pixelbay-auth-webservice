import ObjectHelper from './object.helper';
import { Request, Response } from 'express';

class ConsoleHelper {
  static logRequest(request: Request) {
    const { method, url, headers, body, query, params, ip } = request;

    console.log(
      JSON.stringify(
        {
          [ip]: `${method}: ${url} @ ${headers['user-agent']}`,
          timestamp: new Date().toISOString(),
          body: ObjectHelper.isObjectEmpty(body)
            ? undefined
            : JSON.stringify(body),
          query: ObjectHelper.isObjectEmpty(query)
            ? undefined
            : JSON.stringify(query),
          params: ObjectHelper.isObjectEmpty(params)
            ? undefined
            : JSON.stringify(params),
        },
        null,
        2,
      ),
    );
  }

  static logResponse(response: Response) {
    const { statusCode, statusMessage } = response;

    console.log(
      JSON.stringify({
        [statusCode]: `${statusMessage}`,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}

export default ConsoleHelper;
