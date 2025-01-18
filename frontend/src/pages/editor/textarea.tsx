import PropTypes from 'prop-types';

export const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`w-full min-h-[100px] rounded-md border border-gray-300 
                 bg-white px-3 py-2 text-sm text-gray-900
                 placeholder:text-gray-500 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 disabled:cursor-not-allowed disabled:opacity-50
                 resize-y transition-colors ${className}`}
      {...props}
    />
  );
};

Textarea.propTypes = {
  className: PropTypes.string
};

Textarea.defaultProps = {
  className: ""
};