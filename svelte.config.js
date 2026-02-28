import adapter from '@sveltejs/adapter-static';
import path from 'path';
import { sveltePreprocess } from 'svelte-preprocess';


const assetsFolder = "src/assets"

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sveltePreprocess({
  	}),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		alias: {
			$assets: `${assetsFolder}/*`,
			$images: `${assetsFolder}/images/*`,
			$components: `${assetsFolder}/components/*`
		}
	}
};

export default config;
