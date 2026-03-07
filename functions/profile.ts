// /functions/profile.ts
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const email = url.searchParams.get('email');

  // Validasi parameter
  if (!userId || !email) {
    // Alihkan ke halaman utama atau tampilkan error
    return new Response('Missing parameters', { status: 400 });
  }

  // Simpan sementara di cookie atau langsung render HTML
  // Opsi 1: Redirect ke versi SPA dengan parameter (jika pakai React Router)
  // return new Response(null, {
  //   status: 302,
  //   headers: { 'Location': `/?userId=${userId}&email=${email}` }
  // });

  // Opsi 2: Render HTML langsung dari Function (lebih sederhana)
  const html = generateProfilePage(userId, email);
  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

function generateProfilePage(userId: string, email: string): string {
  // Nama pengguna bisa diambil dari email atau KV nantinya
  const username = email.split('@')[0];
  const lastRoom = ''; // Bisa diambil dari cookie atau localStorage nanti

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>READTalk - Buat Room</title>
  <style>
    body { margin: 0; font-family: sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); width: 90%; max-width: 400px; text-align: center; }
    h1 { color: #ff0000; margin-bottom: 10px; }
    h2 { color: #333; font-weight: 400; margin-bottom: 30px; font-size: 18px; }
    input { width: 100%; padding: 15px; margin-bottom: 20px; border: 2px solid #e0e0e0; border-radius: 30px; font-size: 16px; box-sizing: border-box; }
    button { width: 100%; padding: 15px; background: #ff0000; color: white; border: none; border-radius: 30px; font-size: 16px; font-weight: 600; cursor: pointer; }
    .last-room { margin-top: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>READTalk</h1>
    <h2>Buat Room Baru</h2>
    <input type="text" id="roomName" placeholder="Nama room..." maxlength="14" autofocus>
    <button id="createBtn">✨ Buat Room</button>
    <div class="last-room" id="lastRoomInfo"></div>
  </div>

  <script>
    const userId = "${userId}";
    const email = "${email}";
    const username = "${username}";
    const savedRoom = localStorage.getItem('lastRoom');

    if (savedRoom) {
      document.getElementById('lastRoomInfo').innerHTML = \`Room terakhir: <strong>\${savedRoom}</strong> <button onclick="useLastRoom()">Pakai</button>\`;
    }

    document.getElementById('createBtn').onclick = () => {
      const roomName = document.getElementById('roomName').value.trim();
      if (!roomName) return;
      
      localStorage.setItem('lastRoom', roomName);
      
      // Arahkan ke halaman chat (iframe)
      window.location.href = \`/chat?userId=\${userId}&email=\${email}&room=\${encodeURIComponent(roomName)}\`;
    };

    window.useLastRoom = () => {
      const room = savedRoom;
      if (room) {
        window.location.href = \`/chat?userId=\${userId}&email=\${email}&room=\${encodeURIComponent(room)}\`;
      }
    };
  </script>
</body>
</html>
  `;
}
