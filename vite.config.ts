import { defineConfig, ConfigEnv, BuildOptions } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { codeHtmlPlugin } from "./src/plugins/codeHtmlPlugin";
import RollupPluginFontmin from '@higuaifan/rollup-plugin-fontmin';


export default defineConfig((configEnv: ConfigEnv) => {
  const { mode } = configEnv;
  let build: BuildOptions = {};
  if (mode === 'npm') {
    build = {
      lib: {
        name: 'wash-painting-ui',
        entry: 'lib/index.ts'
      },
      rollupOptions: {
        external: ['vue']
      }
    };
  } else {
    build = {
      rollupOptions: {
        plugins: [RollupPluginFontmin({
          fontSrc: 'dist/assets/*.ttf',
          fontDest: 'dist/assets',
        })]
      }
    }
  }
  return {
    build,
    server: { port: 8513 },
    plugins: [mode === 'server' ? codeHtmlPlugin : undefined, vue(), vueJsx()],
    test: {
      transformMode: {
        web: [/\.[jt]sx$/],
      },
      environment: 'jsdom'
    }
  }
})
