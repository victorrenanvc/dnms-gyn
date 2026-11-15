// dnms.gyn: este arquivo roda no celular e mostra os lembretes, mesmo com o app fechado.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (ev) { ev.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (ev) {
  var d = {};
  try { d = ev.data ? ev.data.json() : {}; } catch (e) { try { d = { body: ev.data.text() }; } catch (e2) { d = {}; } }
  var opcoes = { body: d.body || 'Você tem um lembrete.', icon: 'icone-dnms-192.png', badge: 'icone-dnms-192.png', data: { url: d.url || './' } };
  if (d.tag) opcoes.tag = d.tag;
  ev.waitUntil(self.registration.showNotification(d.title || 'dnms.gyn', opcoes));
});

// Tocar no lembrete abre o app (ou volta para ele, se já estiver aberto).
self.addEventListener('notificationclick', function (ev) {
  ev.notification.close();
  var destino = new URL((ev.notification.data && ev.notification.data.url) || './', self.registration.scope).href;
  ev.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (abertas) {
    for (var i = 0; i < abertas.length; i++) { if ('focus' in abertas[i]) return abertas[i].focus(); }
    return self.clients.openWindow(destino);
  }));
});
