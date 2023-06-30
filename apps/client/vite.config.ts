import { extendBaseConfig } from '../../vite.config';

export default extendBaseConfig('client', __dirname);

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     tsconfigPaths({
//       loose: true,
//     }),
//     createHtmlPlugin({
//       minify: false,
//       inject: {
//         data: {
//           mode:
//             process.env.IONIC_MODE === undefined
//               ? ''
//               : `mode=${process.env.IONIC_MODE}`,
//         },
//       },
//     }),
//   ],
//   root: __dirname,
//   base: './',
//   build: {
//     outDir: '../../dist/apps/client/web',
//     emptyOutDir: true,
//   },
//   // resolve: {
//   //   alias: Object.entries(baseTsConfig.compilerOptions.paths).reduce(
//   //     (acc, [key, paths]) => ({
//   //       ...acc,
//   //       [key]: (paths as string[]).map((path) => join(appRootPath, path)),
//   //     }),
//   //     {}
//   //   ),
//   // },
// });
