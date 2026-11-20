import React, { useCallback, useEffect, useMemo, useState } from 'react';
import HousingService from '../services/housing.service';
import { PropertiesResponseData, PropertyData, SecurityState, TaxEntry } from '../types/property';

interface WidgetProps { width: number; height: number }
const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const taxesOf = (property: PropertyData): TaxEntry[] => Object.values(property.tax_data || {}).filter((entry): entry is TaxEntry => Boolean(entry));

export const HousingWidget: React.FC<WidgetProps> = ({ width, height }) => {
  const [properties, setProperties] = useState<PropertiesResponseData | null>(null);
  const [security, setSecurity] = useState<SecurityState | null>(null);
  const refresh = useCallback(async () => {
    const response = await HousingService.getProperties();
    if (response.status !== 'ok' || !response.data) return;
    setProperties(response.data);
    const primary = response.data.owned[0];
    if (primary) {
      const securityResponse = await HousingService.getSecurityState(primary.property_id).catch(() => null);
      if (securityResponse?.status === 'ok' && securityResponse.data) setSecurity(securityResponse.data);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(refresh, 45000);
    const onMessage = (event: MessageEvent) => {
      if (event.data?.action === 'refreshProperties' || /security|property/i.test(String(event.data?.method || ''))) void refresh();
    };
    window.addEventListener('message', onMessage);
    return () => { window.clearInterval(timer); window.removeEventListener('message', onMessage); };
  }, [refresh]);

  const summary = useMemo(() => {
    const owned = properties?.owned || [];
    const bills = owned.flatMap((property) => taxesOf(property).map((tax) => ({ property, tax })));
    const pending = bills.filter(({ tax }) => Number(tax.balance) > 0);
    const total = pending.reduce((sum, { tax }) => sum + Number(tax.balance || 0), 0);
    const urgent = [...pending].sort((a, b) => Number(a.tax.nextDueAt || Infinity) - Number(b.tax.nextDueAt || Infinity))[0];
    return { owned, access: properties?.access || [], pending, total, urgent };
  }, [properties]);
  const compact = width === 2 && height === 1;
  const incident = security?.incident;

  return (
    <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'hidden', borderRadius: 16, padding: compact ? '9px 11px' : '10px 14px', color: '#fff', background: 'linear-gradient(145deg,#f97316,#b94708)', border: '1px solid rgba(255,255,255,.22)', boxShadow: '0 10px 24px rgba(0,0,0,.28)', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 10, fontWeight: 850, letterSpacing: '.07em' }}>MEUS IMÓVEIS</span>{incident && <span style={{ borderRadius: 8, padding: '2px 6px', background: '#991b1b', fontSize: 8, fontWeight: 800 }}>ALERTA</span>}</div>
      <div style={{ display: 'flex', gap: 14, marginTop: 7 }}>
        <div><div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{summary.owned.length}</div><div style={{ marginTop: 3, fontSize: 8, opacity: .75 }}>Próprios</div></div>
        <div><div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{summary.access.length}</div><div style={{ marginTop: 3, fontSize: 8, opacity: .75 }}>Com acesso</div></div>
        {!compact && <div style={{ marginLeft: 'auto', textAlign: 'right' }}><div style={{ fontSize: 15, fontWeight: 800 }}>{money(summary.total)}</div><div style={{ marginTop: 3, fontSize: 8, opacity: .75 }}>{summary.pending.length} conta(s) pendente(s)</div></div>}
      </div>
      {compact && <div style={{ marginTop: 5, fontSize: 9, opacity: .85 }}>{summary.pending.length ? `${summary.pending.length} conta(s) · ${money(summary.total)}` : 'Nenhuma conta pendente'}</div>}
      {!compact && height === 1 && <div style={{ marginTop: 7, fontSize: 9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary.urgent ? `Mais urgente: ${summary.urgent.tax.label} · ${summary.urgent.property.street}` : 'Todas as contas estão em dia.'}</div>}
      {height >= 2 && <div style={{ marginTop: 8, paddingTop: 7, borderTop: '1px solid rgba(255,255,255,.18)' }}>
        <div style={{ fontSize: 9, fontWeight: 700, opacity: .7 }}>PRÓXIMA PENDÊNCIA</div>
        {summary.urgent ? <><div style={{ marginTop: 4, fontSize: 11, fontWeight: 750, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary.urgent.property.street}</div><div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: 9 }}><span>{summary.urgent.tax.label}</span><b>{money(summary.urgent.tax.balance)}</b></div></> : <div style={{ marginTop: 4, fontSize: 10 }}>Contas em dia.</div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7, fontSize: 9, opacity: .85 }}><span>Alarme: <b>{security?.alarmArmed ? 'Armado' : security?.alarm ? 'Desarmado' : 'Não contratado'}</b></span><span>Câmeras: <b>{security ? `${security.cameras.filter((camera) => camera.online).length}/${security.cameras.length}` : '—'}</b></span></div>
      </div>}
    </div>
  );
};
