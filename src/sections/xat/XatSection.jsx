import React, { useState } from 'react';
import { Megaphone, MessageCircle, ShoppingBasket, Home, Users, Search, User, BrainCircuit, Languages, Share2 } from 'lucide-react';
import { IconButton, UniversalPage } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { NavLink, useParams } from 'react-router-dom';
import NotFoundPage from '../../pages/NotFoundPage';

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
        <div className="stoneImage" aria-hidden="true" />
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

function ChatListItem({ chat }) {
  return (
    <NavLink
      to={`/chat/${encodeURIComponent(String(chat.id))}`}
      className={({ isActive }) => `chatItem ${isActive ? "isActive" : ""}`}
    >
      <Avatar kind={chat.type} />
      <span className="chatCopy">
        <span className="chatTitleRow">
          <strong>{chat.name || chat.title}</strong>
        </span>
        <span className="chatPreview">{chat.lastMessagePreview}</span>
      </span>
      {chat.unreadCount ? <span className="badge">{chat.unreadCount}</span> : null}
    </NavLink>
  );
}

function ChatList({ threads, activeId, onSelectChat }) {
  return (
    <section className="chatList" aria-label="Xats del poble">
      <div className="chatListHeader">
        <h2>Xat</h2>
        <IconButton label="Buscar xat">
          <Search aria-hidden="true" />
        </IconButton>
      </div>
      <div className="chatRows">
        {threads.map((chat) => (
          <ChatListItem 
            key={chat.id} 
            chat={chat} 
          />
        ))}
      </div>
    </section>
  );
}

function ConversationPane({ activeId, thread, messages, onSendMessage }) {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    
    setText('');
    try {
      await onSendMessage(thread, value);
    } catch (err) {
      setText(value); // Restaura si falla
    }
  };

  return (
    <section className="conversationPane" aria-label="Conversa seleccionada">
      <div className="conversationHeader">
        <Avatar kind={thread?.type || 'group'} />
        <div>
          <h2>{thread?.name || thread?.title || 'Conversa'}</h2>
          <p>Veïns connectats</p>
        </div>
      </div>
      <div 
        className="messageStack"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((msg, i) => (
          <article 
            key={msg.id || i} 
            className={`message ${msg.sender === 'me' || msg.is_ai ? "messageMe" : "messageOther"}`}
          >
            <p>{msg.text ?? msg.content ?? ''}</p>
          </article>
        ))}
        {messages.length === 0 && (
          <article className="message messageOther">
            <p>Cap missatge encara.</p>
          </article>
        )}
      </div>
      <form className="messageComposer" onSubmit={handleSubmit}>
        <label className="srOnly" htmlFor="message">
          Escriu un missatge
        </label>
        <input id="message" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escriu un missatge..." />
        <button className="button primary" type="submit">
          Enviar
        </button>
      </form>
    </section>
  );
}

export default function XatSection() {
  const { chatThreads, getThreadMessages, sendChatMessage, t } = useAppData();
  const { threadId } = useParams();
  
  const activeThread = threadId 
    ? chatThreads?.find(c => String(c.id) === threadId)
    : chatThreads?.[0] ?? null;

  if (threadId && !activeThread) {
    return <NotFoundPage />;
  }

  const activeId = activeThread?.id ?? null;
  const messages = activeThread ? getThreadMessages(activeThread.id) : [];

  return (
    <UniversalPage
      title={t('section.xat.kicker', 'Xat')}
      subtitle={t('section.xat.title', 'Converses')}
      lead={t('section.xat.subtitle', 'Connecta amb els veïns i grups del poble.')}
      chrome="system"
      showLogos={true}
    >
      <div className="mainGrid">
        <ChatList threads={chatThreads || []} />
        <ConversationPane activeId={activeId} thread={activeThread} messages={messages} onSendMessage={sendChatMessage} />
        <SecondaryPanels />
      </div>
    </UniversalPage>
  );
}
