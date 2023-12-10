


const ErrorMessage = ({ error }) => {

  return (
    <div role="alert" className="rounded border-s-4 border-red-500 bg-red-50 p-4">
        <strong className="block font-medium text-red-800"> Something went wrong </strong>
        <p className="mt-2 text-sm text-red-700">
            {error}
        </p>
    </div>
  );
};

export default ErrorMessage;