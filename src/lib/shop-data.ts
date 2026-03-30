import type { ShopItem, WeeklyTask, PurchasePackage, AdRewardConfig, UserInventory } from './types';

// =====================
// DEFAULT INVENTORY
// =====================
export const DEFAULT_INVENTORY: UserInventory = {
  paperColors: ['cream', 'pink', 'honey'], // Free colors
  stamps: ['heart', 'bee', 'wax-seal'], // Free stamps
  borderStyles: ['simple'], // Free border
  fonts: ['Indie_Flower', 'Belleza'], // Free fonts
  special: [],
};

// =====================
// SHOP ITEMS
// =====================
export const SHOP_ITEMS: ShopItem[] = [
  // ========================================
  // === PAPER COLORS (20 items) ===
  // ========================================
  
  // Free colors (3)
  { id: 'paper-cream', category: 'paperColor', itemId: 'cream', name: 'Crema', description: 'El clásico papel crema', price: 0, currency: 'polen', icon: '📜', isDefault: true },
  { id: 'paper-pink', category: 'paperColor', itemId: 'pink', name: 'Rosa', description: 'Un rosa dulce y romántico', price: 0, currency: 'polen', icon: '🌸', isDefault: true },
  { id: 'paper-honey', category: 'paperColor', itemId: 'honey', name: 'Miel', description: 'Cálido como la miel', price: 0, currency: 'polen', icon: '🍯', isDefault: true },
  
  // Polen colors - Tier 1 (100-150)
  { id: 'paper-lavender', category: 'paperColor', itemId: 'lavender', name: 'Lavanda', description: 'Suave y relajante', price: 100, currency: 'polen', icon: '💜' },
  { id: 'paper-mint', category: 'paperColor', itemId: 'mint', name: 'Menta', description: 'Fresco como la brisa', price: 100, currency: 'polen', icon: '🌿' },
  { id: 'paper-light-pink', category: 'paperColor', itemId: 'light-pink', name: 'Rosa Pastel', description: 'Suavidad infinita', price: 120, currency: 'polen', icon: '💗' },
  
  // Polen colors - Tier 2 (150-200)
  { id: 'paper-crimson', category: 'paperColor', itemId: 'crimson', name: 'Carmesí', description: 'Pasión en cada palabra', price: 150, currency: 'polen', icon: '❤️' },
  { id: 'paper-peach', category: 'paperColor', itemId: 'peach', name: 'Durazno', description: 'Dulce y tierno', price: 150, currency: 'polen', icon: '🍑' },
  { id: 'paper-sky', category: 'paperColor', itemId: 'sky', name: 'Cielo', description: 'Azul como tus sueños', price: 175, currency: 'polen', icon: '☁️' },
  { id: 'paper-rose', category: 'paperColor', itemId: 'rose', name: 'Rosa Claro', description: 'Delicado y elegante', price: 200, currency: 'polen', icon: '🌹' },
  
  // Premium colors - Jalea Real (75-150)
  { id: 'paper-sunset', category: 'paperColor', itemId: 'sunset', name: 'Atardecer', description: 'Tonos cálidos del ocaso', price: 75, currency: 'jaleaReal', isPremium: true, icon: '🌅' },
  { id: 'paper-ocean', category: 'paperColor', itemId: 'ocean', name: 'Océano', description: 'Profundo y misterioso', price: 85, currency: 'jaleaReal', isPremium: true, icon: '🌊' },
  { id: 'paper-aurora', category: 'paperColor', itemId: 'aurora', name: 'Aurora', description: 'Mágico como el cielo nocturno', price: 100, currency: 'jaleaReal', isPremium: true, icon: '🌌' },
  { id: 'paper-rose-gold', category: 'paperColor', itemId: 'rose-gold', name: 'Oro Rosa', description: 'Elegancia moderna', price: 120, currency: 'jaleaReal', isPremium: true, icon: '✨' },
  { id: 'paper-champagne', category: 'paperColor', itemId: 'champagne', name: 'Champagne', description: 'Celebra cada momento', price: 100, currency: 'jaleaReal', isPremium: true, icon: '🥂' },
  { id: 'paper-moonlight', category: 'paperColor', itemId: 'moonlight', name: 'Luz de Luna', description: 'Plateado y sereno', price: 125, currency: 'jaleaReal', isPremium: true, icon: '🌙' },
  { id: 'paper-cherry-blossom', category: 'paperColor', itemId: 'cherry-blossom', name: 'Flor de Cerezo', description: 'La primavera eterna', price: 150, currency: 'jaleaReal', isPremium: true, icon: '🌸' },

  // ========================================
  // === STAMPS (25 items) ===
  // ========================================
  
  // Free stamps (3)
  { id: 'stamp-heart', category: 'stamp', itemId: 'heart', name: 'Corazón', description: 'El sello del amor', price: 0, currency: 'polen', icon: '❤️', isDefault: true },
  { id: 'stamp-bee', category: 'stamp', itemId: 'bee', name: 'Abejita', description: 'Nuestra mascota', price: 0, currency: 'polen', icon: '🐝', isDefault: true },
  { id: 'stamp-wax-seal', category: 'stamp', itemId: 'wax-seal', name: 'Sello de Cera', description: 'Elegancia clásica', price: 0, currency: 'polen', icon: '🔴', isDefault: true },
  
  // Polen stamps - Tier 1 (75-100)
  { id: 'stamp-rose', category: 'stamp', itemId: 'rose-emoji', name: 'Rosa', description: 'Una rosa para tu amor', price: 75, currency: 'polen', icon: '🌹' },
  { id: 'stamp-star', category: 'stamp', itemId: 'star-emoji', name: 'Estrella', description: 'Brilla como tú', price: 75, currency: 'polen', icon: '⭐' },
  { id: 'stamp-butterfly', category: 'stamp', itemId: 'butterfly-emoji', name: 'Mariposa', description: 'Delicada y libre', price: 85, currency: 'polen', icon: '🦋' },
  { id: 'stamp-flower', category: 'stamp', itemId: 'flower-emoji', name: 'Flor', description: 'Frescura natural', price: 80, currency: 'polen', icon: '🌺' },
  { id: 'stamp-rainbow', category: 'stamp', itemId: 'rainbow-emoji', name: 'Arcoíris', description: 'Después de la lluvia', price: 90, currency: 'polen', icon: '🌈' },
  
  // Polen stamps - Tier 2 (100-150)
  { id: 'stamp-kiss', category: 'stamp', itemId: 'kiss-emoji', name: 'Beso', description: 'Un beso sellado', price: 100, currency: 'polen', icon: '💋' },
  { id: 'stamp-sparkle', category: 'stamp', itemId: 'sparkle-emoji', name: 'Destellos', description: 'Magia en cada carta', price: 100, currency: 'polen', icon: '✨' },
  { id: 'stamp-sun', category: 'stamp', itemId: 'sun-emoji', name: 'Sol', description: 'Ilumina su día', price: 120, currency: 'polen', icon: '☀️' },
  { id: 'stamp-fire', category: 'stamp', itemId: 'fire-emoji', name: 'Fuego', description: 'Pasión ardiente', price: 125, currency: 'polen', icon: '🔥' },
  { id: 'stamp-cupid', category: 'stamp', itemId: 'cupid-emoji', name: 'Cupido', description: 'Flechazo de amor', price: 150, currency: 'polen', icon: '💘' },
  { id: 'stamp-infinity', category: 'stamp', itemId: 'infinity-emoji', name: 'Infinito', description: 'Amor sin fin', price: 140, currency: 'polen', icon: '♾️' },
  { id: 'stamp-ring', category: 'stamp', itemId: 'ring-emoji', name: 'Anillo', description: 'Compromiso eterno', price: 175, currency: 'polen', icon: '💍' },
  { id: 'stamp-gift', category: 'stamp', itemId: 'gift-emoji', name: 'Regalo', description: 'Sorpresa para tu amor', price: 130, currency: 'polen', icon: '🎁' },
  { id: 'stamp-clover', category: 'stamp', itemId: 'clover-emoji', name: 'Trébol', description: 'Suerte para la relación', price: 145, currency: 'polen', icon: '🍀' },
  { id: 'stamp-cherry', category: 'stamp', itemId: 'cherry-emoji', name: 'Cereza', description: 'Dulce y coqueta', price: 135, currency: 'polen', icon: '🍒' },
  
  // Premium stamps - Jalea Real (50-125)
  { id: 'stamp-moon', category: 'stamp', itemId: 'moon-emoji', name: 'Luna', description: 'Para noches especiales', price: 50, currency: 'jaleaReal', isPremium: true, icon: '🌙' },
  { id: 'stamp-crown', category: 'stamp', itemId: 'crown-emoji', name: 'Corona', description: 'Para mi reina/rey', price: 65, currency: 'jaleaReal', isPremium: true, icon: '👑' },
  { id: 'stamp-diamond', category: 'stamp', itemId: 'diamond-emoji', name: 'Diamante', description: 'Puro y eterno', price: 75, currency: 'jaleaReal', isPremium: true, icon: '💎' },
  { id: 'stamp-angel', category: 'stamp', itemId: 'angel-emoji', name: 'Ángel', description: 'Mi ángel guardián', price: 80, currency: 'jaleaReal', isPremium: true, icon: '👼' },
  { id: 'stamp-dove', category: 'stamp', itemId: 'dove-emoji', name: 'Paloma', description: 'Paz y amor', price: 85, currency: 'jaleaReal', isPremium: true, icon: '🕊️' },
  { id: 'stamp-teddy', category: 'stamp', itemId: 'teddy-emoji', name: 'Osito', description: 'Abrazo tierno', price: 90, currency: 'jaleaReal', isPremium: true, icon: '🧸' },
  { id: 'stamp-lovebirds', category: 'stamp', itemId: 'lovebirds-emoji', name: 'Tortolitos', description: 'Juntos para siempre', price: 100, currency: 'jaleaReal', isPremium: true, icon: '🐦' },
  { id: 'stamp-shooting-star', category: 'stamp', itemId: 'shooting-star-emoji', name: 'Estrella Fugaz', description: 'Pide un deseo', price: 125, currency: 'jaleaReal', isPremium: true, icon: '🌠' },
  { id: 'stamp-planet', category: 'stamp', itemId: 'planet-emoji', name: 'Planeta', description: 'Amor de otro mundo', price: 95, currency: 'jaleaReal', isPremium: true, icon: '🪐' },
  { id: 'stamp-balloon', category: 'stamp', itemId: 'balloon-emoji', name: 'Globo', description: 'Para celebrar juntos', price: 105, currency: 'jaleaReal', isPremium: true, icon: '🎈' },
  { id: 'stamp-wave', category: 'stamp', itemId: 'wave-emoji', name: 'Ola', description: 'Un hola con cariño', price: 85, currency: 'jaleaReal', isPremium: true, icon: '🌊' },

  // ========================================
  // === BORDER STYLES (12 items) ===
  // ========================================
  
  // Free border (1)
  { id: 'border-simple', category: 'borderStyle', itemId: 'simple', name: 'Simple', description: 'Elegante y minimalista', price: 0, currency: 'polen', icon: '▫️', isDefault: true },
  
  // Polen borders (6)
  { id: 'border-dashed', category: 'borderStyle', itemId: 'dashed', name: 'Punteado', description: 'Divertido y casual', price: 100, currency: 'polen', icon: '➖' },
  { id: 'border-airmail', category: 'borderStyle', itemId: 'airmail', name: 'Correo Aéreo', description: 'Estilo vintage', price: 150, currency: 'polen', icon: '✈️' },
  { id: 'border-hearts', category: 'borderStyle', itemId: 'hearts', name: 'Corazones', description: 'Rodeado de amor', price: 175, currency: 'polen', icon: '💕' },
  { id: 'border-stars', category: 'borderStyle', itemId: 'stars', name: 'Estrellas', description: 'Brilla con estilo', price: 175, currency: 'polen', icon: '⭐' },
  { id: 'border-waves', category: 'borderStyle', itemId: 'waves', name: 'Ondas', description: 'Fluido y elegante', price: 150, currency: 'polen', icon: '〰️' },
  { id: 'border-ribbon', category: 'borderStyle', itemId: 'ribbon', name: 'Listón', description: 'Como un regalo', price: 200, currency: 'polen', icon: '🎀' },
  
  // Premium borders - Jalea Real (5)
  { id: 'border-floral', category: 'borderStyle', itemId: 'floral', name: 'Floral', description: 'Romántico y hermoso', price: 100, currency: 'jaleaReal', isPremium: true, icon: '🌺' },
  { id: 'border-vintage', category: 'borderStyle', itemId: 'vintage', name: 'Vintage', description: 'Nostalgia elegante', price: 125, currency: 'jaleaReal', isPremium: true, icon: '🖼️' },
  { id: 'border-ornate', category: 'borderStyle', itemId: 'ornate', name: 'Ornamentado', description: 'Detalles exquisitos', price: 150, currency: 'jaleaReal', isPremium: true, icon: '🏛️' },
  { id: 'border-gold', category: 'borderStyle', itemId: 'gold', name: 'Dorado', description: 'Lujo real', price: 175, currency: 'jaleaReal', isPremium: true, icon: '✨' },
  { id: 'border-lace', category: 'borderStyle', itemId: 'lace', name: 'Encaje', description: 'Delicado y femenino', price: 150, currency: 'jaleaReal', isPremium: true, icon: '🧵' },
  { id: 'border-constellation', category: 'borderStyle', itemId: 'constellation', name: 'Constelación', description: 'Cielo estrellado animado', price: 180, currency: 'jaleaReal', isPremium: true, icon: '🌌' },
  { id: 'border-petals', category: 'borderStyle', itemId: 'petals', name: 'Pétalos', description: 'Pétalos con movimiento suave', price: 165, currency: 'jaleaReal', isPremium: true, icon: '🌸' },
  { id: 'border-neon', category: 'borderStyle', itemId: 'neon', name: 'Neón', description: 'Brillo moderno animado', price: 190, currency: 'jaleaReal', isPremium: true, icon: '💜' },
  { id: 'border-honeycomb', category: 'borderStyle', itemId: 'honeycomb', name: 'Panal', description: 'Patrón de colmena premium', price: 175, currency: 'jaleaReal', isPremium: true, icon: '🐝' },

  // ========================================
  // === FONTS (20 items) ===
  // ========================================
  
  // Free fonts (2)
  { id: 'font-indie', category: 'font', itemId: 'Indie_Flower', name: 'Indie Flower', description: 'Escritura casual', price: 0, currency: 'polen', icon: '✏️', isDefault: true },
  { id: 'font-belleza', category: 'font', itemId: 'Belleza', name: 'Belleza', description: 'Elegante y limpia', price: 0, currency: 'polen', icon: '📝', isDefault: true },
  
  // Polen fonts - Tier 1 (100-150)
  { id: 'font-caveat', category: 'font', itemId: 'Caveat', name: 'Caveat', description: 'Escritura a mano', price: 100, currency: 'polen', icon: '🖊️' },
  { id: 'font-amatic', category: 'font', itemId: 'Amatic_SC', name: 'Amatic SC', description: 'Divertida y única', price: 100, currency: 'polen', icon: '🎨' },
  { id: 'font-shadows', category: 'font', itemId: 'Shadows_Into_Light', name: 'Shadows Into Light', description: 'Suave y soñadora', price: 125, currency: 'polen', icon: '🌟' },
  { id: 'font-patrick', category: 'font', itemId: 'Patrick_Hand', name: 'Patrick Hand', description: 'Amigable y casual', price: 125, currency: 'polen', icon: '👋' },
  { id: 'font-architects', category: 'font', itemId: 'Architects_Daughter', name: 'Architects Daughter', description: 'Técnica y artística', price: 150, currency: 'polen', icon: '📐' },
  
  // Polen fonts - Tier 2 (150-250)
  { id: 'font-dancing', category: 'font', itemId: 'Dancing_Script', name: 'Dancing Script', description: 'Cursiva elegante', price: 150, currency: 'polen', icon: '💃' },
  { id: 'font-pacifico', category: 'font', itemId: 'Pacifico', name: 'Pacifico', description: 'Relajada y playera', price: 175, currency: 'polen', icon: '🏖️' },
  { id: 'font-permanent', category: 'font', itemId: 'Permanent_Marker', name: 'Permanent Marker', description: 'Fuerte y audaz', price: 175, currency: 'polen', icon: '🖍️' },
  { id: 'font-sacramento', category: 'font', itemId: 'Sacramento', name: 'Sacramento', description: 'Romántica cursiva', price: 200, currency: 'polen', icon: '💕' },
  { id: 'font-satisfy', category: 'font', itemId: 'Satisfy', name: 'Satisfy', description: 'Satisfacción garantizada', price: 200, currency: 'polen', icon: '😊' },
  { id: 'font-cookie', category: 'font', itemId: 'Cookie', name: 'Cookie', description: 'Dulce como galleta', price: 175, currency: 'polen', icon: '🍪' },
  { id: 'font-courgette', category: 'font', itemId: 'Courgette', name: 'Courgette', description: 'Sofisticada y fluida', price: 225, currency: 'polen', icon: '🎭' },
  { id: 'font-lobster', category: 'font', itemId: 'Lobster', name: 'Lobster', description: 'Audaz y retro', price: 250, currency: 'polen', icon: '🦞' },
  
  // Premium fonts - Jalea Real (75-150)
  { id: 'font-great-vibes', category: 'font', itemId: 'Great_Vibes', name: 'Great Vibes', description: 'Vibrante y expresiva', price: 75, currency: 'jaleaReal', isPremium: true, icon: '🎉' },
  { id: 'font-kalam', category: 'font', itemId: 'Kalam', name: 'Kalam', description: 'Escritura natural', price: 85, currency: 'jaleaReal', isPremium: true, icon: '✍️' },
  { id: 'font-allura', category: 'font', itemId: 'Allura', name: 'Allura', description: 'Caligrafía elegante', price: 100, currency: 'jaleaReal', isPremium: true, icon: '🪶' },
  { id: 'font-tangerine', category: 'font', itemId: 'Tangerine', name: 'Tangerine', description: 'Delicada y refinada', price: 100, currency: 'jaleaReal', isPremium: true, icon: '🍊' },
  { id: 'font-alex-brush', category: 'font', itemId: 'Alex_Brush', name: 'Alex Brush', description: 'Pincelada artística', price: 125, currency: 'jaleaReal', isPremium: true, icon: '🖌️' },
  { id: 'font-mr-dafoe', category: 'font', itemId: 'Mr_Dafoe', name: 'Mr Dafoe', description: 'Firma distinguida', price: 150, currency: 'jaleaReal', isPremium: true, icon: '🎩' },

  // ========================================
  // === SPECIAL ITEMS (10 items) ===
  // ========================================
  
  // Special backgrounds and effects
  { id: 'special-confetti', category: 'special', itemId: 'confetti', name: 'Confeti', description: 'Celebra cada carta', price: 300, currency: 'polen', icon: '🎊' },
  { id: 'special-sparkles', category: 'special', itemId: 'sparkles', name: 'Brillos', description: 'Añade destellos mágicos', price: 350, currency: 'polen', icon: '✨' },
  { id: 'special-petals', category: 'special', itemId: 'petals', name: 'Pétalos', description: 'Lluvia de pétalos de rosa', price: 400, currency: 'polen', icon: '🌸' },
  { id: 'special-hearts-float', category: 'special', itemId: 'hearts-float', name: 'Corazones Flotantes', description: 'Corazones que flotan', price: 450, currency: 'polen', icon: '💕' },
  { id: 'special-snow', category: 'special', itemId: 'snow', name: 'Nieve', description: 'Copos de nieve suaves', price: 400, currency: 'polen', icon: '❄️' },
  { id: 'special-stars-parallax', category: 'special', itemId: 'stars-parallax', name: 'Cielo Estelar', description: 'Fondo con estrellas en movimiento', price: 500, currency: 'polen', icon: '🌟' },
  { id: 'special-heartbeat', category: 'special', itemId: 'heartbeat', name: 'Latido', description: 'Pulso de corazones tenue', price: 520, currency: 'polen', icon: '💓' },
  { id: 'special-lanterns', category: 'special', itemId: 'lanterns', name: 'Faroles', description: 'Faroles románticos flotantes', price: 550, currency: 'polen', icon: '🏮' },
  
  // Premium special items
  { id: 'special-fireworks', category: 'special', itemId: 'fireworks', name: 'Fuegos Artificiales', description: 'Explosión de colores', price: 150, currency: 'jaleaReal', isPremium: true, icon: '🎆' },
  { id: 'special-music', category: 'special', itemId: 'music', name: 'Melodía', description: 'Música de fondo romántica', price: 200, currency: 'jaleaReal', isPremium: true, icon: '🎵' },
  { id: 'special-aurora-effect', category: 'special', itemId: 'aurora-effect', name: 'Efecto Aurora', description: 'Aurora boreal de fondo', price: 250, currency: 'jaleaReal', isPremium: true, icon: '🌌' },
  { id: 'special-golden-frame', category: 'special', itemId: 'golden-frame', name: 'Marco Dorado', description: 'Marco exclusivo dorado', price: 300, currency: 'jaleaReal', isPremium: true, icon: '🏆' },
  { id: 'special-animated-seal', category: 'special', itemId: 'animated-seal', name: 'Sello Animado', description: 'Sello con animación especial', price: 350, currency: 'jaleaReal', isPremium: true, icon: '💫' },
  { id: 'special-comet-trail', category: 'special', itemId: 'comet-trail', name: 'Estela de Cometa', description: 'Brillo dinámico alrededor de la carta', price: 220, currency: 'jaleaReal', isPremium: true, icon: '☄️' },
  { id: 'special-rose-perfume', category: 'special', itemId: 'rose-perfume', name: 'Aroma de Rosa', description: 'Efecto visual suave de pétalos', price: 260, currency: 'jaleaReal', isPremium: true, icon: '🥀' },
];

// =====================
// WEEKLY TASKS
// =====================
export const WEEKLY_TASKS: WeeklyTask[] = [
  {
    id: 'task-send-3',
    type: 'send_letters',
    title: 'Cartero Novato',
    description: 'Envía 3 cartas esta semana',
    target: 3,
    reward: { amount: 50, currency: 'polen' },
    icon: '📮',
  },
  {
    id: 'task-send-7',
    type: 'send_letters',
    title: 'Cartero Experto',
    description: 'Envía 7 cartas esta semana',
    target: 7,
    reward: { amount: 150, currency: 'polen' },
    icon: '📬',
  },
  {
    id: 'task-read-5',
    type: 'read_letters',
    title: 'Lector Atento',
    description: 'Lee 5 cartas de tu amor',
    target: 5,
    reward: { amount: 75, currency: 'polen' },
    icon: '📖',
  },
  {
    id: 'task-long-letter',
    type: 'write_long_letter',
    title: 'Escritor Apasionado',
    description: 'Escribe una carta de más de 500 caracteres',
    target: 1,
    reward: { amount: 100, currency: 'polen' },
    icon: '📝',
  },
  {
    id: 'task-colors',
    type: 'use_different_colors',
    title: 'Artista del Papel',
    description: 'Usa 3 colores de papel diferentes',
    target: 3,
    reward: { amount: 75, currency: 'polen' },
    icon: '🎨',
  },
  {
    id: 'task-stamps',
    type: 'use_stamps',
    title: 'Coleccionista de Sellos',
    description: 'Usa 4 sellos diferentes',
    target: 4,
    reward: { amount: 100, currency: 'polen' },
    icon: '📮',
  },
  {
    id: 'task-login-streak',
    type: 'login_streak',
    title: 'Abeja Constante',
    description: 'Inicia sesión 5 días seguidos',
    target: 5,
    reward: { amount: 200, currency: 'polen' },
    icon: '🐝',
  },
  {
    id: 'task-watch-ads',
    type: 'watch_ad',
    title: 'Abeja Trabajadora',
    description: 'Mira 3 anuncios para ganar polen extra',
    target: 3,
    reward: { amount: 25, currency: 'jaleaReal' },
    icon: '🎬',
  },
];

// =====================
// PURCHASE PACKAGES (Jalea Real)
// =====================
export const PURCHASE_PACKAGES: PurchasePackage[] = [
  {
    id: 'pack-starter',
    name: 'Gota de Miel',
    jaleaReal: 100,
    priceUSD: 0.99,
  },
  {
    id: 'pack-sweet',
    name: 'Tarro de Miel',
    jaleaReal: 500,
    priceUSD: 3.99,
    bonusPercent: 10,
  },
  {
    id: 'pack-honeycomb',
    name: 'Panal Dorado',
    jaleaReal: 1200,
    priceUSD: 7.99,
    bonusPercent: 20,
    isPopular: true,
  },
  {
    id: 'pack-hive',
    name: 'Colmena Real',
    jaleaReal: 3000,
    priceUSD: 14.99,
    bonusPercent: 35,
    isBestValue: true,
  },
  {
    id: 'pack-queen',
    name: 'Tesoro de la Reina',
    jaleaReal: 7500,
    priceUSD: 29.99,
    bonusPercent: 50,
  },
];

// =====================
// AD REWARD CONFIG
// =====================
export const AD_REWARD_CONFIG: AdRewardConfig = {
  rewardAmount: 15, // Polen per ad
  maxAdsPerDay: 5,
  cooldownMinutes: 5,
};

// =====================
// HELPER FUNCTIONS
// =====================
export function getShopItemsByCategory(category: ShopItem['category']): ShopItem[] {
  return SHOP_ITEMS.filter(item => item.category === category);
}

export function getShopItem(itemId: string): ShopItem | undefined {
  return SHOP_ITEMS.find(item => item.id === itemId);
}

export function isItemOwned(inventory: UserInventory, item: ShopItem): boolean {
  switch (item.category) {
    case 'paperColor':
      return inventory.paperColors.includes(item.itemId as any);
    case 'stamp':
      return inventory.stamps.includes(item.itemId as any);
    case 'borderStyle':
      return inventory.borderStyles.includes(item.itemId as any);
    case 'font':
      return inventory.fonts.includes(item.itemId as any);
    case 'special':
      return inventory.special.includes(item.itemId);
    default:
      return false;
  }
}

export function getWeekStartDate(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}
