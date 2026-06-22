
UniversalCardBody.propTypes = {
  displayTitle: PropTypes.string,
  displayExcerpt: PropTypes.string,
  subtitle: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  cardUrl: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
};
