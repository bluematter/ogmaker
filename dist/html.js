"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ title, video }) => {
    return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <script>
        </script>
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          html {
            background: transparent;
          }

          body {
            width: 1200px;
            height: 630px;
            overflow: hidden;
            border-radius: 23px;
          }

          .gradient {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.8;
            background-image: url(https://motionbox-public.b-cdn.net/images/og_maker/Gradient.png);
          }

          h1 {
            position: relative;
            font-family: 'Codec Cold', sans-serif;
            font-weight: 800;
            font-size: 64px;
            max-width: 915px;
          }

          video {
            max-width: 100%;
            position: absolute;
            inset: 0;
            transform: translateY(-50%);
            top: 50%;
          }

          #root {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-family: sans-serif;
            text-transform: uppercase;
            border: 23px solid #fff;
            position: relative;
            overflow: hidden;
            border-radius: 23px;
          }

          @font-face {
            font-family: 'Codec Cold';
            src: url('https://motionbox-public.b-cdn.net/fonts/CodecCold/Codec-Cold-ExtraBold.woff2') format('woff2');
            font-weight: 800;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Codec Cold';
            src: url('https://motionbox-public.b-cdn.net/fonts/CodecCold/Codec-Cold-Bold.woff2') format('woff2');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Codec Cold';
            src: url('https://motionbox-public.b-cdn.net/fonts/CodecCold/Codec-Cold-Regular.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Codec Cold OG';
            src: url('https://motionbox-public.b-cdn.net/fonts/CodecCold/Codec-Cold-Bold.woff2') format('woff');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
        </style>
      </head>
      <body>
        <div id="root">
          <video id="main-video" src="${video}" autoplay="false" loop="true" muted="true" playsinline="false"></video>
          <div class="gradient"></div>
          <h1>${title ? title : "No title provided"}</h1>
        </div>
        ${video
        ? `
              <script>
                const onReady = async () => {
                  const video = document.getElementById('main-video');

                  video.addEventListener('loadeddata', () => {
                    // Ready begin rendering
                    const div = document.createElement('div')
                    div.className = 'ready'
                    document.body.appendChild(div)
                  })
                };
                document.addEventListener("DOMContentLoaded", onReady);
              </script>
              `
        : `
              <script>
                const onReady = async () => {
                  // Ready begin rendering
                  const div = document.createElement('div')
                  div.className = 'ready'
                  document.body.appendChild(div)
                };
                document.addEventListener("DOMContentLoaded", onReady);
              </script>
            `}
      </body>
    </html>
  `;
};
