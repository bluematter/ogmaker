"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ title }) => {
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

          body {
            width: 1200px;
            height: 630px;
            overflow: hidden;
            background: #2362bd;
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
            border: 10px solid;
          }
        </style>
      </head>
      <body>
        <div id="root">
          <h1>${title ? title : "No title provided"}</h1>
        </div>
        <script>
          const onReady = async () => {
            // Ready begin rendering
            const div = document.createElement('div')
            div.className = 'ready'
            document.body.appendChild(div)
          };
          document.addEventListener("DOMContentLoaded", onReady);
        </script>
      </body>
    </html>
  `;
};
