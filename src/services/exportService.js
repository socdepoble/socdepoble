import { supabaseService } from './supabaseService';
import { logger } from '../utils/logger';

export const exportService = {
    /**
     * Agregat de dades de l'usuari
     */
    async aggregateUserData(userId) {
        try {
            logger.log('[ExportService] Aggregating data for user:', userId);

            // 1. Posts
            const posts = await supabaseService.getPosts({ authorId: userId });

            // 2. Market Items
            const marketItems = await supabaseService.getMarketItems({ authorId: userId });

            // 3. Conversations and Messages
            const conversations = await supabaseService.getConversations(userId);
            const messagesByConversation = {};

            for (const conv of conversations) {
                const msgs = await supabaseService.getConversationMessages(conv.id);
                messagesByConversation[conv.id] = {
                    with: conv.p2_info?.name || 'Desconegut',
                    messages: msgs
                };
            }

            return {
                timestamp: new Date().toISOString(),
                posts: posts.data || [],
                marketItems: marketItems.data || [],
                chatHistory: messagesByConversation
            };
        } catch (error) {
            logger.error('[ExportService] Error aggregating data:', error);
            throw error;
        }
    },

    /**
     * Generar fitxer TXT
     */
    async downloadAsTXT(userId, userName) {
        const data = await this.aggregateUserData(userId);
        let content = `INFORME DE DADES - SÓC DE POBLE\n`;
        content += `Usuari: ${userName}\n`;
        content += `Data d'exportació: ${new Date().toLocaleString()}\n`;
        content += `==========================================\n\n`;

        content += `1. PUBLICACIONS (EL MUR)\n`;
        content += `------------------------\n`;
        data.posts.forEach((p, i) => {
            content += `[${i + 1}] Data: ${new Date(p.created_at).toLocaleString()}\n`;
            content += `Contingut: ${p.content}\n`;
            content += `Imatge: ${p.image_url || 'N/A'}\n`;
            content += `------------------------\n`;
        });

        content += `\n2. ARTICLES AL MERCAT\n`;
        content += `---------------------\n`;
        data.marketItems.forEach((item, i) => {
            content += `[${i + 1}] Títol: ${item.title}\n`;
            content += `Preu: ${item.price}\n`;
            content += `Descripció: ${item.description}\n`;
            content += `---------------------\n`;
        });

        content += `\n3. HISTORIAL DE MISSATGES (XAT)\n`;
        content += `------------------------------\n`;
        Object.values(data.chatHistory).forEach(chat => {
            content += `Conversa amb: ${chat.with}\n`;
            chat.messages.forEach(m => {
                const sender = m.sender_id === userId ? 'JO' : chat.with;
                content += `[${new Date(m.created_at).toLocaleTimeString()}] ${sender}: ${m.content}\n`;
            });
            content += `------------------------------\n`;
        });

        this._downloadFile(content, `SOC_DE_POBLE_DADES_${userName.replace(/\s/g, '_')}.txt`, 'text/plain');
    },

    /**
     * Generar Informe (Simulem PDF amb format HTML imprimible o jspdf si estiguera disponible)
     * Per ara preparem un format HTML net que l'usuari pot guardar com a PDF
     */
    async downloadAsPDF(userId, userName) {
        const data = await this.aggregateUserData(userId);

        // Creem una finestra temporal per imprimir
        const printWindow = window.open('', '_blank');
        let html = `
            <html>
            <head>
                <title>Informe Sóc de Poble - ${userName}</title>
                <style>
                    body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; }
                    h1 { color: #5D5FEF; border-bottom: 2px solid #5D5FEF; padding-bottom: 10px; }
                    h2 { margin-top: 30px; color: #E65100; border-bottom: 1px solid #eee; }
                    .meta { color: #666; font-size: 0.9em; margin-bottom: 30px; }
                    .item { margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 8px; }
                    .msg { margin-bottom: 5px; font-size: 0.9em; }
                    .me { font-weight: bold; color: #5D5FEF; }
                    .other { font-weight: bold; color: #666; }
                </style>
            </head>
            <body>
                <h1>Informe de Dades i Activitat</h1>
                <div class="meta">
                    <strong>Usuari:</strong> ${userName}<br>
                    <strong>Data de generació:</strong> ${new Date().toLocaleString()}
                </div>

                <h2>Publicacions al Mur</h2>
                ${data.posts.map(p => `
                    <div class="item">
                        <strong>${new Date(p.created_at).toLocaleDateString()}</strong><br>
                        ${p.content}
                    </div>
                `).join('')}

                <h2>Articles al Mercat</h2>
                ${data.marketItems.map(item => `
                    <div class="item">
                        <strong>${item.title}</strong> - ${item.price}<br>
                        ${item.description}
                    </div>
                `).join('')}

                <h2>Historial de Converses</h2>
                ${Object.values(data.chatHistory).map(chat => `
                    <div class="item">
                        <strong>Amb: ${chat.with}</strong><br><br>
                        ${chat.messages.map(m => `
                            <div class="msg">
                                <span class="${m.sender_id === userId ? 'me' : 'other'}">
                                    [${new Date(m.created_at).toLocaleTimeString()}] ${m.sender_id === userId ? 'Jo' : chat.with}:
                                </span>
                                ${m.content}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
                
                <script>
                    window.onload = function() {
                        window.print();
                        // window.close(); 
                    };
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    },

    /**
     * Helper per descarregar fitxer
     */
    _downloadFile(content, fileName, contentType) {
        const a = document.createElement('a');
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    }
};
