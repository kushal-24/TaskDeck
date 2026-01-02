const letterColors = {
    A: '#EF4444',
    B: '#F97316',
    C: '#EAB308',
    D: '#22C55E',
    E: '#10B981',
    F: '#14B8A6',
    G: '#06B6D4',
    H: '#0EA5E9',
    I: '#3B82F6',
    J: '#6366F1',
    K: '#8B5CF6',
    L: '#A855F7',
    M: '#D946EF',
    N: '#EC4899',
    O: '#F43F5E',
    P: '#EF4444',
    Q: '#F97316',
    R: '#EAB308',
    S: '#22C55E',
    T: '#10B981',
    U: '#14B8A6',
    V: '#06B6D4',
    W: '#0EA5E9',
    X: '#3B82F6',
    Y: '#6366F1',
    Z: '#8B5CF6',
  };
  
  const LetterAvatar = ({ letter, size = 40 }) => {
    const bgColor =
      letterColors[letter?.toUpperCase()] || '#06B6D4';
  
    return (
      <div
        className="flex items-center justify-center rounded-full font-bold text-white"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: bgColor,
          fontSize: `${size * 0.5}px`,
        }}
      >
        {letter?.toUpperCase()}
      </div>
    );
  };
  
  export default LetterAvatar;
  