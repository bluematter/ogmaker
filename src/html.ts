interface IHTML {}

export default ({}: IHTML) => {
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
          #root {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
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
