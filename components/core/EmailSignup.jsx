import React from 'react';
import { TextInput } from './TextInput.jsx';
import { Button } from './Button.jsx';

export function EmailSignup({ placeholder = 'EMAIL ADDRESS', buttonLabel = 'SUBSCRIBE', onSubscribe, width = 320, style }) {
  const [value, setValue] = React.useState('');
  const [done, setDone] = React.useState(false);
  const submit = () => { if (value.trim()) { onSubscribe && onSubscribe(value.trim()); setDone(true); } };
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', border: 'var(--control-border)', width, maxWidth: '100%', boxSizing: 'border-box', background: 'var(--paper)', ...style }}>
      <TextInput
        bare
        placeholder={placeholder}
        value={done ? 'SUBSCRIBED' : value}
        onChange={(v) => { setDone(false); setValue(v); }}
        style={{ flex: 1, height: 26 }}
      />
      <Button label={buttonLabel} size="sm" onClick={submit} style={{ border: 'none', flexShrink: 0 }} />
    </div>
  );
}
