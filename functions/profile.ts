// /functions/profile.ts
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const email = url.searchParams.get('email');

  // Validasi parameter
  if (!userId || !email) {
    return new Response('Missing parameters', { status: 400 });
  }

  const html = generateProfilePage(userId, email);
  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

function generateProfilePage(userId: string, email: string): string {
  const username = email.split('@')[0];
  const lastRoom = '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>READTalk - Buat Room</title>
  <link rel="stylesheet" href="/App.css">
  <link rel="stylesheet" href="/index.css">
</head>
<body>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
      <h1 class="text-red-600 text-4xl font-bold mb-2">READTalk</h1>
      <h2 class="text-gray-700 text-lg mb-8">Welcome to READTalk</h2>
      
      <input 
        type="text" 
        id="roomName" 
        placeholder="Room Name..." 
        maxlength="14" 
        class="w-full px-4 py-3 border-2 border-gray-200 rounded-full text-lg mb-4 focus:border-red-500 focus:outline-none"
        autofocus
      >
      
      <button 
        id="createBtn" 
        class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full text-lg transition-colors mb-2"
      >
        Public Room
      </button>
      
      <div class="text-gray-500 my-4">or</div>
      
      <button 
        id="privateBtn" 
        class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full text-lg transition-colors"
      >
        Private Room
      </button>
      
      <div id="lastRoomInfo" class="mt-4 text-gray-600"></div>
    </div>
  </div>

  <script>
    const userId = "${userId}";
    const email = "${email}";
    const username = "${username}";
    const savedRoom = localStorage.getItem('lastRoom');

    if (savedRoom) {
      document.getElementById('lastRoomInfo').innerHTML = \`Room terakhir: <strong>\${savedRoom}</strong> <button onclick="useLastRoom()" class="text-red-600 hover:text-red-800 ml-2">Pakai</button>\`;
    }

    document.getElementById('createBtn').onclick = () => {
      const roomName = document.getElementById('roomName').value.trim();
      if (!roomName) return;
      
      localStorage.setItem('lastRoom', roomName);
      window.location.href = \`/chat?userId=\${userId}&email=\${email}&room=\${encodeURIComponent(roomName)}\`;
    };

    document.getElementById('privateBtn').onclick = async () => {
      try {
        const response = await fetch('https://account.soeparnocorp.workers.dev/api/room', { 
          method: 'POST' 
        });
        const roomId = await response.text();
        localStorage.setItem('lastRoom', roomId);
        window.location.href = \`/chat?userId=\${userId}&email=\${email}&room=\${encodeURIComponent(roomId)}\`;
      } catch (err) {
        alert('Gagal membuat private room');
      }
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
