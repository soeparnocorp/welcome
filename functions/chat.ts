// /functions/chat.ts
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const email = url.searchParams.get('email');
  const roomName = url.searchParams.get('room');

  if (!userId || !email || !roomName) {
    return new Response('Missing parameters', { status: 400 });
  }

  const html = generateChatPage(userId, email, roomName);
  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

function generateChatPage(userId: string, email: string, roomName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>READTalk</title>
  <style>
    body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
    iframe { width: 100%; height: 100%; border: none; }
    .back-btn { position: fixed; top: 20px; left: 20px; z-index: 1000; padding: 8px 16px; background: #ff0000; color: white; border: none; border-radius: 20px; cursor: pointer; }
  </style>
</head>
<body>
  <iframe id="chatFrame" src="https://account.soeparnocorp.workers.dev?userId=${userId}&email=${email}"></iframe>
  <button class="back-btn" onclick="window.location.href='/profile?userId=${userId}&email=${email}'">← Ganti Room</button>

  <script>
    const iframe = document.getElementById('chatFrame');
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.postMessage({
          type: 'OPEN_ROOM',
          roomName: '${roomName}'
        }, 'https://account.soeparnocorp.workers.dev');
      }, 1500);
    };
  </script>
</body>
</html>
  `;
}
