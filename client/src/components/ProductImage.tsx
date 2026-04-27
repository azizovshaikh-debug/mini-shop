const icons: Record<string, string> = {
  'Электроника': '📱',
  'Одежда': '👕',
  'Спорт': '⚽',
  'Книги': '📚',
  'Продукты': '🍎',
  'Мебель': '🪑',
  'Игрушки': '🎮',
  'Авто': '🚗',
};

const bgColors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#feca57', '#ff6b6b'];

export default function ProductImage({ category, name, imageUrl }: { category: string; name: string; imageUrl?: string }) {
  const color = bgColors[name.length % bgColors.length];
  const icon = icons[category] || '📦';

  if (imageUrl && imageUrl.startsWith('/uploads/')) {
    return (
      <div className="h-48 flex items-center justify-center bg-gray-100 rounded-t-2xl overflow-hidden">
        <img src={'http://localhost:3000' + imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, ' + color + ', ' + color + 'cc)',
        height: '192px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
      }}
    >
      <span style={{ fontSize: '60px' }}>{icon}</span>
      <span style={{ color: 'white', fontSize: '14px', fontWeight: 600, marginTop: '8px', background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderRadius: '20px' }}>{category}</span>
    </div>
  );
}
