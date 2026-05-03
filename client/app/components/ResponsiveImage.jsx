import { buildResponsiveImageSrcSet, resolveImageUrl } from "../services/api.js";

const defaultWidths = [480, 768, 1024, 1280, 1600, 1920];

const ResponsiveImage = ({
  src,
  alt,
  className = "",
  sizes = "100vw",
  widths = defaultWidths,
  transformOptions = {},
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  ...rest
}) => {
  const resolvedSrc = resolveImageUrl(src, transformOptions);
  const srcSet = buildResponsiveImageSrcSet(src, widths, transformOptions);

  return (
    <img
      src={resolvedSrc}
      srcSet={srcSet || undefined}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      {...rest}
    />
  );
};

export default ResponsiveImage;
