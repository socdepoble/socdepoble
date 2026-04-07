import DOMPurify from 'dompurify';

export const sanitizeHtml = (html) => {
    if (!html || typeof html !== 'string') return '';
    
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'h1','h2','h3','h4','h5','p','b','i','strong','em','u',
            'ul','ol','li','br','hr','a','span','div','img','blockquote','section','article','main'
        ],
        ALLOWED_ATTR: ['href','title','target','src','alt','class','id','style','width','height','loading'],
        KEEP_CONTENT: true,
        ALLOW_DATA_ATTR: false,
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
        // Evita que el parser natiu del navegador talli per nesting invàlid
        FORCE_BODY: true,
        // Relaxa el sanititzador de CSS només per propietats segures
        ALLOWED_CSS_PROPERTIES: ['color','background','background-color','border','border-radius',
            'padding','margin','font-size','font-weight','text-align','display','flex','gap',
            'align-items','justify-content','box-shadow','width','height','max-width','opacity','line-height']
    });
};
