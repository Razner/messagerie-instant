import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const mockChannels = [];
let nextChannelId = 1;

function logRequest(req, message) {
  console.log(`[${req.method}] ${req.url} - ${message}`);
}

// Fonction helper pour la gestion des requêtes avec body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        if (body) {
          resolve(JSON.parse(body));
        } else {
          resolve({});
        }
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    {
      name: 'mock-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url.includes('/protected/')) {
            logRequest(req, 'Requête API reçue');
          }

          if (req.url === '/protected/channels' && req.method === 'GET') {
            logRequest(req, `Renvoi de ${mockChannels.length} channels`);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(mockChannels.map(channel => ({
              ...channel,
              imageUrl: channel.imageUrl || null
            }))));
            return;
          }

          if (req.url === '/protected/channel' && req.method === 'POST') {
            logRequest(req, 'Création d\'un nouveau channel');

            try {
              const channelData = await parseBody(req);

              const newChannel = {
                id: nextChannelId++,
                name: channelData.name,
                description: channelData.description || '',
                isPrivate: channelData.isPrivate || false,
                createdAt: new Date().toISOString(),
                imageUrl: null
              };

              mockChannels.push(newChannel);
              logRequest(req, `Channel créé avec ID: ${newChannel.id}`);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(newChannel));
            } catch (error) {
              logRequest(req, `Erreur: ${error.message}`);
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid request data' }));
            }
            return;
          }

          const deleteMatch = req.url.match(/^\/protected\/channel\/(\d+)$/);
          if (deleteMatch && req.method === 'DELETE') {
            const channelId = parseInt(deleteMatch[1]);
            logRequest(req, `Tentative de suppression du channel ID: ${channelId}`);

            const index = mockChannels.findIndex(channel => channel.id === channelId);

            if (index === -1) {
              logRequest(req, `Erreur: Channel ID ${channelId} non trouvé`);
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Channel not found' }));
              return;
            }

            const deletedChannel = mockChannels[index];
            mockChannels.splice(index, 1);

            logRequest(req, `Channel ID ${channelId} supprimé avec succès`);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              message: 'Channel deleted successfully',
              deletedChannel
            }));
            return;
          }

          const updateMatch = req.url.match(/^\/protected\/channel\/(\d+)\/update_metadata$/);
          if (updateMatch && req.method === 'PUT') {
            const channelId = parseInt(updateMatch[1]);
            logRequest(req, `Tentative de mise à jour des métadonnées du channel ID: ${channelId}`);

            const index = mockChannels.findIndex(channel => channel.id === channelId);

            if (index === -1) {
              logRequest(req, `Erreur: Channel ID ${channelId} non trouvé`);
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Channel not found' }));
              return;
            }

            try {
              const metadata = await parseBody(req);
              logRequest(req, `Données reçues: ${JSON.stringify(metadata)}`);

              if (metadata.name) {
                mockChannels[index].name = metadata.name;
              }

              if (Object.prototype.hasOwnProperty.call(metadata, 'description')) {
                mockChannels[index].description = metadata.description;
              }

              if (Object.prototype.hasOwnProperty.call(metadata, 'image')) {
                if (metadata.image === null) {
                  mockChannels[index].imageUrl = null;
                  logRequest(req, `Image supprimée pour le channel ID: ${channelId}`);
                } else if (metadata.image === true) {
                  mockChannels[index].imageUrl = `https://picsum.photos/200/200?random=${Date.now()}`;
                  logRequest(req, `Nouvelle image attribuée au channel ID: ${channelId}`);
                }
              }

              logRequest(req, `Channel ID ${channelId} mis à jour avec succès`);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(mockChannels[index]));
            } catch (error) {
              logRequest(req, `Erreur lors de la mise à jour: ${error.message}`);
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid metadata format' }));
            }
            return;
          }

          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  }
})
