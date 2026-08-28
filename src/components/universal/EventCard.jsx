import React from 'react';
import { UniversalCard } from './UniversalComponents';
import { resolveAsset } from '../../config/assetResolver';

function getCalendarBadge(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;

  return {
    dia: String(d.getDate()),
    mes: d.toLocaleDateString('ca-ES', { month: 'long' }).toUpperCase(),
    any: String(d.getFullYear()),
    dateTime: d.toISOString().split('T')[0]
  };
}

function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('ca-ES', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
}

function formatTime(timeStr, dateString) {
  if (timeStr) return timeStr;
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('ca-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function EventCard({ item }) {
  const rawDate = item.date || item.publish_date || item.created_at;
  
  // Use entradilla if available, then lead, then description
  const bodyContent = item.entradilla || item.lead || (item.description ? <p className="sp-card-text">{item.description}</p> : null);
  
  // Custom badges for event
  const labels = item.labels || [];

  return (
    <UniversalCard
      title={item.title || item.name}
      subtitle={item.subtitle}
      body={bodyContent}
      imageUrl={resolveAsset((typeof item.image_url === 'string' ? item.image_url : null) || (typeof item.image === 'string' ? item.image : null) || '')}
      imageAlt={item.imageAlt || item.title || item.name || ''}
      author={item.author_name}
      authorHref={item.isSystem ? "/pobles" : undefined}
      avatarUrl={resolveAsset((typeof item.author_avatar === 'string' ? item.author_avatar : null) || '')}
      location={item.author_location || item.location}
      date={formatDate(rawDate)}
      time={formatTime(item.time, rawDate)}
      copyright={item.copyright}
      calendarBadge={getCalendarBadge(rawDate)}
      labels={labels}
      mainHref={item.mainHref || `/events/${item.id}`}
      showPin={item.isAvis || false}
      hasFooter={true}
      showTranslate={true}
      showComment={true}
      showShare={true}
      showConnect={true}
    />
  );
}
