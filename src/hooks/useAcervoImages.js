import { useState, useEffect } from 'react';
import { getCollections } from '../api';

const API = import.meta.env.VITE_API_URL || '';

/**
 * Puxa as coleções do acervo e expõe utilitários de imagem reais:
 *  - collections: lista crua
 *  - slides: pronto para o <Carousel /> (só coleções com capa)
 *  - banners: array de URLs de capa (para usar como fundo de cabeçalho)
 *  - loading
 */
export default function useAcervoImages() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getCollections()
      .then((r) => { if (alive) setCollections(Array.isArray(r.data) ? r.data : []); })
      .catch(() => { if (alive) setCollections([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const withCover = collections.filter((c) => c.cover_image);

  const slides = withCover.map((c) => ({
    id: c.id,
    image: `${API}${c.cover_image}`,
    title: c.name,
    subtitle: 'Acervo · Coleção',
    to: `/acervo/${c.slug}`,
  }));

  const banners = withCover.map((c) => `${API}${c.cover_image}`);

  // devolve um banner por índice, com wrap-around (null se não houver nenhum)
  const bannerAt = (i = 0) => (banners.length ? banners[i % banners.length] : null);

  return { collections, slides, banners, bannerAt, loading };
}
