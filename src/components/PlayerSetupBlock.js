// PlayerSetupBlock.js

const PlayerSetupBlock = ({ label, name, status, getStatusColor }) => {
  const statusColorClass = getStatusColor(status); // This will be used for both text and border

  return (
    <div className="flex items-center mb-2">
      <div className={`bg-position-blue text-white font-bold p-1 rounded text-center w-12 mr-3`}>
        {label}
      </div>
      <select 
        className={`form-select bg-white ${statusColorClass} border ${statusColorClass} rounded-lg text-neutral-600 ml-2`}
        style={{ width: 'max-content', padding: '0.5rem 1rem' }}
        defaultValue={name}
      >
        <option value={name}>{name}</option>
      </select>
      <span className={`ml-4 ${statusColorClass}`}>{status}</span>
    </div>
  );
};

export default PlayerSetupBlock;


