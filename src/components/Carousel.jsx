import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './Carousel.css';

/**
 * Carrossel/banner de imagens.
 *
 * props:
 *  - slides: [{ id, image, title, subtitle, to }]
 *  - autoPlay: ms entre trocas automáticas (0 = desliga). Pausa no hover.
 *  - aspect: altura do banner (CSS, ex '64vh').
 */
export default function Carousel({ slides = [], autoPlay = 6000, aspect = '62vh' }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, dx: 0 });
  const [dragOffset, setDragOffset] = useState(0);

  const count = slides.length;
  const clamp = useCallback((i) => (i + count) % count, [count]);

  const goTo = useCallback((i) => setIndex(clamp(i)), [clamp]);
  const next = useCallback(() => setIndex((i) => clamp(i + 1)), [clamp]);
  const prev = useCallback(() => setIndex((i) => clamp(i - 1)), [clamp]);

  // Auto-play (pausa no hover ou durante o arrasto)
  useEffect(() => {
    if (!autoPlay || count <= 1 || paused || drag.current.active) return;
    const t = setTimeout(next, autoPlay);
    return () => clearTimeout(t);
  }, [autoPlay, count, paused, index, next]);

  // Setas do teclado
  useEffect(() => {
    if (count <= 1) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, prev, next]);

  // ── Arrasto manual (pointer events: mouse + touch) ──
  const onPointerDown = (e) => {
    if (count <= 1) return;
    drag.current = { active: true, startX: e.clientX, dx: 0 };
    setPaused(true);
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    drag.current.dx = e.clientX - drag.current.startX;
    setDragOffset(drag.current.dx);
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    const { dx } = drag.current;
    const w = trackRef.current?.offsetWidth || 1;
    const threshold = Math.min(120, w * 0.15);
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
    drag.current = { active: false, startX: 0, dx: 0 };
    setDragOffset(0);
    setPaused(false);
  };

  if (count === 0) return null;

  return (
    <div
      className="carousel"
      style={{ height: aspect }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); endDrag(); }}
    >
      <div
        ref={trackRef}
        className={`carousel__track${drag.current.active ? ' carousel__track--dragging' : ''}`}
        style={{ transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {slides.map((s) => (
          <div className="carousel__slide" key={s.id}>
            <img className="carousel__img" src={s.image} alt={s.title || ''} draggable={false} />
            <div className="carousel__shade" />
            {(s.title || s.subtitle) && (
              <div className="carousel__caption">
                {s.subtitle && <span className="carousel__eyebrow mono">{s.subtitle}</span>}
                {s.title && <h2 className="carousel__title">{s.title}</h2>}
                {s.to && (
                  <Link
                    className="carousel__cta mono"
                    to={s.to}
                    onClick={(e) => e.stopPropagation()}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    Ver coleção <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button className="carousel__nav carousel__nav--prev" onClick={prev} aria-label="Anterior">
            <ArrowLeft size={22} />
          </button>
          <button className="carousel__nav carousel__nav--next" onClick={next} aria-label="Próximo">
            <ArrowRight size={22} />
          </button>

          <div className="carousel__bullets">
            {slides.map((s, i) => (
              <button
                key={s.id}
                className={`carousel__bullet${i === index ? ' carousel__bullet--active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Ir para imagem ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
