import React, { useState } from 'react';
import { Megaphone, MessageCircle, ShoppingBasket, Home, Users, Search, User, BrainCircuit, Languages, Share2 } from 'lucide-react';
import { IconButton } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { useNavigate } from 'react-router-dom';

const wallCards = [
  {
    title: "Paella popular",
    body: "Diumenge a les 13:30 en la plaça. Apunteu-vos al casal abans de divendres.",
    location: "La Torre de les Maçanes",
    time: "Fa 8 min",
  },
  {
    title: "Es busca ajuda",
    body: "Calen dues persones per moure taules després de missa. Es pagarà esmorzar.",
    location: "Benifallim",
    time: "Fa 22 min",
  },
];

export function UniversalCard({ title, body, location, time }) {
  return (
    <article className="universalCard">
      <header className="cardHeader">
        <span className="avatar avatarCompact" aria-hidden="true">
          <BrainCircuit />
        </span>
        <div>
          <strong>Javi Llinares</strong>
          <p>{location}</p>
        </div>
        <time>{time}</time>
      </header>
      <div className="cardBody">
        <h3>{title}</h3>
        <p>{body}</p>
        <div className="stoneImage" aria-label="Imatge placeholder de pedra seca" />
      </div>
      <footer className="cardFooter">
        <IconButton label="Traduir">
          <Languages aria-hidden="true" />
        </IconButton>
        <IconButton label="Xatejar">
          <MessageCircle aria-hidden="true" />
        </IconButton>
        <IconButton label="Compartir">
          <Share2 aria-hidden="true" />
        </IconButton>
        <button className="universalButton outline">+ CONNECTAR</button>
      </footer>
    </article>
  );
}

function SecondaryPanels() {
  return (
    <aside className="secondaryPanels" aria-label="Mur i mercat">
      <section className="profileStrip">
        <span className="avatar" aria-hidden="true">
          <User />
        </span>
        <div>
          <strong>Javi Llinares</strong>
          <p>La Torre de les Maçanes</p>
        </div>
      </section>
      <section className="murPreview" id="mur">
        <h2>Mur</h2>
        {wallCards.map((card) => (
          <UniversalCard key={card.title} {...card} />
        ))}
      </section>
    </aside>
  );
}

const dummyChats = [
  {
    id: "festes",
    title: "Grup de Festes",
    preview: "Recordeu portar cadires a la plaça a les 19:00.",
    time: "14:32",
    unread: 3,
    active: true,
    kind: "group",
  },
  {
    id: "ajuntament",
    title: "Bàndol de l'Ajuntament",
    preview: "Tall d'aigua demà de 9:00 a 11:00 al carrer Major.",
    time: "13:05",
    unread: 1,
    kind: "council",
  },
  {
    id: "mercat",
    title: "Mercat del dissabte",
    preview: "Maria ven tomaques, ous i oli de la cooperativa.",
    time: "12:18",
    kind: "market",
  },
  {
    id: "veins",
    title: "Veïns de La Torre",
    preview: "Algú ha vist les claus del casal?",
    time: "Ahir",
    unread: 6,
    kind: "village",
  },
];

function Avatar({ kind }) {
  const icons = {
    group: Users,
    council: Megaphone,
    market: ShoppingBasket,
    village: Home,
  };
  const AvatarIcon = icons[kind] || Users;
  return (
    <span className="avatar" aria-hidden="true">
      <AvatarIcon />
    </span>
  );
}

function ChatListItem({ chat, isActive, onClick }) {
  return (
    <button
      type="button"
      className={`chatItem ${isActive ? "isActive" : ""}`}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
    >
      <Avatar kind={chat.kind} />
      <span className="chatCopy">
        <span className="chatTitleRow">
          <strong>{chat.title}</strong>
          <span className="chatTime">{chat.time}</span>
        </span>
        <span className="chatPreview">{chat.preview}</span>
      </span>
      {chat.unread ? <span className="badge">{chat.unread}</span> : null}
    </button>
  );
}

function ChatList({ activeId, onSelectChat }) {
  return (
    <section className="chatList" aria-label="Xats del poble">
      <div className="chatListHeader">
        <h1>Xat</h1>
        <IconButton label="Buscar xat">
          <Search aria-hidden="true" />
        </IconButton>
      </div>
      <div className="chatRows">
        {dummyChats.map((chat) => (
          <ChatListItem 
            key={chat.id} 
            chat={chat} 
            isActive={chat.id === activeId}
            onClick={() => onSelectChat(chat.id)} 
          />
        ))}
      </div>
    </section>
  );
}

function ConversationPane({ activeId }) {
  const chat = dummyChats.find(c => c.id === activeId) || dummyChats[0];

  return (
    <section className="conversationPane" aria-label="Conversa seleccionada">
      <div className="conversationHeader">
        <Avatar kind={chat?.kind || 'group'} />
        <div>
          <h2>{chat?.title || 'Conversa'}</h2>
          <p>Veïns connectats</p>
        </div>
      </div>
      <div className="messageStack">
        <article className="message messageOther">
          <p>{chat?.preview || 'Benvinguts al xat.'}</p>
          <time>{chat?.time || 'Ara'}</time>
        </article>
      </div>
      <form className="messageComposer" onSubmit={e => e.preventDefault()}>
        <label className="srOnly" htmlFor="message">
          Escriu un missatge
        </label>
        <input id="message" placeholder="Escriu un missatge..." />
        <button className="button primary" type="submit">
          Enviar
        </button>
      </form>
    </section>
  );
}

export default function XatSection() {
  const [activeId, setActiveId] = useState("festes");

  return (
    <div className="mainGrid">
      <ChatList activeId={activeId} onSelectChat={setActiveId} />
      <ConversationPane activeId={activeId} />
      <SecondaryPanels />
    </div>
  );
}
