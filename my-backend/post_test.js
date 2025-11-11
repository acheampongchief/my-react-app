import fs from 'fs';
import http from 'http';

(async () => {
  try {
    const filePath = 'test-image.png';
    const fileBuffer = await fs.promises.readFile(filePath);

    const boundary = '----NodeMultipartBoundary' + Math.random().toString(16).slice(2);
    const pre = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="${filePath}"\r\nContent-Type: image/png\r\n\r\n`);
    const post = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([pre, fileBuffer, post]);

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/analyze-photo',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': body.length,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        console.log('STATUS', res.statusCode);
        console.log('RESPONSE', data);
      });
    });

    req.on('error', (err) => {
      console.error('Request error', err);
    });

    req.write(body);
    req.end();
  } catch (err) {
    console.error('Error preparing request:', err);
  }
})();
