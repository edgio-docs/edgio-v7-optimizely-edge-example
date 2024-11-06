// This file was automatically added by edgio init.
// You should commit this file to source control.
import { Router } from '@edgio/core/router';
import datafileHash from './lib/optimizely/datafile_hash.json';

export default new Router()
  // Invoke the Optimizely Edge Function for new users
  .match(
    {
      cookies: {
        [`optimizely_visitor_id_${datafileHash.hash}`]: /^$/,
      },
    },
    {
      edge_function: './edge-functions/main.js',
    }
  )

  .match('/:path*/:file.:ext(js|mjs|css)', {
    headers: {
      set_response_headers: {
        'cache-control': 'public, max-age=86400',
      },
      remove_origin_response_headers: ['set-cookie'],
    },
    caching: {
      ignore_origin_no_cache: [200],
      bypass_client_cache: true,
    },
    origin: {
      set_origin: 'wikipedia',
    },
  })

  // caching assets
  .match('/:path*/:file.:ext(png|ico|svg|jpg|jpeg|gif|ttf|woff|otf)', {
    headers: {
      set_response_headers: {
        'cache-control': 'public, max-age=86400',
      },
      remove_origin_response_headers: ['set-cookie'],
    },
    caching: {
      ignore_origin_no_cache: [200],
      bypass_client_cache: true,
    },
    origin: {
      set_origin: 'wikipedia',
    },
  });
