const Srf = require('drachtio-srf');
const srf = new Srf();
const {parseUri} = Srf;
const regParser = require('drachtio-mw-registration-parser') ;
const logger = require('pino')({level: 'info'});

srf.connect({
  host: process.env.DRACHTIO_HOST || '127.0.0.1',
  port: process.env.DRACHTIO_PORT || 9022,
  secret: process.env.DRACHTIO_SECRET || 'cymru'
});
srf.on('connect', (err, hp) => {
  if (err) logger.info({err}, 'Error connecting to drachtio server');
  logger.info(`successfully connected to drachtio listening on ${hp}`);
});
srf.on('error', (err) => logger.error(err));

srf.use('register', [regParser]);
srf.register((req, res) => {
  if ('register' === req.registration.type) {
    const registration = req.registration;
    let expires = req.registration.expires;
    let contactHdr = req.get('Contact');
    res.send(200, {
      headers: {
        'Contact': contactHdr,
        'Expires': expires
      }
    });
  }
  else {
    res.send(200, {
      headers: {
        'Contact': req.get('Contact'),
        'Expires': 0
      }
    });
  }
});
