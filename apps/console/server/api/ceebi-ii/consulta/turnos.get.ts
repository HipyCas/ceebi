import * as fs from 'node:fs';
import csv from 'csv-parser';
import * as path from 'node:path';
import { tryit } from 'radash';

export default defineEventHandler(async (event) => {
  const { privatePath } = useRuntimeConfig(event);

  setHeader(event, 'Content-Type', 'application/json');
  setHeader(event, 'Access-Control-Allow-Origin', '*');

  const query = getQuery(event);
  if (!query.id) {
    setResponseStatus(event, 400);
    return {
      error: 'Request must include an id!',
    };
    // throw createError({
    //   statusCode: 400,
    //   statusMessage: 'Request must include an id!',
    //   data: {
    //     error: 'Request must include an id!',
    //   },
    // });
  }

  const input = query.id.toString().trim().toUpperCase();

  const [err, output] = (await tryit(promiseDataResolve)(
    input,
    path.join(privatePath, 'query-data.csv')
  )) as [unknown, unknown] as [{ code: number; msg: string }, { id: string }];

  if (err) {
    setResponseStatus(event, err.code);
    return {
      error: err.msg,
    };
  }

  return {
    output,
  };
});

function promiseDataResolve(input: string, csvPath: string) {
  return new Promise((resolve, reject) => {
    let found = false;

    try {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row: { id: string }) => {
          if (row.id.trim().toUpperCase() === input) {
            found = true;
            resolve(row);
          }
        })
        .on('end', () => {
          if (!found) {
            console.log(`Not found "${input}"!`);
            // res.status(404).json({ error: 'No results found!' });
            // setResponseStatus(event, 404);
            // send(event, );
            reject({
              code: 404,
              msg: 'No results found!',
            });
          }
        })
        .on('error', (err: Error) => {
          console.error(err);
          // res.status(500).json({ error: 'Internal server error!' });
          // setResponseStatus(event, 500);
          // send(event, { error:  });
          reject({
            code: 404,
            msg: 'Internal server error!',
          });
        });
    } catch (err) {
      console.error(err);
      reject({
        code: 404,
        msg: 'Internal server error!',
      });
    }
  });
}
