import * as fs from 'node:fs';
import * as uuid from 'uuid';
import csv from 'csv-parser';
import { createRouter, defineEventHandler, useBase } from 'h3';
import * as path from 'node:path';
import { tryit } from 'radash';
import { useSupabase } from '@code2/supabase';

// class SupabaseService {
//   private static instance: any;
//   private static options = {}; // TODO Make this a parameter of getInstance and recreate client if new ones differ from actual

//   private static create(supabaseUrl: string, supabaseKey: string) {
//     const client = createClient(supabaseUrl, supabaseKey, {
//       auth: { persistSession: false },
//     });
//     return client;
//   }

//   public static getInstance() {
//     if (!SupabaseService.instance) {
//       // FIXME Move to env or something, maybe use nx to crete the a env project somewhere and import it
//       SupabaseService.instance = SupabaseService.create(
//         'https://wdnhocgzsoziljwnvvbo.supabase.co',
//         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbmhvY2d6c296aWxqd252dmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQyODYzMjEsImV4cCI6MTk3OTg2MjMyMX0.G_bwQSuNMjgTWmex3RoIJysEmZ1w00H7AAXTIyTvPlM'
//       );
//     }

//     return SupabaseService.instance;
//   }
// }
// const useSupabase = () => SupabaseService.getInstance();

const MICROCURSOS_DOS_DIAS = [
  'Investigación Traslacional y Terapias Avanzadas en Dermatología: de la investigación básica a la clínica',
  'Estudio de las enfermedades genéticas humanas: análisis molecular mediante el uso de herramientas online',
  'Uso de parámetros usados actualmente en la Antropología Física y Forense. Identificación de restos óseos, patologías y traumatismos',
  'Diseño digital e Impresión 3D para el desarrollo de dispositivos personalizados en biomedicina',
  'Técnicas de (Bio)Impresión 3D y desarrollo de biotintas para aplicación en biomedicina',
  'Difracción de rayos X. Identificación de fases sólidas en muestras mono y polifásicas. Informaciones complementarias que ofrece la técnica',
  'Bases moleculares de la nutrición personalizada: Nutrigenómica',
  'HANDS-ON! Aprende las diferencias técnicas para el análisis de la microbiota intestinal con ejemplos prácticos',
];
const microRegEx = /^Microcurso "([\w\sáóéíú:(),¿?.ñ¡!\-\/“”–]+)"$/m;

const supabase = useSupabase();

function findNifMailMatch(
  csvPath: string,
  nif: string,
  email: string,
): Promise<[string, boolean] | null> {
  return new Promise((resolve, reject) =>
    fs
      .createReadStream(csvPath)
      .pipe(csv())
      .on(
        'data',
        (row: {
          id: string;
          email: string;
          nif: string;
          modalidad:
            | 'Online'
            | 'Presencial'
            | 'Organizador'
            | 'Gratis'
            | 'Voluntario';
        }) => {
          if (
            row.email.trim().toLowerCase() === email &&
            row.nif.trim().toUpperCase() === nif
          ) {
            resolve([row.id, row.modalidad.trim() === 'Online']);
          }
        },
      )
      .on('error', (err: unknown) => {
        console.error(err);
        reject(err);
      })
      .on('end', () => resolve(null)),
  );
}

function isIDOnline(id: string) {
  return new Promise((resolve, reject) =>
    fs
      .createReadStream('./private/users-data.csv')
      .pipe(csv())
      .on(
        'data',
        (row: {
          id: string;
          modalidad:
            | 'Online'
            | 'Presencial'
            | 'Organizador'
            | 'Gratis'
            | 'Voluntario';
        }) => {
          if (row.id.trim().toLowerCase() === id) {
            resolve(row.modalidad.trim() === 'Online');
          }
        },
      )
      .on('error', (err) => {
        console.error(err);
        reject(err);
      })
      .on('end', () => resolve(null)),
  );
}

async function checkAttendance(id: string) {
  const { data: fileURL } = await supabase.storage
    .from('config')
    .getPublicUrl('attendance.json');

  const res = await fetch(fileURL.publicUrl);
  const attendanceSchema: Array<any> = await res.json();

  const { data, error } = await supabase
    .from('attendance')
    .select('attendant_id,session,id')
    .eq('attendant_id', id);

  if (error) {
    console.error(
      `Something went wrong while trying to check attendance for id: ${id}`,
    );
    return null;
  }

  if (data) {
    const asistencia = Math.round(
      (Math.min(
        25,
        data
          .map((att) => ({
            hours: attendanceSchema.find(
              (schema) => schema.name === att.session,
            )?.hours,
          }))
          .reduce((acc, curr) => acc + curr.hours, 0),
      ) /
        25) *
        100,
    );
    return isNaN(asistencia) ? 0 : asistencia;
  }
  return null;
}

async function checkMicro(id: string) {
  const { data: fileURL } = await supabase.storage
    .from('config')
    .getPublicUrl('attendance.json');

  const res = await fetch(fileURL.publicUrl);
  const attendanceSchema: Array<any> = await res.json();

  const { data, error } = await supabase
    .from('attendance')
    .select('attendant_id,session,id,event')
    .eq('attendant_id', id);

  if (error) {
    console.error(
      `Something went wrong while trying to check attendance for id: ${id}`,
    );
    return null;
  }

  if (data) {
    const microcursos = data
      ?.map((att) =>
        att.event
          ? [att.event]
          : attendanceSchema.find((schema) => schema.name === att.session)
              ?.events,
      )
      .flat()
      .filter((ev) => microRegEx.test(ev ?? ''))
      .map((ev) => (microRegEx.exec(ev) ?? [, ''])[1] ?? ev)
      .map((ev, _, arr) => [
        ev,
        arr.filter((thisCourse) => thisCourse === ev).length,
      ])
      .filter(
        ([ev, times]) => !(MICROCURSOS_DOS_DIAS.includes(ev) && times !== 2),
      )
      .map(([ev]) => ev)
      .filter((ev, pos, self) => self.indexOf(ev) === pos);

    if (microcursos.length > 2) {
      console.error(
        `Found more than two microcourses for id "${id}": ${microcursos}`,
      );
      return null;
    } else {
      return microcursos;
    }
  }
  return null;
}

async function checkPoster(id: string) {
  return new Promise((resolve, reject) =>
    fs
      .createReadStream(`./private/certificado/poster/${id}.pdf`)
      .on('data', (row: Record<string, any>) => {
        resolve(true);
      })
      .on('error', (err: any) => {
        resolve(false);
      }),
  );
  /*
  const res = await fetch(`https://biociencias.es/wp-json/wp/v2/users?search=${email}`)
  const json = await res.json()
  console.log(`Cecked poster for email "${email}"`)
  if (json.length === 0) {
    console.error('Email not found')
    return null
  }
  else if (json.length === 1) {
    return json[0].acf.has_poster
  } else {
    console.error('Answer length is greater than one')
    return null
  }
*/
}

const router = createRouter();

router.get(
  '/certificado',
  defineEventHandler(async (event) => {
    const { privatePath } = useRuntimeConfig();

    setResponseHeader(event, 'Content-Type', 'application/json');
    setResponseHeader(event, 'Access-Control-Allow-Origin', '*');

    const query = getQuery(event);
    if (!query.nif || !query.email) {
      console.log('No identity document or email provided!');
      setResponseStatus(event, 400);
      return {
        error: 'Request must include an identity document and a email!',
      };
    }

    const nif = (query.nif as string).trim().toUpperCase();
    const email = (query.email as string).trim().toLowerCase();
    let id: string | null, isOnline: boolean;
    try {
      const res = (await findNifMailMatch(
        path.join(privatePath, 'users-data.csv'),
        nif,
        email,
      )) ?? [null, false];
      id = res[0];
      isOnline = res[1];
    } catch (e) {
      console.log(e);
      setResponseStatus(event, 500);
      return {
        error:
          'An error occurred when trying to match the identity document and email!',
      };
    }
    if (!id) {
      console.log('Identity document and email pair not found!');
      setResponseStatus(event, 500);
      return {
        error:
          'Identity document and email do not match or could not be found!',
      };
    }

    const asistencia = isOnline ? 100 : await checkAttendance(id);
    const microcursos = await checkMicro(id);
    const poster = await checkPoster(id);

    if (asistencia != null && microcursos != null && poster != null) {
      setResponseStatus(event, 200);
      return {
        id: id,
        asistencia: asistencia,
        microcursos: {
          doble:
            microcursos.length === 2
              ? true
              : microcursos.length === 1
                ? !MICROCURSOS_DOS_DIAS.includes(microcursos[0])
                : false,
          micro1: microcursos.length > 0 ? microcursos[0] : null,
          micro2: microcursos.length === 2 ? microcursos[1] : null,
        },
        poster: poster,
      };
    } else {
      setResponseStatus(event, 500);
      return {
        error: 'Something went wrong while trying to achieve user data',
      };
    }
  }),
);

router.get(
  '/certificado/**',
  defineEventHandler(async (event) => {
    console.log('GET /api/ceebi-ii/certificado/*', event.context.params);

    const { privatePath } = useRuntimeConfig(event);

    setHeader(event, 'Content-Type', 'application/json');
    setHeader(event, 'Access-Control-Allow-Origin', '*');

    const path = (event.context.params ?? { path: '' })._.split('/');
    if (path.at(-1) === '') path.pop(); // Remove last element if empty i.e. path ends with '/'
    if (path.length !== 2 && !(path.length === 3 && path[0] === 'microcurso')) {
      // Check if path is valid
      console.log('Wrong path!');
      setResponseStatus(event, 400);
      return { error: 'Wrong path!' };
    }

    const certType = path[0]; // The type of certificate 'asistencia', 'microcurso' or 'poster'
    const micro = path.length === 3 ? path[1] : null;
    const rawId = path.length === 3 ? path[2].split('.') : path[1].split('.'); // The id and the extension of the file

    let isIdValid = false; // Store if id is valid for later use
    if (rawId.length === 2 && rawId[1] === 'pdf' && uuid.validate(rawId[0])) {
      isIdValid = true;
    }

    if (certType === 'asistencia') {
      if (isIdValid) {
        const asistencia = (await isIDOnline(rawId[0]))
          ? 100
          : await checkAttendance(rawId[0]);
        if (asistencia === null) {
          setResponseStatus(event, 500);
          return {
            error:
              'Something went wrong while trying to achieve attendance data',
          };
        } else if (asistencia < 80) {
          setResponseStatus(event, 403);
          return { error: "User didn't reach minimun attendance" };
        }
        try {
          const [err, filestream] = (await tryit(promisifiedFileStream)(
            path.join(privatePath, 'certificado', certType, rawId.join('.')),
          )) as [unknown, unknown] as [unknown, fs.ReadStream];
          if (err) {
            console.error(
              `Certificate "${certType}/${rawId.join('.')}" not found!`,
              err,
            );
            setResponseStatus(event, 404);
            return { error: 'Could not find certificate file' };
          }
          setHeader(
            event,
            'Content-disposition',
            `attachment; filename=${rawId.join('.')}`,
          );
          setHeader(event, 'Content-type', 'application/pdf');
          sendStream(event, filestream);
        } catch (err) {
          // Return an internal server error if file is not found
          console.error(
            `Certificate "${certType}/${rawId.join('.')}"  not found!`,
          );
          setResponseStatus(event, 404);
          return { error: 'Could not find certificate file' };
        }
      } else {
        console.log('Invalid id!');
        setResponseStatus(event, 400);
        return { error: 'Wrong id or id extension in path!' };
      }
    } else if (certType === 'microcurso') {
      if (isIdValid) {
        const microcursos = ((await checkMicro(rawId[0])) ?? []).map((mic) =>
          mic.replace(/[áóéíú:(),¿?.ñ¡!\-\/“”– ]/g, '_'),
        );
        if (microcursos === null) {
          setResponseStatus(event, 500);
          return {
            error:
              'Something went wrong while trying to achieve microcourses data',
          };
        } else if (!microcursos.includes(micro)) {
          setResponseStatus(event, 403);
          return { error: "User didn't attend to this microcourse" };
        }
        try {
          const [err, filestream] = (await tryit(promisifiedFileStream)(
            path.join(
              privatePath,
              'certificado',
              certType,
              micro,
              rawId.join('.'),
            ),
          )) as [unknown, unknown] as [unknown, fs.ReadStream];
          if (err) {
            console.error(
              `Certificate "${certType}/${micro}/${rawId.join(
                '.',
              )}" not found!`,
            );
            setResponseStatus(event, 404);
            return { error: 'Could not find certificate file' };
          }
          setHeader(
            event,
            'Content-disposition',
            `attachment; filename=${rawId.join('.')}`,
          );
          setHeader(event, 'Content-type', 'application/pdf');
          sendStream(event, filestream);
        } catch (err) {
          // Return an internal server error if file is not found
          console.error(
            `Certificate "${certType}/${micro}/${rawId.join('.')}"  not found!`,
            err,
          );
          setResponseStatus(event, 404);
          return { error: 'Could not find certificate file' };
        }
      } else {
        console.log('Invalid id!');
        setResponseStatus(event, 400);
        return { error: 'Wrong id or id extension in path!' };
      }
    } else if (certType === 'poster') {
      if (isIdValid) {
        try {
          const [err, filestream] = (await tryit(promisifiedFileStream)(
            path.join(privatePath, 'certificado', certType, rawId.join('.')),
          )) as [unknown, unknown] as [unknown, fs.ReadStream];
          if (err) {
            console.error(
              `Certificate "${certType}/${rawId.join('.')}" not found!`,
              err,
            );
            setResponseStatus(event, 404);
            return { error: 'Could not find certificate file' };
          }

          setHeader(
            event,
            'Content-disposition',
            `attachment; filename=${rawId.join('.')}`,
          );
          setHeader(event, 'Content-type', 'application/pdf');
          sendStream(event, filestream);
        } catch (err) {
          // Return an internal server error if file is not found
          console.error(
            `Certificate "${certType}/${rawId.join('.')}"  not found!`,
          );
          setResponseStatus(event, 404);
          return { error: 'Could not find certificate file' };
        }
      } else {
        console.log('Invalid id!');
        setResponseStatus(event, 400);
        return { error: 'Wrong id or id extension in path!' };
      }
    } else {
      console.log('Wrong certificate type!');
      setResponseStatus(event, 400);
      return { error: 'Wrong certificate type in path!' };
    }
  }),
);

function promisifiedFileStream(filePath: string): Promise<fs.ReadStream> {
  return new Promise((resolve, reject) => {
    const filestream = fs.createReadStream(filePath);
    filestream.on('error', (err) => {
      reject(err);
    });
    filestream.on('open', () => {
      resolve(filestream);
    });
  });
}

export default useBase('/api/ceebi-ii', router.handler);
