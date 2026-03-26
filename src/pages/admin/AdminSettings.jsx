import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { changePassword, getSettings, updateSettings } from '../../api';
import { GripVertical, Eye, EyeOff, Save, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_FIELDS = [
  { key: 'tipo_acervo',    label: 'Tema / Categoria',           visible: true  },
  { key: 'genero',         label: 'Subtema',                    visible: true  },
  { key: 'data_producao',  label: 'Data',                       visible: true  },
  { key: 'suporte',        label: 'Suporte',                    visible: true  },
  { key: 'autor_producao', label: 'Origem / Crédito',           visible: true  },
  { key: 'conteudo',       label: 'Descrição (acessibilidade)',  visible: true  },
  // Campos arquivísticos extras — ocultos por padrão, ativáveis aqui
  { key: 'collection_name',  label: 'Coleção',          visible: false },
  { key: 'numero_registro',  label: 'Nº de Registro',   visible: false },
  { key: 'fundo',            label: 'Fundo',             visible: false },
  { key: 'funcao',           label: 'Função',            visible: false },
  { key: 'local',            label: 'Local',             visible: false },
  { key: 'tipo_documental',  label: 'Tipo Documental',   visible: false },
  { key: 'dimensoes',        label: 'Dimensões',         visible: false },
];

export default function AdminSettings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [savingFields, setSavingFields] = useState(false);
  const [loadingFields, setLoadingFields] = useState(true);
  const [customFields, setCustomFields] = useState([]);
  const [savingCustom, setSavingCustom] = useState(false);
  const [newCustomLabel, setNewCustomLabel] = useState('');

  useEffect(() => {
    getSettings('metadata_fields')
      .then(r => { if (r.data.value) setFields(r.data.value); })
      .catch(() => {})
      .finally(() => setLoadingFields(false));
    getSettings('custom_fields')
      .then(r => setCustomFields(r.data.value || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) return toast.error('As senhas não coincidem');
    if (form.newPassword.length < 6) return toast.error('Nova senha precisa ter pelo menos 6 caracteres');
    setSaving(true);
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Senha alterada com sucesso!');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao alterar senha');
    } finally { setSaving(false); }
  };

  const toggleField = (key) => {
    setFields(f => f.map(x => x.key === key ? { ...x, visible: !x.visible } : x));
  };

  const renameField = (key, label) => {
    setFields(f => f.map(x => x.key === key ? { ...x, label } : x));
  };

  const handleSaveFields = async () => {
    setSavingFields(true);
    try {
      await updateSettings('metadata_fields', fields);
      toast.success('Campos de metadados salvos!');
    } catch (err) {
      toast.error('Erro ao salvar configuração');
    } finally { setSavingFields(false); }
  };

  const resetFields = () => setFields(DEFAULT_FIELDS);

  const addCustomField = () => {
    const label = newCustomLabel.trim();
    if (!label) return;
    const key = label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    if (customFields.some(f => f.key === key)) return toast.error('Campo já existe');
    setCustomFields(f => [...f, { key, label }]);
    setNewCustomLabel('');
  };

  const removeCustomField = (key) => setCustomFields(f => f.filter(x => x.key !== key));
  const renameCustomField = (key, label) => setCustomFields(f => f.map(x => x.key === key ? { ...x, label } : x));

  const handleSaveCustom = async () => {
    setSavingCustom(true);
    try {
      await updateSettings('custom_fields', customFields);
      toast.success('Campos personalizados salvos!');
    } catch {
      toast.error('Erro ao salvar');
    } finally { setSavingCustom(false); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Configurações</h1>
          <p className="admin-page-sub mono">Gerenciar conta e campos de metadados</p>
        </div>
      </div>

      <div style={{padding:'2.5rem',display:'flex',flexDirection:'column',gap:'2rem',maxWidth:'820px'}}>

        {/* Metadata fields config */}
        <div style={{background:'var(--surface)',border:'1px solid #2e2a25',padding:'2rem'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.5rem'}}>
            <h2 style={{fontStyle:'italic'}}>Campos de Metadados das Imagens</h2>
            <button className="btn btn-ghost btn-sm mono" onClick={resetFields} style={{fontSize:'0.65rem'}}>Restaurar padrão</button>
          </div>
          <p className="mono" style={{fontSize:'0.7rem',color:'var(--ash)',letterSpacing:'0.06em',marginBottom:'1.5rem'}}>
            Ative/desative campos e renomeie os rótulos. As mudanças afetam o formulário de edição e a exibição pública.
          </p>

          {loadingFields ? (
            <p style={{color:'var(--ash)',fontSize:'0.85rem'}}>Carregando...</p>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'1.5rem'}}>
              {fields.map((f) => (
                <div key={f.key} style={{
                  display:'flex',alignItems:'center',gap:'12px',
                  padding:'10px 14px',
                  background: f.visible ? 'rgba(200,169,110,0.04)' : 'transparent',
                  border:`1px solid ${f.visible ? 'rgba(200,169,110,0.2)' : '#2e2a25'}`,
                  transition:'all 0.2s',
                }}>
                  <GripVertical size={14} style={{color:'var(--ash)',flexShrink:0}} />

                  <button
                    onClick={() => toggleField(f.key)}
                    style={{
                      display:'flex',alignItems:'center',flexShrink:0,
                      color: f.visible ? 'var(--sepia)' : 'var(--ash)',
                      padding:'2px',
                    }}
                    title={f.visible ? 'Ocultar campo' : 'Mostrar campo'}
                  >
                    {f.visible ? <Eye size={16}/> : <EyeOff size={16}/>}
                  </button>

                  <span className="mono" style={{fontSize:'0.65rem',color:'var(--ash)',letterSpacing:'0.08em',flexShrink:0,width:'140px',opacity:f.visible?1:0.4}}>
                    {f.key}
                  </span>

                  <input
                    className="form-input"
                    value={f.label}
                    onChange={e => renameField(f.key, e.target.value)}
                    disabled={!f.visible}
                    style={{flex:1,opacity:f.visible?1:0.4,fontSize:'0.88rem',padding:'6px 10px'}}
                    placeholder="Rótulo do campo"
                  />
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-primary" onClick={handleSaveFields} disabled={savingFields}>
            <Save size={15}/> {savingFields ? 'Salvando...' : 'Salvar Configuração de Campos'}
          </button>
        </div>

        {/* Custom global fields */}
        <div style={{background:'var(--surface)',border:'1px solid #2e2a25',padding:'2rem'}}>
          <h2 style={{fontStyle:'italic',marginBottom:'0.5rem'}}>Campos Personalizados do Acervo</h2>
          <p className="mono" style={{fontSize:'0.7rem',color:'var(--ash)',letterSpacing:'0.06em',marginBottom:'1.5rem'}}>
            Campos extras que aparecem no formulário de todas as imagens. Defina aqui, preencha por imagem no álbum.
          </p>

          {customFields.length > 0 && (
            <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'1rem'}}>
              {customFields.map(f => (
                <div key={f.key} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 12px',border:'1px solid #2e2a25',background:'rgba(200,169,110,0.03)'}}>
                  <span className="mono" style={{fontSize:'0.62rem',color:'var(--ash)',letterSpacing:'0.08em',flexShrink:0,width:'130px'}}>{f.key}</span>
                  <input
                    className="form-input"
                    value={f.label}
                    onChange={e => renameCustomField(f.key, e.target.value)}
                    style={{flex:1,fontSize:'0.88rem',padding:'6px 10px'}}
                  />
                  <button className="admin-action-btn admin-action-btn--danger" onClick={() => removeCustomField(f.key)} title="Remover campo">
                    <X size={14}/>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{display:'flex',gap:'8px',marginBottom:'1.5rem'}}>
            <input
              className="form-input"
              placeholder="Nome do novo campo (ex: Estado de Conservação)"
              value={newCustomLabel}
              onChange={e => setNewCustomLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomField()}
              style={{flex:1}}
            />
            <button className="btn btn-ghost" onClick={addCustomField} style={{flexShrink:0}}>
              <Plus size={15}/> Adicionar
            </button>
          </div>

          <button className="btn btn-primary" onClick={handleSaveCustom} disabled={savingCustom}>
            <Save size={15}/> {savingCustom ? 'Salvando...' : 'Salvar Campos Personalizados'}
          </button>
        </div>

        {/* Account info */}
        <div style={{background:'var(--surface)',border:'1px solid #2e2a25',padding:'2rem'}}>
          <h2 style={{fontStyle:'italic',marginBottom:'1.5rem'}}>Informações da Conta</h2>
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input className="form-input" value={user?.name || ''} readOnly style={{opacity:0.6}} />
          </div>
          <div className="form-group" style={{marginTop:'14px'}}>
            <label className="form-label">E-mail</label>
            <input className="form-input" value={user?.email || ''} readOnly style={{opacity:0.6}} />
          </div>
        </div>

        {/* Change password */}
        <div style={{background:'var(--surface)',border:'1px solid #2e2a25',padding:'2rem'}}>
          <h2 style={{fontStyle:'italic',marginBottom:'1.5rem'}}>Alterar Senha</h2>
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div className="form-group">
              <label className="form-label">Senha atual</label>
              <input type="password" className="form-input" value={form.currentPassword} onChange={e => setForm(f => ({...f,currentPassword:e.target.value}))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Nova senha</label>
              <input type="password" className="form-input" value={form.newPassword} onChange={e => setForm(f => ({...f,newPassword:e.target.value}))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar nova senha</label>
              <input type="password" className="form-input" value={form.confirm} onChange={e => setForm(f => ({...f,confirm:e.target.value}))} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Alterar Senha'}</button>
          </form>
        </div>

      </div>
    </div>
  );
}
