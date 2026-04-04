import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Node } from '@tiptap/core';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, List, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight, Undo, Redo, Image as ImageIcon, Link as LinkIcon, Save, MousePointerClick, CodeXml, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StarterKit from '@tiptap/starter-kit';

const RawHTMLNode = Node.create({
  name: 'rawHtml',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      html: {
        default: '',
        parseHTML: element => element.getAttribute('data-raw-html') || element.innerHTML,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div.custom-raw-html',
      },
    ]
  },

  renderHTML({ node }) {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-raw-html my-6';
    wrapper.setAttribute('data-raw-html', node.attrs.html);
    wrapper.innerHTML = node.attrs.html;
    return { dom: wrapper };
  },

  addNodeView() {
    return ({ node }) => {
      const container = document.createElement('div');
      container.className = 'custom-raw-html-editor my-6 bg-[var(--bg-panel-elevated)] border-2 border-dashed border-[var(--theme-accent-primary)] rounded-xl relative overflow-hidden group';
      
      const header = document.createElement('div');
      header.className = 'bg-[var(--bg-panel)] border-b border-dashed border-[var(--theme-accent-primary)] px-3 py-1 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity';
      
      const badge = document.createElement('span');
      badge.className = 'text-[var(--theme-accent-primary)] text-xs font-bold uppercase tracking-wider';
      badge.innerText = 'HTML Incrustat / Widget';
      header.appendChild(badge);
      
      container.appendChild(header);

      const content = document.createElement('div');
      content.className = 'p-4 overflow-x-auto';
      content.innerHTML = node.attrs.html;
      container.appendChild(content);

      return {
        dom: container,
      }
    }
  }
});

const CustomListItem = ListItem.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      isButton: {
        default: false,
        parseHTML: element => element.hasAttribute('data-button'),
        renderHTML: attributes => {
          if (!attributes.isButton) return {};
          return {
            'data-button': 'true',
            class: 'bullet-button',
          };
        },
      },
    };
  },
});

const ToolbarButton = ({ onClick, isActive, disabled, children, ariaLabel }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        type="button"
        title={ariaLabel}
        aria-label={ariaLabel}
        aria-pressed={isActive}
        className={`p-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent-primary)]
            ${isActive ? 'bg-[var(--theme-accent-primary)] text-white shadow-inner' : 'bg-transparent text-[var(--text-main)] hover:bg-[var(--bg-panel-elevated)] hover:text-[var(--theme-accent-primary)]'} 
            ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
        `}
    >
        {children}
    </button>
);

const MenuBar = ({ editor, onSave, isSaving, minimal = false, onOpenHtmlDialog }) => {
  const { t } = useTranslation();

  if (!editor) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-1 border-b border-[var(--border-master)] bg-[var(--bg-panel)] sticky top-0 z-10 w-full shadow-sm ${minimal ? 'p-1' : 'p-2'}`}>
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        ariaLabel="Desfer"
      >
        <Undo size={minimal ? 16 : 18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        ariaLabel="Refer"
      >
        <Redo size={minimal ? 16 : 18} />
      </ToolbarButton>

      <div className={`w-px ${minimal ? 'h-4' : 'h-6'} bg-[var(--border-master)] mx-1`}></div>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        ariaLabel="Negreta"
      >
        <Bold size={minimal ? 16 : 18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        ariaLabel="Cursiva"
      >
        <Italic size={minimal ? 16 : 18} />
      </ToolbarButton>
      {!minimal && (
          <>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                disabled={!editor.can().chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                ariaLabel="Subratllat"
            >
                <UnderlineIcon size={18} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                ariaLabel="Ratllat"
            >
                <Strikethrough size={18} />
            </ToolbarButton>
          </>
      )}

      <ToolbarButton
        onClick={() => {
            const previousUrl = editor.getAttributes('link').href;
            const url = window.prompt("URL d'enllaç:", previousUrl || '');
            
            if (url === null) {
              return;
            }

            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }

            const validUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
            editor.chain().focus().extendMarkRange('link').setLink({ href: validUrl }).run();
        }}
        isActive={editor.isActive('link')}
        ariaLabel="Enllaç"
      >
        <LinkIcon size={minimal ? 16 : 18} />
      </ToolbarButton>
      
      {!minimal && (
          <>
            <div className={`w-px ${minimal ? 'h-4' : 'h-6'} bg-[var(--border-master)] mx-1`}></div>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                ariaLabel="Títol 2"
            >
                <Heading2 size={18} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                ariaLabel="Títol 3"
            >
                <Heading3 size={18} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                isActive={editor.isActive('heading', { level: 4 })}
                ariaLabel="Títol 4"
            >
                <Heading4 size={18} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                isActive={editor.isActive('heading', { level: 5 })}
                ariaLabel="Títol 5"
            >
                <Heading5 size={18} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                isActive={editor.isActive('heading', { level: 6 })}
                ariaLabel="Títol 6"
            >
                <Heading6 size={18} />
            </ToolbarButton>
          </>
      )}
      
      <div className={`w-px ${minimal ? 'h-4' : 'h-6'} bg-[var(--border-master)] mx-1`}></div>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        ariaLabel="Llista"
      >
        <List size={minimal ? 16 : 18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        ariaLabel="Llista Numerada"
      >
        <ListOrdered size={minimal ? 16 : 18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        ariaLabel="Cita"
      >
        <Quote size={minimal ? 16 : 18} />
      </ToolbarButton>

      {onOpenHtmlDialog && (
          <ToolbarButton
            onClick={onOpenHtmlDialog}
            ariaLabel="Incrustar HTML"
          >
            <CodeXml size={minimal ? 16 : 18} />
          </ToolbarButton>
      )}

      {!minimal && (
          <ToolbarButton
            onClick={() => {
                const isActive = editor.isActive('listItem', { isButton: true });
                if (isActive) {
                    editor.commands.updateAttributes('listItem', { isButton: false });
                } else {
                    editor.commands.updateAttributes('listItem', { isButton: true });
                }
            }}
            isActive={editor.isActive('listItem', { isButton: true })}
            disabled={!editor.isActive('listItem')}
            ariaLabel="Convertir a botó"
          >
            <MousePointerClick size={18} />
          </ToolbarButton>
      )}

      <div className={`w-px ${minimal ? 'h-4' : 'h-6'} bg-[var(--border-master)] mx-1 ml-auto md:mx-1 md:ml-0`}></div>

      {!minimal && (
          <div className="hidden sm:flex items-center gap-1">
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                ariaLabel="Alinear Esquerra"
            >
                <AlignLeft size={18} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                ariaLabel="Centrar"
            >
                <AlignCenter size={18} />
            </ToolbarButton>
          </div>
      )}

      <div className="ml-auto flex items-center gap-1">
        {onSave && (
            <button 
                onClick={() => onSave(editor.getHTML())} 
                disabled={isSaving}
                className={`flex items-center gap-2 font-bold shadow-md transition-all disabled:opacity-50 ${minimal ? 'ml-1 bg-[var(--bg-panel-elevated)] text-[var(--theme-accent-primary)] py-1.5 px-3 rounded-lg text-xs hover:bg-[var(--theme-accent-primary)] hover:text-white' : 'ml-2 bg-[var(--theme-accent-primary)] text-white py-1.5 px-4 rounded-xl hover:bg-orange-600 active:scale-95 text-xs md:text-sm'}`}
            >
                {isSaving ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    <>
                        <Save size={16} className="hidden sm:block" />
                        <span>{t('common.save', 'Guardar')}</span>
                    </>
                )}
            </button>
        )}
      </div>
    </div>
  );
};

const RichTextEditor = ({ content, onChange, onSave, isSaving, editable = true, minimal = false }) => {
  const { t } = useTranslation();
  const [isHtmlDialogOpen, setIsHtmlDialogOpen] = useState(false);
  const [htmlInput, setHtmlInput] = useState('');

  const editor = useEditor({
    editable,
    extensions: [
      StarterKit.configure({
        listItem: false,
      }),
      CustomListItem,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image,
      Link.configure({ openOnClick: !editable }),
      Underline,
      TextStyle,
      Color,
      RawHTMLNode,
    ],
    content: content || `<p>${t('editor.placeholder', 'Comença a escriure aquí...')}</p>`,
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
    },
    // Aplica los estilos de Sóc de Poble a todo el contenido del editor directamente
    editorProps: {
        attributes: {
            'aria-label': t('editor.accessibilityLabel', 'Editor de contingut ric'),
            role: 'textbox',
            class: `focus:outline-none font-sans w-full text-[var(--text-main)] ${minimal ? 'min-h-[120px] p-3 text-base [&>h1]:text-2xl [&>h1]:font-black [&>h1]:mb-3 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mb-2 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5' : 'min-h-[60vh] p-6 lg:p-10 [&>h1]:text-3xl [&>h1]:md:text-4xl [&>h1]:font-black [&>h1]:uppercase [&>h1]:tracking-tight [&>h1]:text-center [&>h1]:mb-6 [&>h2]:text-xl [&>h2]:md:text-2xl [&>h2]:font-bold [&>h2]:text-[var(--theme-accent-secondary)] [&>h2]:uppercase [&>h2]:mb-4 [&>h2]:mt-8 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:mt-6 [&>h4]:text-base [&>h4]:font-bold [&>h4]:uppercase [&>h4]:mb-2 [&>h4]:mt-4 [&>h4]:text-[var(--text-muted)] [&>h5]:text-sm [&>h5]:font-semibold [&>h5]:text-[var(--text-muted)] [&>h5]:mb-2 [&>h5]:mt-4 [&>h6]:text-xs [&>h6]:font-medium [&>h6]:uppercase [&>h6]:tracking-widest [&>h6]:text-[var(--text-muted)] [&>h6]:mb-1 [&>h6]:mt-2 [&>p]:text-lg [&>p]:md:text-xl [&>p]:leading-relaxed [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:text-lg [&>ul]:md:text-xl [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:text-lg [&>ol]:md:text-xl [&_li]:mb-1 [&_li>p]:m-0 [&_li.bullet-button]:!list-none [&_li.bullet-button]:!pl-0 [&_li.bullet-button]:my-4 [&_li.bullet-button]:w-full [&_li.bullet-button]:flex [&_li.bullet-button]:justify-center [&_li.bullet-button>p]:inline-flex [&_li.bullet-button>p]:items-center [&_li.bullet-button>p]:justify-center [&_li.bullet-button>p]:m-0 [&_li.bullet-button>p]:bg-[var(--bg-panel-elevated)] [&_li.bullet-button>p]:text-[var(--text-main)] [&_li.bullet-button>p]:font-bold [&_li.bullet-button>p]:px-8 [&_li.bullet-button>p]:py-3 [&_li.bullet-button>p]:rounded-full [&_li.bullet-button>p]:border-2 [&_li.bullet-button>p]:border-[var(--theme-accent-primary)] [&_li.bullet-button>p]:shadow-md [&_li.bullet-button>p]:text-center [&_li.bullet-button>p]:transition-all [&_li.bullet-button>p]:active:scale-95 hover:[&_li.bullet-button>p]:bg-[var(--theme-accent-primary)] [&_li.bullet-button:hover>p]:!text-white [&_li.bullet-button_a]:!text-inherit [&_li.bullet-button_a]:!no-underline [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--theme-accent-primary)] [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:pr-4 [&_blockquote]:my-8 [&_blockquote]:mx-0 [&_blockquote]:bg-[var(--bg-panel)] [&_blockquote]:rounded-r-2xl [&_blockquote_p]:text-xl [&_blockquote_p]:md:text-2xl [&_blockquote_p]:italic [&_blockquote_p]:font-medium [&_blockquote_p]:text-[var(--text-main)] [&_blockquote_p]:mb-0 [&_img]:rounded-2xl [&_img]:border [&_img]:border-[var(--border-master)] [&_img]:my-6 [&_img]:w-full [&_a]:text-[var(--theme-accent-primary)] [&_a]:underline'}`,
        },
    },
  }, []);

  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  return (
    <div className={`w-full flex flex-col bg-[var(--bg-app)] ${editable && !minimal ? 'border-t border-[var(--theme-accent-primary)]/20 shadow-2xl relative z-20' : minimal && editable ? 'rounded-xl border border-[var(--border-master)] focus-within:ring-2 focus-within:ring-[var(--theme-accent-primary)] transition-all' : ''} overflow-hidden`} style={editable && !minimal ? { 
        boxShadow: '0 -15px 40px -10px rgba(0,0,0,0.1)' 
    } : {}}>
      {editable && <MenuBar editor={editor} onSave={onSave} isSaving={isSaving} minimal={minimal} onOpenHtmlDialog={() => setIsHtmlDialogOpen(true)} />}
      <div className={`flex-1 overflow-y-auto ${editable && !minimal ? 'bg-[var(--bg-panel)]' : ''} custom-scrollbar`}>
        <div className={`max-w-4xl mx-auto bg-transparent ${editable && !minimal ? 'shadow-sm min-h-screen my-0 sm:my-8 sm:rounded-2xl sm:border border-[var(--border-master)] dark:bg-[#0f0f0f] bg-white' : ''}`}>
            <EditorContent editor={editor} />
        </div>
      </div>
      
      {isHtmlDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in">
          <div className="bg-[var(--bg-app)] rounded-2xl w-full max-w-2xl shadow-2xl border border-[var(--border-master)] overflow-hidden flex flex-col scale-100 animate-up">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-master)] bg-[var(--bg-panel)]">
              <h3 className="font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
                <CodeXml className="text-[var(--theme-accent-primary)]" size={20} />
                Incrustar HTML / Codi Extern
              </h3>
              <button onClick={() => setIsHtmlDialogOpen(false)} className="p-2 hover:bg-[var(--bg-panel-elevated)] rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 flex-1">
              <p className="text-sm text-[var(--text-muted)] mb-3">
                Enganxa aquí el codi <code>&lt;iframe&gt;</code>, un script de dades, o qualsevol component HTML que vulgues incrustar. Es mostrarà directament a la pàgina.
              </p>
              <textarea
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="<iframe src='...'></iframe>"
                className="w-full h-48 bg-[var(--bg-panel)] text-[var(--text-main)] border border-[var(--border-master)] rounded-xl p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent-primary)] custom-scrollbar resize-none"
              />
            </div>
            <div className="p-4 border-t border-[var(--border-master)] bg-[var(--bg-panel)] flex justify-end gap-2">
              <button onClick={() => setIsHtmlDialogOpen(false)} className="px-4 py-2 font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-panel-elevated)] rounded-xl transition-all">
                Cancel·lar
              </button>
              <button 
                onClick={() => {
                  if (htmlInput.trim()) {
                    editor.chain().focus().insertContent({ type: 'rawHtml', attrs: { html: htmlInput } }).run();
                  }
                  setIsHtmlDialogOpen(false);
                  setHtmlInput('');
                }}
                className="px-6 py-2 font-bold bg-[var(--theme-accent-primary)] text-white rounded-xl shadow-md hover:bg-orange-600 transition-all active:scale-95"
              >
                Inserir Codi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
