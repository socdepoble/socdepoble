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
                    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Noto+Sans+Condensed:wght@100..900&family=Noto+Sans+Mono:wght@100..900&display=swap');
                    
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body { 
                        margin: 0;
                        padding: 0;
                        background: #fdfcf9;
                        color: #0c0c0c;
                        font-family: 'Noto Sans', sans-serif;
                        -webkit-print-color-adjust: exact;
                    }
                    .sheet {
                        width: 210mm;
                        height: 297mm;
                        padding: 20mm 20mm 19mm 20mm;
                        box-sizing: border-box;
                        position: relative;
                        background: #fdfcf9;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                        page-break-after: always;
                    }
                    .infography-cover {
                        width: 160mm;
                        height: 160mm;
                        object-fit: cover;
                        margin: 0 auto 10mm auto;
                        box-shadow: 0 5mm 15mm rgba(0,0,0,0.1);
                    }
                    .page-header {
                        position: absolute;
                        top: 10mm;
                        left: 20mm;
                        right: 20mm;
                        display: flex;
                        justify-content: space-between;
                        font-size: 8pt;
                        font-weight: 700;
                        color: #999;
                        text-transform: uppercase;
                    }
                    h1 { 
                        font-family: 'Noto Sans', sans-serif;
                        font-weight: 900;
                        font-size: 32pt;
                        color: #FF6D23; 
                        margin: 0;
                        text-transform: uppercase;
                        text-align: center;
                    }
                    .content-dual {
                        column-count: 2;
                        column-gap: 10mm;
                        font-family: 'Noto Sans Condensed', sans-serif;
                        font-size: 14pt; /* 14pt reals bategats per al Mestre */
                        line-height: 1.5;
                        text-align: justify;
                        color: #111;
                        flex: 1;
                        margin-top: 10mm;
                    }
                    h2 { 
                        column-span: all;
                        font-weight: 800;
                        font-size: 14pt;
                        margin-top: 8mm; 
                        color: #111; 
                        border-bottom: 0.5pt solid #eee; 
                    }
                    .footer {
                        margin-top: auto;
                        padding-top: 5mm;
                        border-top: 0.5pt solid #eee;
                        display: flex;
                        justify-content: space-between;
                        font-size: 8pt;
                        color: #999;
                    }
                    .subtitol-pdf {
                        column-span: all;
                        color: #FF6D23;
                        font-weight: 900;
                        font-size: 16pt;
                        text-align: center;
                        margin: 15mm 0 10mm 0;
                        padding: 5mm 0;
                        border-top: 2pt solid #FF6D23;
                        border-bottom: 2pt solid #FF6D23;
                        text-transform: uppercase;
                    }
                    .document-header-meta {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 0.5pt solid #eee;
                        padding-bottom: 5mm;
                        margin-bottom: 10mm;
                    }
                </style>
            </head>
            <body>
                <div class="sheet">
                    <div class="page-header">
                        <span>${new Date().toLocaleDateString('ca-ES')}</span>
                        <span>PÀGINA 1 DE 2</span>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                        <img src="/images/dossiers/infografia_kit_digital.png" class="infography-cover">
                        <h1>${userName}</h1>
                        <p style="text-align: center; font-weight: 800; letter-spacing: 0.2em; color: #666; margin-top: 5mm;">DOSSIER DE SOBIRANIA I TRELLAT</p>
                    </div>
                </div>

                <div class="sheet">
                    <div class="page-header">
                        <img src="/assets/master/logo_socdepoble_black_sketch.png" style="height: 15pt;">
                        <span>PÀGINA 2 DE 2</span>
                    </div>
                    <div class="content-dual">

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
                    </div>
                    <div class="footer" style="flex-direction: column; gap: 2mm; height: auto; padding: 5mm 0;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 4mm;">
                            <img src="/assets/master/logo_socdepoble_black_sketch.png" style="height: 12pt;">
                            <span style="font-weight: 800; font-size: 10pt; color: #000;">socdepoble.org</span>
                        </div>
                        <div style="font-size: 8pt; color: #999; text-transform: uppercase; letter-spacing: 0.1em;">
                            Llegibilitat Sant Grial v3 | SÓC DE POBLE
                        </div>
                    </div>
                </div>
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
     * Descarregar una nota individual en TXT
     */
    downloadNoteAsTXT(note) {
        let content = `${note.title.toUpperCase()}\n`;
        content += `Data: ${new Date(note.updatedAt).toLocaleString()}\n`;
        content += `Categoria: ${note.category || 'General'}\n`;
        content += `==========================================\n\n`;
        
        // Strip HTML for TXT
        const temp = document.createElement('div');
        temp.innerHTML = note.content;
        content += temp.textContent || temp.innerText || "";

        this._downloadFile(content, `${note.title.replace(/\s/g, '_')}.txt`, 'text/plain');
    },

    /**
     * Descarregar una nota individual en PDF (Print)
     * [MASTER FIX v10.33.3] Definició correcta de variables per a evitar ReferenceError
     */
    downloadNoteAsPDF(note) {
        if (!note) return;
        const title = note.title || 'Nova Nota';
        const content = note.content || '';
        const dateStr = note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : new Date().toLocaleDateString();

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('El bloquejador de popups ha impedit l\'exportació. Permet els popups per a Sóc de Poble.');
            return;
        }

        let html = `
            <!DOCTYPE html>
            <html lang="ca">
            <head>
                <meta charset="UTF-8">
                <title>${title}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700;900&display=swap');
                    
                    @page {
                        size: A4;
                        margin: 20mm;
                    }

                    :root {
                        --print-bg: #fdfcf9;
                        --sheet-shadow: 0 10px 30px rgba(0,0,0,0.15);
                    }

                    body { 
                        font-family: 'Roboto Condensed', sans-serif; 
                        padding: 0; 
                        margin: 0;
                        line-height: 1.6;
                        color: #1a1a1a;
                        background: #333; /* Dark background for preview to contrast the sheet */
                        counter-reset: page;
                        display: flex;
                        justify-content: center;
                        align-items: flex-start;
                        min-height: 100vh;
                        overflow-y: auto;
                        padding: 40px 0;
                    }

                    /* The physical sheet effect in screen */
                    .page-container {
                        position: relative;
                        width: 210mm;
                        min-height: 297mm;
                        margin: 0 auto;
                        background: white;
                        padding: 20mm;
                        box-shadow: var(--sheet-shadow);
                        box-sizing: border-box;
                    }

                    .header { 
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 3px solid #f97316; /* Orange Archon */
                        margin-bottom: 30px; 
                        padding-bottom: 10px;
                    }

                    .logo-placeholder {
                        font-weight: 900;
                        font-size: 14pt;
                        text-transform: uppercase;
                        letter-spacing: 0.1em;
                        color: #1a1a1a;
                    }

                    h1 { 
                        margin: 20px 0; 
                        text-transform: uppercase; 
                        font-weight: 900;
                        letter-spacing: -0.02em; 
                        font-size: 32pt; 
                        line-height: 1.1;
                        color: #000;
                    }

                    .meta-info {
                        display: flex;
                        gap: 20px;
                        font-size: 10pt;
                        font-weight: 700;
                        text-transform: uppercase;
                        color: #666;
                        margin-bottom: 40px;
                    }

                    .content { 
                        font-size: 14pt; 
                        white-space: pre-wrap; 
                        text-align: justify;
                    }

                    /* Pagination logic for print */
                    .footer-print {
                        position: absolute;
                        bottom: 10mm;
                        left: 20mm;
                        right: 20mm;
                        display: none;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 8pt;
                        color: #999;
                        border-top: 1px solid #eee;
                        padding-top: 5mm;
                    }

                    @media print {
                        body { 
                            background: white; 
                            padding: 0;
                            display: block;
                        }
                        .page-container {
                            width: 100%;
                            min-height: auto;
                            box-shadow: none;
                            margin: 0;
                            padding: 0;
                        }
                        .footer-print { display: flex; }
                        .no-print { display: none; }
                        
                        .page-number::after {
                            content: "PÀGINA " counter(page);
                            counter-increment: page;
                        }
                    }

                    /* Rich Text Overrides */
                    .content h2 { color: #f97316; border-bottom: 1px solid #fed7aa; padding-bottom: 5px; margin-top: 30px; }
                    .content ul { padding-left: 20px; }
                    .content li { margin-bottom: 8px; }
                    .content blockquote { border-left: 4px solid #f97316; padding-left: 15px; font-style: italic; color: #444; }
                </style>
            </head>
            <body>
                <div class="page-container">
                    <div class="header">
                        <div class="logo-placeholder">SÓC DE POBLE</div>
                        <div class="logo-placeholder no-print" style="font-size: 8pt; color: #f97316;">VISTA PREVIA D'IMPRESSIÓ</div>
                    </div>

                    <h1>${title}</h1>

                    <div class="meta-info">
                        <span>DATA: ${dateStr}</span>
                        <span>FORMAT: DOCUMENT D'ARCHON</span>
                    </div>

                    <div class="content">${content}</div>

                    <div class="footer-print">
                        <span>Generat pel Quadern de Trellat - socdepoble.org</span>
                        <span class="page-number"></span>
                    </div>
                </div>

                <div class="no-print" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
                    <button onclick="window.print()" style="background: #f97316; color: white; border: none; padding: 12px 24px; border-radius: 30px; cursor: pointer; font-weight: 900; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4); font-family: 'Roboto Condensed', sans-serif;">IMPRIMIR ARA</button>
                </div>

                <script>
                    // Wait for any images or fonts
                    window.onload = () => {
                        // We don't auto-print immediately to allow the user to see the preview
                        // or provide a smoother experience if they have slow connections.
                        setTimeout(() => {
                            console.log('Document ready for print');
                        }, 500);
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
