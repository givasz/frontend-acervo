
export default function Footer() {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid #e8e0e2',
      padding: '2rem 2rem',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1400px',
        display: 'flex',
        margin: '0 auto',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
        <img src="/geminal-logo.png" alt="Logo Germinal" style={{ height: 48, width: 'auto' }} />
      </div>
    </footer>
  );
}
