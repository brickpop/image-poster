import config from '../../config/server';
import express from 'express';
import cookieParser from 'cookie-parser';

import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router'
import { renderToString } from 'react-dom/server';
import App from './app.jsx';

import { decodeAuth } from '../../lib/session';
import { makeInitialStore, dehydrate } from './store/server';

const router = express.Router();

// API
router.use(cookieParser()); // The API router and the initial render need them

// RENDER THE MAIN PAGE
router.use(decodeAuth, async (req, res) => {
	// req.user is set in decodeAuth
	try {
    const context = {};
		const store = await makeInitialStore({
			user: req.user
		});
    const markup = renderToString(
      <Provider store={ store }>
        <StaticRouter location={req.url} context={context}>
          <App/>
        </StaticRouter>
      </Provider>
    );

    if(context.url){
      return res.redirect(302, context.url);
    }
    else if(!markup){
      return res.status(404).send('');
    }
    else {
      const initialState = dehydrate(store);
      if(context.status)
        return res.status(context.status).send(renderPage(markup, initialState));
      else
        return res.send(renderPage(markup, initialState));
    }
	}
	catch(err){
		console.error("SERVER RENDER ERROR:", err);
		res.status(500).send(err.message);
	}
});


// HELPER FUNCTIONS

function renderPage(markup, initialState) {
  if(config.DEBUG){
    // DEBUG: The bundle is served separately
    //        The initial FOUC is hidden
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no">

          <title>${config.HTML_TITLE}</title>
          <style>
          .skip-fouc {
            opacity: 0;
          }
          </style>
          <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>

          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
          </script>
        </head>
        <body>
          <div id="root" class="skip-fouc">${markup}</div>
          <script src="/web.bundle.js"></script>
          <script>
            document.getElementById('root').className = "";
          </script>
        </body>
      </html>
    `;
  }
  else {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no">
          <title>${config.HTML_TITLE}</title>

          <meta name="keywords" content="${config.KEYWORDS}"/>
          <meta name="description" content="${config.DESCRIPTION}"/>
          <meta property="og:description" content="${config.DESCRIPTION}"/>
          <meta property="og:image" content="${config.SOCIAL_IMAGE}"/>
          <meta property="article:publisher" content="${config.SOCIAL_URL_PUBLISHER}"/>
          <meta property="og:url" content="${config.SOCIAL_URL}"/>

          <link rel="icon" href="/media/image-poster.png" type="image/png" sizes="120x120"/>
          <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
          <link rel="stylesheet" type="text/css" href="/web.min.css"/>

          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
          </script>
        </head>
        <body>
          <div id="root">${markup}</div>
          <script async src="/web.bundle.js"></script>
        </body>
      </html>
    `;
  }
}

module.exports = router;
