export const exportToTXT = (content, type = 'summary') => {
  const title = type === 'summary' ? 'Resumen de Reunión' : 'Acta de Reunión';
  const date = new Date().toLocaleDateString('es-ES');
  const text = `${title}\n\nFecha: ${date}\n\n${content}`;
  
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fenpruss-${type === 'summary' ? 'resumen' : 'acta'}.txt`;
  a.click();
  window.URL.revokeObjectURL(url);
};