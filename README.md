# decompress.com.au

Mini site for Decompress.

### Prerequisites

 - [Node.js](http://nodejs.org)
 - [Bower](http://bower.io) and [Gulp](http://gulpjs.com): `$ npm install -g bower gulp`
 - Build/client dependencies: `$ npm install & bower install`

### Gulp Tasks

Build static assets to `public`:

```bash
$ gulp
```

Run local preview server:

```bash
$ gulp serve
```

Run local preview server with LiveReload:

```bash
$ gulp serve --dev
```

Deploy `public` directory to GitHub Pages:

```bash
$ gulp deploy
```

Download speaker avatars, assuming `data/twitter.json` contains your API access tokens:

```bash
$ gulp avatars
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
